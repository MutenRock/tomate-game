import crypto from "node:crypto";

export const PHASES = ["lobby", "briefing", "preparation", "performance", "finale", "verdict"];
const PHASE_DURATIONS = { briefing: 25, preparation: 45, finale: 45 };
const MAX_PLAYERS = 12;

export function createEngine({ scenes, reactions, onBroadcast }) {
  const rooms = new Map();
  const reactionMap = new Map(reactions.map((reaction) => [reaction.id, reaction]));

  function randomString(length, alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789") {
    let value = "";
    for (let index = 0; index < length; index += 1) value += alphabet[crypto.randomInt(alphabet.length)];
    return value;
  }
  function uniqueRoomCode() {
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const value = randomString(5);
      if (!rooms.has(value)) return value;
    }
    throw new Error("Impossible de générer un code de salle.");
  }
  function token() { return crypto.randomBytes(24).toString("base64url"); }
  function id(prefix) { return `${prefix}_${crypto.randomBytes(8).toString("hex")}`; }
  function nowIso() { return new Date().toISOString(); }

  function addEvent(room, text, kind = "info") {
    room.events.unshift({ id: id("evt"), at: Date.now(), text, kind });
    room.events = room.events.slice(0, 60);
  }

  function createRoom(hostName = "Comédien", actorSlots = 1) {
    const code = uniqueRoomCode();
    const hostId = id("player");
    const scene = scenes[0];
    const slots = Number(actorSlots) === 2 ? 2 : 1;
    const player = playerRecord(hostId, hostName, "actor", 0);
    const room = {
      code,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      phase: "lobby",
      phaseEndsAt: null,
      paused: null,
      sceneId: scene.id,
      lineIndex: 0,
      hostId,
      actorSlots: slots,
      actorIds: [hostId, null],
      players: new Map([[hostId, player]]),
      events: [],
      effects: [],
      feedback: new Map(),
      metrics: freshMetrics(),
      verdict: null
    };
    addEvent(room, `${player.name} ouvre la salle en mode ${slots === 2 ? "duo" : "solo"}.`);
    rooms.set(code, room);
    return { room, player };
  }

  function joinRoom(roomCode, name, requestedRole = "audience") {
    const room = getRoom(roomCode);
    if (room.phase !== "lobby") throw gameError(409, "La représentation a déjà commencé. Utilisez votre code de reprise si vous aviez déjà une place.");
    if (room.players.size >= MAX_PLAYERS) throw gameError(409, "La salle est complète.");

    const playerId = id("player");
    let role = "audience";
    let actorSlot = null;
    if (requestedRole === "actor") {
      if (room.actorSlots !== 2) throw gameError(409, "Cette salle est configurée pour un seul comédien.");
      if (room.actorIds[1]) throw gameError(409, "La place de second comédien est déjà prise.");
      role = "actor";
      actorSlot = 1;
      room.actorIds[1] = playerId;
    }
    const player = playerRecord(playerId, name, role, actorSlot);
    room.players.set(playerId, player);
    addEvent(room, role === "actor" ? `${player.name} rejoint la troupe comme second comédien.` : `${player.name} rejoint le public.`);
    broadcast(room);
    return { room, player };
  }

  function reclaimRoom(roomCode, name, reclaimCode) {
    const room = getRoom(roomCode);
    const normalizedName = cleanName(name).toLocaleLowerCase("fr");
    const normalizedCode = String(reclaimCode || "").trim().toUpperCase();
    const player = [...room.players.values()].find((candidate) => candidate.reclaimCode === normalizedCode && candidate.name.toLocaleLowerCase("fr") === normalizedName);
    if (!player) throw gameError(404, "Aucune place ne correspond à ce pseudo et à ce code de reprise.");
    player.token = token();
    player.lastSeenAt = Date.now();
    addEvent(room, `${player.name} reprend sa place.`, "positive");
    broadcast(room);
    return { room, player };
  }

  function authenticate(roomCode, playerId, playerToken) {
    const room = getRoom(roomCode);
    const player = room.players.get(playerId);
    if (!player || player.token !== playerToken) throw gameError(401, "Session invalide.");
    return { room, player };
  }

  function setConnection(roomCode, playerId, connected) {
    const room = getRoom(roomCode);
    const player = room.players.get(playerId);
    if (!player) return;
    const changed = player.connected !== connected;
    player.connected = connected;
    player.lastSeenAt = Date.now();
    if (!changed) return;

    if (!connected) {
      room.metrics.disconnects += 1;
      addEvent(room, `${player.name} est déconnecté.`, "warning");
      if (player.role === "actor" && ["briefing", "preparation", "performance", "finale"].includes(room.phase)) pauseForActor(room, player);
    } else {
      addEvent(room, `${player.name} est reconnecté.`, "positive");
      if (room.paused?.playerId === player.id) resumeRoom(room);
    }
    broadcast(room);
  }

  function pauseForActor(room, player) {
    if (room.paused) return;
    room.paused = {
      playerId: player.id,
      actorSlot: effectiveActorSlot(room, player),
      reason: `${player.name} est déconnecté`,
      remainingMs: room.phaseEndsAt ? Math.max(0, room.phaseEndsAt - Date.now()) : null,
      startedAt: Date.now()
    };
    room.phaseEndsAt = null;
    addEvent(room, `La scène est mise en pause en attendant ${player.name}.`, "warning");
  }

  function resumeRoom(room) {
    if (!room.paused) return;
    if (room.paused.remainingMs != null) room.phaseEndsAt = Date.now() + room.paused.remainingMs;
    addEvent(room, "La représentation reprend.", "phase");
    room.paused = null;
  }

  function command(roomCode, playerId, playerToken, type, payload = {}) {
    const { room, player } = authenticate(roomCode, playerId, playerToken);
    room.updatedAt = Date.now();
    regenerateEnergy(player);

    if (room.paused && !["REPLACE_ACTOR", "END_MATCH", "SUBMIT_FEEDBACK"].includes(type)) {
      throw gameError(409, "La partie est en pause pendant la reconnexion d’un comédien.");
    }

    switch (type) {
      case "SET_SCENE":
        requireHost(room, player); requireLobby(room);
        if (!scenes.some((scene) => scene.id === payload.sceneId)) throw gameError(400, "Histoire inconnue.");
        room.sceneId = payload.sceneId;
        room.readyReset = true;
        resetReadiness(room);
        addEvent(room, `Nouvelle histoire : ${sceneFor(room).title}.`);
        break;
      case "SET_ACTOR_SLOTS":
        requireHost(room, player); requireLobby(room); setActorSlots(room, Number(payload.actorSlots)); break;
      case "SET_PLAYER_ROLE":
        requireHost(room, player); requireLobby(room); setPlayerRole(room, payload.playerId, payload.role); break;
      case "TOGGLE_READY":
        requireLobby(room);
        player.ready = typeof payload.ready === "boolean" ? payload.ready : !player.ready;
        addEvent(room, `${player.name} est ${player.ready ? "prêt" : "à nouveau en préparation"}.`, player.ready ? "positive" : "info");
        break;
      case "START_MATCH":
        requireHost(room, player); requireCastReady(room);
        resetMatch(room); setPhase(room, "briefing");
        room.metrics.startedAt = Date.now();
        addEvent(room, "Le briefing commence.", "phase");
        break;
      case "ADVANCE_PHASE": requireHost(room, player); advancePhase(room); break;
      case "NEXT_LINE": requireCurrentActor(room, player); nextLine(room); break;
      case "FORCE_NEXT_LINE":
        requireHost(room, player); requireRunning(room); room.metrics.forcedPasses += 1; nextLine(room, true); break;
      case "RECOVERED": recoverIncident(room, player); break;
      case "REACTION": playReaction(room, player, payload.reactionId); break;
      case "REPLACE_ACTOR": replaceActor(room, player, payload); break;
      case "SUBMIT_FEEDBACK": submitFeedback(room, player, payload); break;
      case "RESTART":
        requireHost(room, player);
        room.phase = "lobby"; room.phaseEndsAt = null; room.paused = null; resetMatch(room); resetReadiness(room);
        addEvent(room, "La troupe prépare une nouvelle représentation.", "phase");
        break;
      case "END_MATCH": requireHost(room, player); finish(room); break;
      default: throw gameError(400, "Commande inconnue.");
    }
    broadcast(room);
    return personalizedState(room, player);
  }

  function setActorSlots(room, value) {
    const slots = value === 2 ? 2 : 1;
    if (slots === room.actorSlots) return;
    if (slots === 1 && room.actorIds[1]) {
      const second = room.players.get(room.actorIds[1]);
      if (second) { second.role = "audience"; second.actorSlot = null; second.ready = false; }
      room.actorIds[1] = null;
    }
    room.actorSlots = slots;
    resetReadiness(room);
    addEvent(room, slots === 2 ? "La pièce sera jouée par deux comédiens." : "Un seul comédien jouera les deux rôles.", "phase");
  }

  function setPlayerRole(room, targetId, role) {
    const target = room.players.get(targetId);
    if (!target || target.id === room.hostId) throw gameError(400, "Ce joueur ne peut pas changer de rôle.");
    if (role === "actor") {
      if (room.actorSlots !== 2) throw gameError(409, "Activez le mode duo.");
      if (room.actorIds[1] && room.actorIds[1] !== target.id) throw gameError(409, "La place de second comédien est occupée.");
      target.role = "actor"; target.actorSlot = 1; target.ready = false; room.actorIds[1] = target.id;
      addEvent(room, `${target.name} devient second comédien.`);
    } else {
      if (target.actorSlot === 1) room.actorIds[1] = null;
      target.role = "audience"; target.actorSlot = null; target.ready = false; target.energy = 5;
      addEvent(room, `${target.name} rejoint le public.`);
    }
    resetReadiness(room);
  }

  function replaceActor(room, host, payload) {
    requireHost(room, host);
    const slot = Number(payload.actorSlot);
    const target = room.players.get(payload.playerId);
    if (![0, 1].includes(slot) || !target || target.role !== "audience") throw gameError(400, "Remplacement invalide.");
    if (slot === 1 && room.actorSlots !== 2) throw gameError(409, "Le second rôle n’est pas actif.");
    const previousId = room.actorIds[slot];
    const previous = room.players.get(previousId);
    if (previous && previous.connected && room.phase !== "lobby") throw gameError(409, "Le comédien actuel est encore connecté.");
    if (previous) { previous.role = "audience"; previous.actorSlot = null; previous.ready = false; }
    target.role = "actor"; target.actorSlot = slot; target.ready = true; room.actorIds[slot] = target.id;
    addEvent(room, `${target.name} remplace ${previous?.name || "le comédien absent"}.`, "phase");
    if (room.paused?.actorSlot === slot) resumeRoom(room);
  }

  function nextLine(room, forced = false) {
    requireRunning(room);
    const scene = sceneFor(room);
    const current = scene.lines[room.lineIndex];
    room.metrics.linesCompleted = Math.max(room.metrics.linesCompleted, room.lineIndex + 1);
    room.metrics.actorTurns[current.actor] = (room.metrics.actorTurns[current.actor] || 0) + 1;
    if (room.lineIndex >= scene.lines.length - 1) return finish(room);
    room.lineIndex += 1;
    if (room.phase === "performance" && room.lineIndex / scene.lines.length >= 0.82) setPhase(room, "finale");
    for (const participant of room.players.values()) if (participant.role === "audience") participant.energy = Math.min(6, participant.energy + 1);
    addEvent(room, `${forced ? "Passage forcé" : "Réplique terminée"} — ${castMember(scene, scene.lines[room.lineIndex].actor).name} prend la parole.`);
  }

  function recoverIncident(room, player) {
    requireCurrentActor(room, player); requireRunning(room);
    const slot = effectiveActorSlot(room, player);
    const incident = room.effects.find((effect) => !effect.recovered && effect.type !== "applause" && (room.actorSlots === 1 || effect.targetActorSlot === slot));
    if (!incident) throw gameError(409, "Aucun incident actif ne cible votre rôle.");
    incident.recovered = true;
    room.metrics.recoveries += 1;
    addEvent(room, `${player.name} transforme l’incident en improvisation.`, "positive");
  }

  function playReaction(room, player, reactionId) {
    if (player.role !== "audience") throw gameError(403, "Seul le public peut jouer une réaction.");
    requireRunning(room);
    const reaction = reactionMap.get(reactionId);
    if (!reaction) throw gameError(400, "Réaction inconnue.");
    regenerateEnergy(player);
    if (player.energy < reaction.cost) throw gameError(409, "Pas assez de tomates.");
    if ((player.cooldowns[reaction.id] || 0) > Date.now()) throw gameError(429, "Cette réaction se recharge.");
    pruneEffects(room);
    const severity = room.effects.reduce((sum, effect) => sum + (effect.severity || 0), 0);
    if (reaction.severity > 0 && severity + reaction.severity > 4) throw gameError(409, "Le budget de gêne est déjà atteint.");
    const targetActorSlot = activeActorSlot(room);
    if (reaction.id === "tomato" && room.effects.filter((effect) => effect.type === "tomato" && effect.targetActorSlot === targetActorSlot).length >= 3) throw gameError(409, "Ce prompteur est déjà assez sale.");

    player.energy -= reaction.cost;
    player.cooldowns[reaction.id] = Date.now() + reaction.cooldownMs;
    const scene = sceneFor(room);
    const effect = {
      id: id("fx"), type: reaction.id, label: reaction.label, severity: reaction.severity,
      startsAt: Date.now(), endsAt: Date.now() + reaction.durationMs, by: player.name,
      targetActorSlot, targetActorName: activeActorName(room), recovered: false,
      x: crypto.randomInt(18, 83), y: crypto.randomInt(18, 78), rotation: crypto.randomInt(-55, 56),
      word: reaction.id === "forbidden" ? scene.forbiddenWords[crypto.randomInt(scene.forbiddenWords.length)] : null
    };
    room.effects.push(effect);
    room.metrics.reactionsPlayed[reaction.id] = (room.metrics.reactionsPlayed[reaction.id] || 0) + 1;
    if (reaction.kind === "positive") {
      room.metrics.applause += 1;
      if (room.phaseEndsAt) room.phaseEndsAt += 8000;
      const splat = room.effects.find((item) => item.type === "tomato" && item.targetActorSlot === targetActorSlot);
      if (splat) room.effects = room.effects.filter((item) => item.id !== splat.id);
      addEvent(room, `${player.name} applaudit ${effect.targetActorName}.`, "positive");
    } else {
      room.metrics.negativeReactions += 1;
      addEvent(room, `${player.name} joue « ${reaction.label} » sur ${effect.targetActorName}.`, "incident");
    }
  }

  function submitFeedback(room, player, payload) {
    if (room.phase !== "verdict") throw gameError(409, "Le questionnaire apparaît après le verdict.");
    const rating = (value) => Math.max(1, Math.min(5, Number(value) || 0));
    const replay = ["yes", "maybe", "no"].includes(payload.replay) ? payload.replay : "maybe";
    room.feedback.set(player.id, {
      role: player.role,
      actorSlot: player.actorSlot,
      roleClarity: rating(payload.roleClarity),
      actionClarity: rating(payload.actionClarity),
      durationFit: rating(payload.durationFit),
      disruptionsFun: rating(payload.disruptionsFun),
      replay,
      memorableMoment: String(payload.memorableMoment || "").trim().slice(0, 500),
      submittedAt: Date.now()
    });
    addEvent(room, `${player.name} a envoyé son retour de playtest.`, "positive");
  }

  function report(roomCode, playerId, playerToken) {
    const { room, player } = authenticate(roomCode, playerId, playerToken);
    requireHost(room, player);
    const feedback = [...room.feedback.values()];
    const averages = {};
    for (const key of ["roleClarity", "actionClarity", "durationFit", "disruptionsFun"]) {
      averages[key] = feedback.length ? Number((feedback.reduce((sum, item) => sum + item[key], 0) / feedback.length).toFixed(2)) : null;
    }
    return {
      version: "0.3.1",
      exportedAt: nowIso(),
      scene: { id: sceneFor(room).id, title: sceneFor(room).title, tutorial: Boolean(sceneFor(room).tutorial) },
      mode: room.actorSlots === 2 ? "duo" : "solo",
      players: {
        total: room.players.size,
        actors: room.actorSlots,
        audience: [...room.players.values()].filter((item) => item.role === "audience").length
      },
      timing: {
        startedAt: room.metrics.startedAt ? new Date(room.metrics.startedAt).toISOString() : null,
        finishedAt: room.metrics.finishedAt ? new Date(room.metrics.finishedAt).toISOString() : null,
        durationSeconds: room.metrics.startedAt && room.metrics.finishedAt ? Math.round((room.metrics.finishedAt - room.metrics.startedAt) / 1000) : null
      },
      metrics: {
        linesCompleted: room.metrics.linesCompleted,
        totalLines: sceneFor(room).lines.length,
        recoveries: room.metrics.recoveries,
        applause: room.metrics.applause,
        negativeReactions: room.metrics.negativeReactions,
        forcedPasses: room.metrics.forcedPasses,
        disconnects: room.metrics.disconnects,
        reactionsPlayed: room.metrics.reactionsPlayed,
        finalScore: room.verdict?.total ?? null
      },
      feedback: {
        submitted: feedback.length,
        expected: room.players.size,
        averages,
        replay: {
          yes: feedback.filter((item) => item.replay === "yes").length,
          maybe: feedback.filter((item) => item.replay === "maybe").length,
          no: feedback.filter((item) => item.replay === "no").length
        },
        responses: feedback.map((item, index) => ({
          participant: `${item.role}-${index + 1}`,
          role: item.role,
          ratings: { roleClarity: item.roleClarity, actionClarity: item.actionClarity, durationFit: item.durationFit, disruptionsFun: item.disruptionsFun },
          replay: item.replay,
          memorableMoment: item.memorableMoment
        }))
      }
    };
  }

  function tick() {
    const now = Date.now();
    for (const room of rooms.values()) {
      let changed = false;
      for (const player of room.players.values()) {
        const before = player.energy;
        regenerateEnergy(player);
        if (before !== player.energy) changed = true;
      }
      const beforeEffects = room.effects.length;
      pruneEffects(room);
      if (!room.paused && room.phaseEndsAt && room.phaseEndsAt <= now && room.phase !== "verdict") advancePhase(room);
      if (beforeEffects !== room.effects.length || changed) broadcast(room);
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
    room.metrics.linesCompleted = Math.max(room.metrics.linesCompleted, Math.min(scene.lines.length, room.lineIndex + 1));
    room.metrics.finishedAt = Date.now();
    const continuity = Math.round(35 * Math.min(1, room.metrics.linesCompleted / scene.lines.length));
    const recovery = Math.min(25, room.metrics.recoveries * 8);
    const audience = Math.min(20, room.metrics.applause * 4 + Math.min(10, room.metrics.negativeReactions));
    const ending = room.metrics.finaleReached ? 10 : 0;
    const castBalance = room.actorSlots === 2 ? Math.min(10, Math.min(room.metrics.actorTurns.a || 0, room.metrics.actorTurns.b || 0) * 2) : Math.min(10, Math.floor(room.metrics.linesCompleted / 3));
    const total = Math.min(100, continuity + recovery + audience + ending + castBalance);
    room.verdict = {
      total, continuity, recovery, audience, ending, castBalance,
      castLabel: room.actorSlots === 2 ? "Duo" : "Interprétation",
      title: total >= 85 ? "Triomphe chaotique" : total >= 65 ? "Succès malgré tout" : total >= 45 ? "Catastrophe divertissante" : "Première désastreuse",
      quote: total >= 85 ? "La troupe a transformé chaque accident en spectacle." : total >= 65 ? "Le plan a déraillé, mais l’histoire est restée debout." : total >= 45 ? "La salle n’a pas tout compris, mais elle s’en souviendra." : "Le rideau est tombé. Une partie du décor aussi."
    };
    room.phase = "verdict";
    room.phaseEndsAt = null;
    room.paused = null;
    room.effects = [];
    addEvent(room, `Rideau ! Verdict : ${room.verdict.title}.`, "phase");
  }

  function personalizedState(room, player) {
    regenerateEnergy(player); pruneEffects(room);
    const scene = sceneFor(room);
    const currentLine = scene.lines[room.lineIndex];
    const currentCast = castMember(scene, currentLine.actor);
    const mySlot = effectiveActorSlot(room, player);
    const isActor = player.role === "actor";
    const myTurn = isActor && (room.actorSlots === 1 || mySlot === activeActorSlot(room));
    const visibleEffects = isActor ? room.effects.filter((effect) => room.actorSlots === 1 || effect.targetActorSlot === mySlot) : room.effects;
    const startBlockers = calculateStartBlockers(room);
    const base = {
      roomCode: room.code,
      phase: room.phase,
      phaseEndsAt: room.phaseEndsAt,
      paused: room.paused ? { reason: room.paused.reason, actorSlot: room.paused.actorSlot } : null,
      serverNow: Date.now(),
      scene: {
        id: scene.id, title: scene.title, theme: scene.theme, tutorial: Boolean(scene.tutorial),
        durationSeconds: scene.durationSeconds, lineCount: scene.lines.length,
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
        id: participant.id, name: participant.name, role: participant.role, actorSlot: participant.actorSlot,
        ready: participant.ready, connected: participant.connected,
        characterName: participant.role === "actor" ? (room.actorSlots === 1 ? "Double rôle" : characterForPlayer(room, participant).name) : null
      })),
      actorSlots: room.actorSlots,
      actorIds: room.actorIds,
      hostId: room.hostId,
      verdict: room.verdict,
      canStart: startBlockers.length === 0,
      startBlockers,
      feedbackSummary: { submitted: room.feedback.size, expected: room.players.size },
      availableScenes: player.id === room.hostId && room.phase === "lobby" ? scenes.map((item) => ({ id: item.id, title: item.title, theme: item.theme, tutorial: Boolean(item.tutorial), lineCount: item.lines.length, durationSeconds: item.durationSeconds, cast: item.cast.map((member) => member.name) })) : undefined,
      me: {
        id: player.id, name: player.name, role: player.role, actorSlot: player.actorSlot,
        characterName: isActor ? (room.actorSlots === 1 ? "Double rôle" : characterForPlayer(room, player).name) : null,
        isHost: player.id === room.hostId, isMyTurn: myTurn, ready: player.ready, connected: player.connected,
        reclaimCode: player.reclaimCode, feedbackSubmitted: room.feedback.has(player.id), energy: player.energy, cooldowns: player.cooldowns
      }
    };
    if (isActor) {
      const character = characterForPlayer(room, player);
      base.private = {
        brief: room.actorSlots === 1 ? scene.soloBrief : character.brief,
        secretGoal: room.actorSlots === 1 ? scene.soloSecretGoal : character.secretGoal,
        character, currentLine, currentCharacter: currentCast,
        previousLine: scene.lines[room.lineIndex - 1] || null,
        nextOwnLine: nextLineForActor(scene, room.lineIndex, room.actorSlots === 1 ? null : character.id),
        totalLines: scene.lines.length, isMyTurn: myTurn
      };
    } else {
      base.private = {
        brief: scene.audienceBrief, reactions,
        currentLine: { actor: currentLine.actor, speaker: currentCast.name, act: currentLine.act, cue: currentLine.cue, tutorialAudienceTip: currentLine.tutorialAudienceTip, recommendedReaction: currentLine.recommendedReaction }
      };
    }
    return base;
  }

  function publicRoomState(roomCode) {
    const room = getRoom(roomCode);
    return { code: room.code, phase: room.phase, title: sceneFor(room).title, theme: sceneFor(room).theme, players: room.players.size, actorSlots: room.actorSlots, actorsPresent: room.actorIds.filter(Boolean).length };
  }

  function calculateStartBlockers(room) {
    const blockers = [];
    const actors = room.actorIds.slice(0, room.actorSlots).map((actorId) => room.players.get(actorId));
    if (actors.some((actor) => !actor)) blockers.push("Il manque un comédien.");
    if (actors.some((actor) => actor && !actor.connected)) blockers.push("Un comédien n’est pas connecté.");
    if (actors.some((actor) => actor && !actor.ready)) blockers.push("Tous les comédiens doivent être prêts.");
    const audience = [...room.players.values()].filter((item) => item.role === "audience");
    if (audience.length === 0) blockers.push("Au moins une personne doit rejoindre le public.");
    if (audience.some((item) => item.connected && !item.ready)) blockers.push("Tous les joueurs connectés doivent être prêts.");
    return [...new Set(blockers)];
  }

  function requireCastReady(room) {
    const blockers = calculateStartBlockers(room);
    if (blockers.length) throw gameError(409, blockers.join(" "));
  }
  function requireHost(room, player) { if (player.id !== room.hostId) throw gameError(403, "Commande réservée à l’hôte."); }
  function requireLobby(room) { if (room.phase !== "lobby") throw gameError(409, "Cette modification est réservée au salon."); }
  function requireRunning(room) { if (!["performance", "finale"].includes(room.phase)) throw gameError(409, "La scène n’est pas en cours."); }
  function requireCurrentActor(room, player) {
    if (player.role !== "actor") throw gameError(403, "Commande réservée aux comédiens.");
    requireRunning(room);
    if (room.actorSlots === 2 && player.id !== room.actorIds[activeActorSlot(room)]) throw gameError(409, "Ce n’est pas encore votre réplique.");
  }

  function getRoom(roomCode) {
    const room = rooms.get(String(roomCode || "").trim().toUpperCase());
    if (!room) throw gameError(404, "Salle introuvable.");
    return room;
  }
  function sceneFor(room) { return scenes.find((scene) => scene.id === room.sceneId) || scenes[0]; }
  function castMember(scene, actorId) { return scene.cast.find((member) => member.id === actorId) || scene.cast[0]; }
  function activeActorSlot(room) { return room.actorSlots === 1 ? 0 : sceneFor(room).lines[room.lineIndex].actor === "b" ? 1 : 0; }
  function activeActorName(room) { return room.players.get(room.actorIds[activeActorSlot(room)])?.name || castMember(sceneFor(room), sceneFor(room).lines[room.lineIndex].actor).name; }
  function effectiveActorSlot(room, player) { return room.actorSlots === 1 ? 0 : (player.actorSlot ?? 0); }
  function characterForPlayer(room, player) { return sceneFor(room).cast[room.actorSlots === 1 ? 0 : (player.actorSlot ?? 0)] || sceneFor(room).cast[0]; }
  function nextLineForActor(scene, fromIndex, actorId) { for (let index = fromIndex + 1; index < scene.lines.length; index += 1) if (!actorId || scene.lines[index].actor === actorId) return scene.lines[index]; return null; }

  function playerRecord(playerId, name, role, actorSlot) {
    return {
      id: playerId, token: token(), reclaimCode: randomString(6), name: cleanName(name), role, actorSlot,
      ready: false, connected: false, joinedAt: Date.now(), lastSeenAt: Date.now(), energy: 5, lastEnergyAt: Date.now(), cooldowns: {}
    };
  }
  function cleanName(value) { const result = String(value || "Joueur").trim().replace(/[<>]/g, "").slice(0, 24); return result || "Joueur"; }
  function resetReadiness(room) { for (const player of room.players.values()) player.ready = false; }
  function resetMatch(room) {
    room.lineIndex = 0; room.effects = []; room.feedback = new Map(); room.metrics = freshMetrics(); room.verdict = null;
    for (const player of room.players.values()) { player.energy = 5; player.lastEnergyAt = Date.now(); player.cooldowns = {}; }
  }
  function freshMetrics() { return { startedAt: null, finishedAt: null, linesCompleted: 0, recoveries: 0, applause: 0, negativeReactions: 0, finaleReached: false, actorTurns: { a: 0, b: 0 }, forcedPasses: 0, disconnects: 0, reactionsPlayed: {} }; }
  function regenerateEnergy(player) { if (player.role !== "audience") return; const gained = Math.floor((Date.now() - player.lastEnergyAt) / 20_000); if (gained > 0) { player.energy = Math.min(6, player.energy + gained); player.lastEnergyAt += gained * 20_000; } }
  function pruneEffects(room) { const now = Date.now(); room.effects = room.effects.filter((effect) => effect.endsAt > now); }
  function broadcast(room) { room.updatedAt = Date.now(); onBroadcast?.(room); }
  function phaseMessage(phase) { return ({ briefing: "Distribution des rôles.", preparation: "Préparation de la scène.", performance: "Le rideau se lève.", finale: "Dernier acte.", verdict: "Le public rend son verdict." })[phase] || "Nouvelle phase."; }
  function gameError(status, message) { return Object.assign(new Error(message), { status }); }

  const timer = setInterval(tick, 1000);
  timer.unref?.();
  return { createRoom, joinRoom, reclaimRoom, authenticate, setConnection, command, report, personalizedState, publicRoomState, tick, rooms };
}
