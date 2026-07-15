import crypto from "node:crypto";

export const PHASES = ["lobby", "briefing", "preparation", "performance", "finale", "verdict"];
const PHASE_DURATIONS = { briefing: 12, preparation: 20, performance: null, finale: 25 };

export function createEngine({ scenes, reactions, onBroadcast }) {
  const rooms = new Map();
  const reactionMap = new Map(reactions.map((r) => [r.id, r]));

  function code() {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    for (let attempt = 0; attempt < 100; attempt += 1) {
      let value = "";
      for (let i = 0; i < 5; i += 1) value += alphabet[crypto.randomInt(alphabet.length)];
      if (!rooms.has(value)) return value;
    }
    throw new Error("Impossible de générer un code de salle.");
  }

  function token() { return crypto.randomBytes(24).toString("base64url"); }
  function id(prefix) { return `${prefix}_${crypto.randomBytes(8).toString("hex")}`; }

  function addEvent(room, text, kind = "info") {
    room.events.unshift({ id: id("evt"), at: Date.now(), text, kind });
    room.events = room.events.slice(0, 40);
  }

  function createRoom(hostName = "Comédien") {
    const roomCode = code();
    const hostId = id("player");
    const hostToken = token();
    const scene = scenes[0];
    const room = {
      code: roomCode,
      createdAt: Date.now(), updatedAt: Date.now(),
      phase: "lobby", phaseEndsAt: null,
      sceneId: scene.id, lineIndex: 0,
      hostId, actorId: hostId,
      players: new Map(), events: [], effects: [],
      metrics: { linesCompleted: 0, recoveries: 0, applause: 0, negativeReactions: 0, finaleReached: false },
      verdict: null
    };
    room.players.set(hostId, { id: hostId, token: hostToken, name: cleanName(hostName), role: "actor", ready: true, energy: 5, lastEnergyAt: Date.now(), cooldowns: {} });
    addEvent(room, `${cleanName(hostName)} ouvre la salle.`);
    rooms.set(roomCode, room);
    return { room, player: room.players.get(hostId) };
  }

  function joinRoom(roomCode, name) {
    const room = getRoom(roomCode);
    if (room.phase !== "lobby") throw gameError(409, "La représentation a déjà commencé.");
    if (room.players.size >= 12) throw gameError(409, "La salle est complète.");
    const playerId = id("player");
    const player = { id: playerId, token: token(), name: cleanName(name), role: "audience", ready: true, energy: 5, lastEnergyAt: Date.now(), cooldowns: {} };
    room.players.set(playerId, player);
    room.updatedAt = Date.now();
    addEvent(room, `${player.name} rejoint le public.`);
    broadcast(room);
    return { room, player };
  }

  function authenticate(roomCode, playerId, playerToken) {
    const room = getRoom(roomCode);
    const player = room.players.get(playerId);
    if (!player || player.token !== playerToken) throw gameError(401, "Session invalide.");
    return { room, player };
  }

  function command(roomCode, playerId, playerToken, type, payload = {}) {
    const { room, player } = authenticate(roomCode, playerId, playerToken);
    room.updatedAt = Date.now();
    regenerateEnergy(player);

    if (type === "SET_SCENE") {
      requireHost(room, player);
      if (room.phase !== "lobby") throw gameError(409, "Le thème ne peut plus être changé.");
      if (!scenes.some((s) => s.id === payload.sceneId)) throw gameError(400, "Scène inconnue.");
      room.sceneId = payload.sceneId;
      addEvent(room, `Nouveau thème sélectionné : ${sceneFor(room).title}.`);
    } else if (type === "START_MATCH") {
      requireHost(room, player);
      if (room.players.size < 1) throw gameError(409, "Aucun joueur dans la salle.");
      resetMatch(room);
      setPhase(room, "briefing");
      addEvent(room, "Le briefing commence.", "phase");
    } else if (type === "ADVANCE_PHASE") {
      requireHost(room, player);
      advancePhase(room);
    } else if (type === "NEXT_LINE") {
      requireActor(room, player);
      if (!["performance", "finale"].includes(room.phase)) throw gameError(409, "La scène n’est pas en cours.");
      const scene = sceneFor(room);
      if (room.lineIndex < scene.lines.length - 1) {
        room.lineIndex += 1;
        room.metrics.linesCompleted = Math.max(room.metrics.linesCompleted, room.lineIndex);
        addEvent(room, "Une nouvelle réplique commence.");
        for (const p of room.players.values()) if (p.role === "audience") p.energy = Math.min(6, p.energy + 1);
      } else {
        room.metrics.linesCompleted = scene.lines.length;
        if (room.phase !== "finale") setPhase(room, "finale");
        else finish(room);
      }
    } else if (type === "RECOVERED") {
      requireActor(room, player);
      if (!["performance", "finale"].includes(room.phase)) throw gameError(409, "La scène n’est pas en cours.");
      const recentIncident = room.effects.some((e) => !e.recovered && e.type !== "applause");
      if (!recentIncident) throw gameError(409, "Aucun incident récent à récupérer.");
      const incident = room.effects.find((e) => !e.recovered && e.type !== "applause");
      incident.recovered = true;
      room.metrics.recoveries += 1;
      addEvent(room, "Le comédien transforme l’incident en improvisation !", "positive");
    } else if (type === "REACTION") {
      playReaction(room, player, payload.reactionId);
    } else if (type === "RESTART") {
      requireHost(room, player);
      room.phase = "lobby"; room.phaseEndsAt = null; resetMatch(room);
      addEvent(room, "La troupe prépare une nouvelle représentation.", "phase");
    } else if (type === "END_MATCH") {
      requireHost(room, player); finish(room);
    } else {
      throw gameError(400, "Commande inconnue.");
    }

    broadcast(room);
    return personalizedState(room, player);
  }

  function playReaction(room, player, reactionId) {
    if (player.role !== "audience") throw gameError(403, "Seul le public peut jouer cette réaction.");
    if (!["performance", "finale"].includes(room.phase)) throw gameError(409, "Les réactions sont disponibles pendant la représentation.");
    const reaction = reactionMap.get(reactionId);
    if (!reaction) throw gameError(400, "Réaction inconnue.");
    regenerateEnergy(player);
    if (player.energy < reaction.cost) throw gameError(409, "Pas assez de tomates.");
    const availableAt = player.cooldowns[reaction.id] || 0;
    if (availableAt > Date.now()) throw gameError(429, "Cette réaction se recharge encore.");
    pruneEffects(room);
    const activeSeverity = room.effects.reduce((sum, effect) => sum + (effect.severity || 0), 0);
    if (reaction.severity > 0 && activeSeverity + reaction.severity > 4) throw gameError(409, "Le budget de gêne est déjà atteint.");
    if (reaction.id === "tomato" && room.effects.filter((e) => e.type === "tomato").length >= 3) throw gameError(409, "Le prompteur est déjà assez sale.");

    player.energy -= reaction.cost;
    player.cooldowns[reaction.id] = Date.now() + reaction.cooldownMs;
    const scene = sceneFor(room);
    const effect = {
      id: id("fx"), type: reaction.id, label: reaction.label, severity: reaction.severity,
      startsAt: Date.now(), endsAt: Date.now() + reaction.durationMs,
      by: player.name, recovered: false,
      x: crypto.randomInt(18, 83), y: crypto.randomInt(18, 78), rotation: crypto.randomInt(-55, 56),
      word: reaction.id === "forbidden" ? scene.forbiddenWords[crypto.randomInt(scene.forbiddenWords.length)] : null
    };
    room.effects.push(effect);
    if (reaction.kind === "positive") {
      room.metrics.applause += 1;
      room.phaseEndsAt = room.phaseEndsAt ? room.phaseEndsAt + 8000 : null;
      const splat = room.effects.find((e) => e.type === "tomato");
      if (splat) room.effects = room.effects.filter((e) => e.id !== splat.id);
      addEvent(room, `${player.name} déclenche des applaudissements.`, "positive");
    } else {
      room.metrics.negativeReactions += 1;
      addEvent(room, `${player.name} joue « ${reaction.label} ».`, "incident");
    }
  }

  function tick() {
    const now = Date.now();
    for (const room of rooms.values()) {
      let changed = false;
      for (const player of room.players.values()) {
        const beforeEnergy = player.energy;
        regenerateEnergy(player);
        if (player.energy !== beforeEnergy) changed = true;
      }
      const before = room.effects.length;
      pruneEffects(room);
      if (room.phaseEndsAt && room.phaseEndsAt <= now && room.phase !== "verdict") advancePhase(room);
      if (before !== room.effects.length || changed) broadcast(room);
      if (now - room.updatedAt > 3 * 60 * 60 * 1000) rooms.delete(room.code);
    }
  }

  function advancePhase(room) {
    if (room.phase === "lobby") setPhase(room, "briefing");
    else if (room.phase === "briefing") setPhase(room, "preparation");
    else if (room.phase === "preparation") setPhase(room, "performance");
    else if (room.phase === "performance") setPhase(room, "finale");
    else if (room.phase === "finale") finish(room);
    addEvent(room, phaseMessage(room.phase), "phase");
    broadcast(room);
  }

  function setPhase(room, phase) {
    room.phase = phase;
    if (phase === "performance") room.phaseEndsAt = Date.now() + sceneFor(room).durationSeconds * 1000;
    else if (PHASE_DURATIONS[phase]) room.phaseEndsAt = Date.now() + PHASE_DURATIONS[phase] * 1000;
    else room.phaseEndsAt = null;
    if (phase === "finale") room.metrics.finaleReached = true;
  }

  function finish(room) {
    const scene = sceneFor(room);
    room.metrics.linesCompleted = Math.max(room.metrics.linesCompleted, room.lineIndex + 1);
    const continuity = Math.round(40 * Math.min(1, room.metrics.linesCompleted / scene.lines.length));
    const recovery = Math.min(30, room.metrics.recoveries * 10);
    const audience = Math.min(20, room.metrics.applause * 5 + Math.min(10, room.metrics.negativeReactions));
    const ending = room.metrics.finaleReached ? 10 : 0;
    const total = Math.min(100, continuity + recovery + audience + ending);
    room.verdict = {
      total, continuity, recovery, audience, ending,
      title: total >= 80 ? "Triomphe chaotique" : total >= 60 ? "Succès malgré tout" : total >= 40 ? "Catastrophe divertissante" : "Première désastreuse",
      quote: verdictQuote(total, room)
    };
    room.phase = "verdict"; room.phaseEndsAt = null; room.effects = [];
    addEvent(room, `Rideau ! Verdict : ${room.verdict.title}.`, "phase");
    broadcast(room);
  }

  function personalizedState(room, player) {
    regenerateEnergy(player); pruneEffects(room);
    const scene = sceneFor(room);
    const base = {
      roomCode: room.code, phase: room.phase, phaseEndsAt: room.phaseEndsAt,
      serverNow: Date.now(), scene: { id: scene.id, title: scene.title, theme: scene.theme },
      lineIndex: room.lineIndex, effects: room.effects, events: room.events,
      players: [...room.players.values()].map((p) => ({ id: p.id, name: p.name, role: p.role })),
      actorId: room.actorId, hostId: room.hostId, verdict: room.verdict,
      availableScenes: player.id === room.hostId && room.phase === "lobby" ? scenes.map(({id,title,theme}) => ({id,title,theme})) : undefined,
      me: { id: player.id, name: player.name, role: player.role, isHost: player.id === room.hostId, energy: player.energy, cooldowns: player.cooldowns }
    };
    if (player.role === "actor") {
      base.private = { brief: scene.actorBrief, secretGoal: scene.secretGoal, line: scene.lines[room.lineIndex], totalLines: scene.lines.length };
    } else {
      base.private = { brief: scene.audienceBrief, reactions };
    }
    return base;
  }

  function publicRoomState(roomCode) {
    const room = getRoom(roomCode); const scene = sceneFor(room);
    return { code: room.code, phase: room.phase, title: scene.title, theme: scene.theme, players: room.players.size };
  }

  function getRoom(roomCode) {
    const room = rooms.get(String(roomCode || "").trim().toUpperCase());
    if (!room) throw gameError(404, "Salle introuvable.");
    return room;
  }
  function sceneFor(room) { return scenes.find((s) => s.id === room.sceneId) || scenes[0]; }
  function requireHost(room, player) { if (player.id !== room.hostId) throw gameError(403, "Commande réservée à l’hôte."); }
  function requireActor(room, player) { if (player.id !== room.actorId) throw gameError(403, "Commande réservée au comédien."); }
  function resetMatch(room) { room.lineIndex = 0; room.effects = []; room.verdict = null; room.metrics = { linesCompleted: 0, recoveries: 0, applause: 0, negativeReactions: 0, finaleReached: false }; for (const p of room.players.values()) { p.energy = 5; p.cooldowns = {}; p.lastEnergyAt = Date.now(); } }
  function pruneEffects(room) { const now = Date.now(); room.effects = room.effects.filter((e) => e.endsAt > now); }
  function regenerateEnergy(player) { const now = Date.now(); const gained = Math.floor((now - player.lastEnergyAt) / 20000); if (gained > 0) { player.energy = Math.min(6, player.energy + gained); player.lastEnergyAt += gained * 20000; } }
  function cleanName(value) { const name = String(value || "Joueur").trim().replace(/[<>]/g, "").slice(0, 24); return name || "Joueur"; }
  function phaseMessage(phase) { return ({briefing:"Le briefing commence.",preparation:"Préparez la représentation.",performance:"Le rideau se lève !",finale:"Dernière ligne droite : concluez !",verdict:"Place au verdict."})[phase] || "Nouvelle phase."; }
  function verdictQuote(total, room) { if (total >= 80) return "Une maîtrise impressionnante de l’accident organisé."; if (total >= 60) return "Personne ne sait exactement ce qui s’est passé, mais le public en redemande."; if (total >= 40) return `Une représentation sauvée par ${room.metrics.recoveries} improvisation(s) courageuse(s).`; return "Le rideau est tombé. Une partie du décor aussi."; }
  function broadcast(room) { room.updatedAt = Date.now(); onBroadcast(room); }
  function gameError(status, message) { const error = new Error(message); error.status = status; return error; }

  setInterval(tick, 1000).unref();
  return { createRoom, joinRoom, authenticate, command, personalizedState, publicRoomState, getRoom };
}
