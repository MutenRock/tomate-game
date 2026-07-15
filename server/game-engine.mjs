import crypto from "node:crypto";

export const PHASES = ["lobby", "briefing", "preparation", "performance", "finale", "verdict"];
const PHASE_DURATIONS = { briefing: 20, preparation: 45, performance: null, finale: 45 };

export function createEngine({ scenes, reactions, onBroadcast }) {
  const rooms = new Map();
  const reactionMap = new Map(reactions.map((reaction) => [reaction.id, reaction]));

  function roomCode() {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    for (let attempt = 0; attempt < 100; attempt += 1) {
      let value = "";
      for (let index = 0; index < 5; index += 1) value += alphabet[crypto.randomInt(alphabet.length)];
      if (!rooms.has(value)) return value;
    }
    throw new Error("Impossible de générer un code de salle.");
  }

  function token() { return crypto.randomBytes(24).toString("base64url"); }
  function id(prefix) { return `${prefix}_${crypto.randomBytes(8).toString("hex")}`; }

  function addEvent(room, text, kind = "info") {
    room.events.unshift({ id: id("evt"), at: Date.now(), text, kind });
    room.events = room.events.slice(0, 50);
  }

  function createRoom(hostName = "Comédien", actorSlots = 1) {
    const code = roomCode();
    const hostId = id("player");
    const hostToken = token();
    const scene = scenes[0];
    const normalizedSlots = Number(actorSlots) === 2 ? 2 : 1;
    const room = {
      code,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      phase: "lobby",
      phaseEndsAt: null,
      sceneId: scene.id,
      lineIndex: 0,
      hostId,
      actorSlots: normalizedSlots,
      actorIds: [hostId, null],
      players: new Map(),
      events: [],
      effects: [],
      metrics: freshMetrics(),
      verdict: null
    };
    const player = playerRecord(hostId, hostToken, hostName, "actor", 0);
    room.players.set(hostId, player);
    addEvent(room, `${player.name} ouvre la salle en mode ${normalizedSlots === 2 ? "duo" : "solo"}.`);
    rooms.set(code, room);
    return { room, player };
  }

  function joinRoom(code, name, requestedRole = "audience") {
    const room = getRoom(code);
    if (room.phase !== "lobby") throw gameError(409, "La représentation a déjà commencé.");
    if (room.players.size >= 12) throw gameError(409, "La salle est complète.");

    const playerId = id("player");
    let role = "audience";
    let actorSlot = null;
    if (requestedRole === "actor") {
      if (room.actorSlots < 2) throw gameError(409, "Cette salle est configurée pour un seul comédien.");
      if (room.actorIds[1]) throw gameError(409, "La place de second comédien est déjà prise.");
      role = "actor";
      actorSlot = 1;
      room.actorIds[1] = playerId;
    }

    const player = playerRecord(playerId, token(), name, role, actorSlot);
    room.players.set(playerId, player);
    room.updatedAt = Date.now();
    addEvent(room, role === "actor" ? `${player.name} rejoint la troupe comme second comédien.` : `${player.name} rejoint le public.`);
    broadcast(room);
    return { room, player };
  }

  function authenticate(code, playerId, playerToken) {
    const room = getRoom(code);
    const player = room.players.get(playerId);
    if (!player || player.token !== playerToken) throw gameError(401, "Session invalide.");
    return { room, player };
  }

  function command(code, playerId, playerToken, type, payload = {}) {
    const { room, player } = authenticate(code, playerId, playerToken);
    room.updatedAt = Date.now();
    regenerateEnergy(player);

    switch (type) {
      case "SET_SCENE":
        requireHost(room, player);
        requireLobby(room);
        if (!scenes.some((scene) => scene.id === payload.sceneId)) throw gameError(400, "Scène inconnue.");
        room.sceneId = payload.sceneId;
        addEvent(room, `Nouvelle histoire sélectionnée : ${sceneFor(room).title}.`);
        break;
      case "SET_ACTOR_SLOTS":
        requireHost(room, player);
        requireLobby(room);
        setActorSlots(room, Number(payload.actorSlots));
        break;
      case "SET_PLAYER_ROLE":
        requireHost(room, player);
        requireLobby(room);
        setPlayerRole(room, payload.playerId, payload.role);
        break;
      case "START_MATCH":
        requireHost(room, player);
        requireCastReady(room);
        resetMatch(room);
        setPhase(room, "briefing");
        addEvent(room, "Le briefing commence. Chaque comédien reçoit son rôle.", "phase");
        break;
      case "ADVANCE_PHASE":
        requireHost(room, player);
        advancePhase(room);
        break;
      case "NEXT_LINE":
        requireCurrentActor(room, player);
        nextLine(room);
        break;
      case "FORCE_NEXT_LINE":
        requireHost(room, player);
        if (!["performance", "finale"].includes(room.phase)) throw gameError(409, "La scène n’est pas en cours.");
        nextLine(room, true);
        break;
      case "RECOVERED":
        recoverIncident(room, player);
        break;
      case "REACTION":
        playReaction(room, player, payload.reactionId);
        break;
      case "RESTART":
        requireHost(room, player);
        room.phase = "lobby";
        room.phaseEndsAt = null;
        resetMatch(room);
        addEvent(room, "La troupe prépare une nouvelle représentation.", "phase");
        break;
      case "END_MATCH":
        requireHost(room, player);
        finish(room);
        break;
      default:
        throw gameError(400, "Commande inconnue.");
    }

    broadcast(room);
    return personalizedState(room, player);
  }

  function setActorSlots(room, value) {
    const slots = value === 2 ? 2 : 1;
    if (slots === room.actorSlots) return;
    if (slots === 1 && room.actorIds[1]) {
      const secondActor = room.players.get(room.actorIds[1]);
      if (secondActor) {
        secondActor.role = "audience";
        secondActor.actorSlot = null;
        secondActor.energy = 5;
      }
      room.actorIds[1] = null;
    }
    room.actorSlots = slots;
    addEvent(room, slots === 2 ? "La pièce sera jouée par deux comédiens." : "Un seul comédien interprétera les deux rôles.", "phase");
  }

  function setPlayerRole(room, targetId, role) {
    const target = room.players.get(targetId);
    if (!target || target.id === room.hostId) throw gameError(400, "Ce joueur ne peut pas changer de rôle.");
    if (role === "actor") {
      if (room.actorSlots !== 2) throw gameError(409, "Activez d’abord le mode deux comédiens.");
      if (room.actorIds[1] && room.actorIds[1] !== target.id) throw gameError(409, "La place de second comédien est déjà occupée.");
      target.role = "actor";
      target.actorSlot = 1;
      room.actorIds[1] = target.id;
      addEvent(room, `${target.name} devient second comédien.`);
    } else {
      if (target.role === "actor" && target.actorSlot === 1) room.actorIds[1] = null;
      target.role = "audience";
      target.actorSlot = null;
      target.energy = 5;
      addEvent(room, `${target.name} rejoint le public.`);
    }
  }

  function nextLine(room, forced = false) {
    if (!["performance", "finale"].includes(room.phase)) throw gameError(409, "La scène n’est pas en cours.");
    const scene = sceneFor(room);
    const current = scene.lines[room.lineIndex];
    room.metrics.linesCompleted = Math.max(room.metrics.linesCompleted, room.lineIndex + 1);
    room.metrics.actorTurns[current.actor] = (room.metrics.actorTurns[current.actor] || 0) + 1;

    if (room.lineIndex >= scene.lines.length - 1) {
      finish(room);
      return;
    }

    room.lineIndex += 1;
    const next = scene.lines[room.lineIndex];
    const progress = room.lineIndex / scene.lines.length;
    if (room.phase === "performance" && progress >= 0.82) setPhase(room, "finale");
    for (const participant of room.players.values()) {
      if (participant.role === "audience") participant.energy = Math.min(6, participant.energy + 1);
    }
    addEvent(room, `${forced ? "Passage forcé" : "Réplique terminée"} — ${castMember(scene, next.actor).name} prend la parole.`);
  }

  function recoverIncident(room, player) {
    requireCurrentActor(room, player);
    if (!["performance", "finale"].includes(room.phase)) throw gameError(409, "La scène n’est pas en cours.");
    const incident = room.effects.find((effect) => !effect.recovered && effect.type !== "applause" && effect.targetActorSlot === effectiveActorSlot(room, player));
    if (!incident) throw gameError(409, "Aucun incident récent ne cible votre rôle.");
    incident.recovered = true;
    room.metrics.recoveries += 1;
    addEvent(room, `${player.name} transforme l’incident en improvisation !`, "positive");
  }

  function playReaction(room, player, reactionId) {
    if (player.role !== "audience") throw gameError(403, "Seul le public peut jouer cette réaction.");
    if (!["performance", "finale"].includes(room.phase)) throw gameError(409, "Les réactions sont disponibles pendant la représentation.");
    const reaction = reactionMap.get(reactionId);
    if (!reaction) throw gameError(400, "Réaction inconnue.");
    regenerateEnergy(player);
    if (player.energy < reaction.cost) throw gameError(409, "Pas assez de tomates.");
    if ((player.cooldowns[reaction.id] || 0) > Date.now()) throw gameError(429, "Cette réaction se recharge encore.");
    pruneEffects(room);
    const activeSeverity = room.effects.reduce((sum, effect) => sum + (effect.severity || 0), 0);
    if (reaction.severity > 0 && activeSeverity + reaction.severity > 4) throw gameError(409, "Le budget de gêne est déjà atteint.");
    const targetActorSlot = activeActorSlot(room);
    if (reaction.id === "tomato" && room.effects.filter((effect) => effect.type === "tomato" && effect.targetActorSlot === targetActorSlot).length >= 3) {
      throw gameError(409, "Ce prompteur est déjà assez sale.");
    }

    player.energy -= reaction.cost;
    player.cooldowns[reaction.id] = Date.now() + reaction.cooldownMs;
    const scene = sceneFor(room);
    const effect = {
      id: id("fx"),
      type: reaction.id,
      label: reaction.label,
      severity: reaction.severity,
      startsAt: Date.now(),
      endsAt: Date.now() + reaction.durationMs,
      by: player.name,
      recovered: false,
      targetActorSlot,
      x: crypto.randomInt(18, 83),
      y: crypto.randomInt(18, 78),
      rotation: crypto.randomInt(-55, 56),
      word: reaction.id === "forbidden" ? scene.forbiddenWords[crypto.randomInt(scene.forbiddenWords.length)] : null
    };
    room.effects.push(effect);
    if (reaction.kind === "positive") {
      room.metrics.applause += 1;
      room.phaseEndsAt = room.phaseEndsAt ? room.phaseEndsAt + 8000 : null;
      const splat = room.effects.find((item) => item.type === "tomato" && item.targetActorSlot === targetActorSlot);
      if (splat) room.effects = room.effects.filter((item) => item.id !== splat.id);
      addEvent(room, `${player.name} déclenche des applaudissements.`, "positive");
    } else {
      room.metrics.negativeReactions += 1;
      addEvent(room, `${player.name} joue « ${reaction.label} » sur ${activeActorName(room)}.`, "incident");
    }
  }

  function tick() {
    const now = Date.now();
    for (const room of rooms.values()) {
      let changed = false;
      for (const player of room.players.values()) {
        const before = player.energy;
        regenerateEnergy(player);
        if (player.energy !== before) changed = true;
      }
      const effectCount = room.effects.length;
      pruneEffects(room);
      if (room.phaseEndsAt && room.phaseEndsAt <= now && room.phase !== "verdict") advancePhase(room);
      if (effectCount !== room.effects.length || changed) broadcast(room);
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
    const continuity = Math.round(35 * Math.min(1, room.metrics.linesCompleted / scene.lines.length));
    const recovery = Math.min(25, room.metrics.recoveries * 8);
    const audience = Math.min(20, room.metrics.applause * 4 + Math.min(10, room.metrics.negativeReactions));
    const ending = room.metrics.finaleReached ? 10 : 0;
    const castBalance = room.actorSlots === 2
      ? Math.min(10, Math.min(room.metrics.actorTurns.a || 0, room.metrics.actorTurns.b || 0) * 2)
      : Math.min(10, Math.floor(room.metrics.linesCompleted / 3));
    const total = Math.min(100, continuity + recovery + audience + ending + castBalance);
    room.verdict = {
      total,
      continuity,
      recovery,
      audience,
      ending,
      castBalance,
      castLabel: room.actorSlots === 2 ? "Duo" : "Interprétation",
      title: total >= 85 ? "Triomphe chaotique" : total >= 65 ? "Succès malgré tout" : total >= 45 ? "Catastrophe divertissante" : "Première désastreuse",
      quote: verdictQuote(total, room)
    };
    room.phase = "verdict";
    room.phaseEndsAt = null;
    room.effects = [];
    addEvent(room, `Rideau ! Verdict : ${room.verdict.title}.`, "phase");
    broadcast(room);
  }

  function personalizedState(room, player) {
    regenerateEnergy(player);
    pruneEffects(room);
    const scene = sceneFor(room);
    const currentLine = scene.lines[room.lineIndex];
    const currentCast = castMember(scene, currentLine.actor);
    const mySlot = effectiveActorSlot(room, player);
    const isActor = player.role === "actor";
    const myTurn = isActor && (room.actorSlots === 1 || mySlot === activeActorSlot(room));
    const visibleEffects = isActor ? room.effects.filter((effect) => effect.targetActorSlot === mySlot || room.actorSlots === 1) : room.effects;
    const base = {
      roomCode: room.code,
      phase: room.phase,
      phaseEndsAt: room.phaseEndsAt,
      serverNow: Date.now(),
      scene: {
        id: scene.id,
        title: scene.title,
        theme: scene.theme,
        durationSeconds: scene.durationSeconds,
        lineCount: scene.lines.length,
        cast: scene.cast.map(({ id: castId, name }) => ({ id: castId, name }))
      },
      lineIndex: room.lineIndex,
      progress: scene.lines.length ? (room.lineIndex + 1) / scene.lines.length : 0,
      currentSpeaker: currentCast.name,
      activeActorId: room.actorIds[activeActorSlot(room)],
      currentAct: currentLine.act,
      effects: visibleEffects,
      events: room.events,
      players: [...room.players.values()].map((participant) => ({
        id: participant.id,
        name: participant.name,
        role: participant.role,
        actorSlot: participant.actorSlot,
        characterName: participant.role === "actor" ? (room.actorSlots === 1 ? "Double rôle" : characterForPlayer(room, participant).name) : null
      })),
      actorSlots: room.actorSlots,
      actorIds: room.actorIds,
      hostId: room.hostId,
      verdict: room.verdict,
      availableScenes: player.id === room.hostId && room.phase === "lobby"
        ? scenes.map((item) => ({ id: item.id, title: item.title, theme: item.theme, lineCount: item.lines.length, durationSeconds: item.durationSeconds, cast: item.cast.map((member) => member.name) }))
        : undefined,
      me: {
        id: player.id,
        name: player.name,
        role: player.role,
        actorSlot: player.actorSlot,
        characterName: isActor ? (room.actorSlots === 1 ? "Double rôle" : characterForPlayer(room, player).name) : null,
        isHost: player.id === room.hostId,
        isMyTurn: myTurn,
        energy: player.energy,
        cooldowns: player.cooldowns
      }
    };

    if (isActor) {
      const character = characterForPlayer(room, player);
      base.private = {
        brief: room.actorSlots === 1 ? scene.soloBrief : character.brief,
        secretGoal: room.actorSlots === 1 ? scene.soloSecretGoal : character.secretGoal,
        character,
        currentLine,
        currentCharacter: currentCast,
        previousLine: scene.lines[room.lineIndex - 1] || null,
        nextOwnLine: nextLineForActor(scene, room.lineIndex, room.actorSlots === 1 ? null : character.id),
        totalLines: scene.lines.length,
        isMyTurn: myTurn
      };
    } else {
      base.private = {
        brief: scene.audienceBrief,
        reactions,
        currentLine: {
          actor: currentLine.actor,
          speaker: currentCast.name,
          act: currentLine.act,
          cue: currentLine.cue
        }
      };
    }
    return base;
  }

  function publicRoomState(code) {
    const room = getRoom(code);
    const scene = sceneFor(room);
    return {
      code: room.code,
      phase: room.phase,
      title: scene.title,
      theme: scene.theme,
      players: room.players.size,
      actorSlots: room.actorSlots,
      actorsPresent: room.actorIds.filter(Boolean).length
    };
  }

  function getRoom(code) {
    const room = rooms.get(String(code || "").trim().toUpperCase());
    if (!room) throw gameError(404, "Salle introuvable.");
    return room;
  }

  function requireHost(room, player) {
    if (player.id !== room.hostId) throw gameError(403, "Commande réservée à l’hôte.");
  }

  function requireLobby(room) {
    if (room.phase !== "lobby") throw gameError(409, "Cette modification est réservée au salon.");
  }

  function requireCastReady(room) {
    if (room.actorSlots === 2 && !room.actorIds[1]) throw gameError(409, "Un second comédien doit rejoindre la salle avant de commencer.");
  }

  function requireCurrentActor(room, player) {
    if (player.role !== "actor") throw gameError(403, "Commande réservée aux comédiens.");
    if (!["performance", "finale"].includes(room.phase)) throw gameError(409, "La scène n’est pas en cours.");
    if (room.actorSlots === 1) return;
    const expectedId = room.actorIds[activeActorSlot(room)];
    if (player.id !== expectedId) throw gameError(409, "Ce n’est pas encore votre réplique.");
  }

  function activeActorSlot(room) {
    if (room.actorSlots === 1) return 0;
    const line = sceneFor(room).lines[room.lineIndex];
    return line.actor === "b" ? 1 : 0;
  }

  function effectiveActorSlot(room, player) {
    return room.actorSlots === 1 ? 0 : (player.actorSlot ?? 0);
  }

  function activeActorName(room) {
    const actorId = room.actorIds[activeActorSlot(room)];
    return room.players.get(actorId)?.name || castMember(sceneFor(room), sceneFor(room).lines[room.lineIndex].actor).name;
  }

  function characterForPlayer(room, player) {
    const scene = sceneFor(room);
    return scene.cast[room.actorSlots === 1 ? 0 : (player.actorSlot ?? 0)] || scene.cast[0];
  }

  function castMember(scene, actorId) {
    return scene.cast.find((member) => member.id === actorId) || scene.cast[0];
  }

  function nextLineForActor(scene, fromIndex, actorId) {
    for (let index = fromIndex + 1; index < scene.lines.length; index += 1) {
      if (!actorId || scene.lines[index].actor === actorId) return scene.lines[index];
    }
    return null;
  }

  function sceneFor(room) {
    return scenes.find((scene) => scene.id === room.sceneId) || scenes[0];
  }

  function resetMatch(room) {
    room.lineIndex = 0;
    room.effects = [];
    room.metrics = freshMetrics();
    room.verdict = null;
    for (const participant of room.players.values()) {
      participant.energy = 5;
      participant.lastEnergyAt = Date.now();
      participant.cooldowns = {};
    }
  }

  function freshMetrics() {
    return { linesCompleted: 0, recoveries: 0, applause: 0, negativeReactions: 0, finaleReached: false, actorTurns: { a: 0, b: 0 } };
  }

  function playerRecord(playerId, playerToken, name, role, actorSlot) {
    return {
      id: playerId,
      token: playerToken,
      name: cleanName(name),
      role,
      actorSlot,
      ready: true,
      energy: 5,
      lastEnergyAt: Date.now(),
      cooldowns: {}
    };
  }

  function cleanName(value) {
    const result = String(value || "Joueur").trim().replace(/[<>]/g, "").slice(0, 24);
    return result || "Joueur";
  }

  function regenerateEnergy(player) {
    if (player.role !== "audience") return;
    const now = Date.now();
    const gained = Math.floor((now - player.lastEnergyAt) / 20_000);
    if (gained > 0) {
      player.energy = Math.min(6, player.energy + gained);
      player.lastEnergyAt += gained * 20_000;
    }
  }

  function pruneEffects(room) {
    const now = Date.now();
    room.effects = room.effects.filter((effect) => effect.endsAt > now);
  }

  function broadcast(room) {
    room.updatedAt = Date.now();
    onBroadcast?.(room);
  }

  function phaseMessage(phase) {
    return ({
      briefing: "Distribution des rôles.",
      preparation: "Les comédiens découvrent leurs objectifs et l’histoire.",
      performance: "Le rideau se lève.",
      finale: "Dernier acte : il faut conclure.",
      verdict: "Le public rend son verdict."
    })[phase] || "Nouvelle phase.";
  }

  function verdictQuote(total, room) {
    const scene = sceneFor(room);
    if (total >= 85) return `« ${scene.title} » a survécu au chaos avec une énergie remarquable.`;
    if (total >= 65) return "Des accidents, des hésitations, mais surtout une troupe qui n’a jamais lâché la scène.";
    if (total >= 45) return "Le public n’a pas tout compris, mais il se souviendra longtemps de cette représentation.";
    return "Le rideau est tombé. Une partie du décor aussi. Il faudra absolument rejouer.";
  }

  function gameError(status, message) {
    return Object.assign(new Error(message), { status });
  }

  const timer = setInterval(tick, 1000);
  timer.unref?.();

  return { createRoom, joinRoom, authenticate, command, personalizedState, publicRoomState, tick, rooms };
}
