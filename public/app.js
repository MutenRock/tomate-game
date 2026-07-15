const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const sessionKey = "tomate.session.v3";
let session = loadSession();
let state = null;
let events = null;
let clockTimer = null;
let busy = false;
let serverOffset = 0;
const params = new URLSearchParams(location.search);

bootstrap();

async function bootstrap() {
  document.documentElement.dataset.motion = localStorage.getItem("tomate.reduceMotion") === "1" ? "reduced" : "full";
  document.documentElement.dataset.contrast = localStorage.getItem("tomate.contrast") === "1" ? "high" : "normal";
  if (session) {
    try {
      setState(await api(`/api/rooms/${session.roomCode}/state?playerId=${encodeURIComponent(session.playerId)}&token=${encodeURIComponent(session.token)}`));
      connect();
      render();
      return;
    } catch {
      sessionStorage.removeItem(sessionKey);
      session = null;
    }
  }
  renderLanding();
}

function renderLanding() {
  const joinCode = (params.get("join") || "").toUpperCase();
  app.innerHTML = `<main class="landing-shell">
    <section class="hero-panel">
      <div class="hero-copy">
        <p class="kicker">PROTOTYPE MULTIJOUEUR · V0.3</p>
        <h1>Tomate <em>!</em></h1>
        <p class="lead">Une histoire, un ou deux comédiens, un public imprévisible. Continuez à jouer quand tout part de travers.</p>
        <div class="feature-row"><span>1–2 comédiens</span><span>Public sur téléphone</span><span>Histoires de 6–8 min</span></div>
      </div>
      <div class="mini-stage" aria-hidden="true"><div class="curtain left"></div><div class="curtain right"></div><span>🍅</span></div>
    </section>

    <section class="entry-grid">
      <form id="createForm" class="card entry-card">
        <p class="kicker">CRÉER UNE TROUPE</p>
        <h2>Ouvrir une salle</h2>
        <label>Votre pseudo<input name="name" maxlength="24" required placeholder="Capitaine Nova"></label>
        <fieldset class="choice-field"><legend>Nombre de comédiens</legend>
          <label class="choice-card"><input type="radio" name="actorSlots" value="1" checked><span><strong>1 comédien</strong><small>Vous jouez les deux personnages.</small></span></label>
          <label class="choice-card"><input type="radio" name="actorSlots" value="2"><span><strong>2 comédiens</strong><small>Chaque joueur reçoit son propre rôle.</small></span></label>
        </fieldset>
        <button class="primary big" type="submit">Ouvrir le rideau</button>
      </form>

      <form id="joinForm" class="card entry-card">
        <p class="kicker">REJOINDRE LA PARTIE</p>
        <h2>Entrer dans la salle</h2>
        <label>Code de salle<input name="code" maxlength="5" required value="${escapeHtml(joinCode)}" placeholder="ABCDE" autocapitalize="characters"></label>
        <label>Votre pseudo<input name="name" maxlength="24" required placeholder="Tomatophile"></label>
        <fieldset class="choice-field compact"><legend>Votre place</legend>
          <label class="choice-card"><input type="radio" name="role" value="audience" checked><span><strong>Public</strong><small>Réagissez et perturbez la scène.</small></span></label>
          <label class="choice-card"><input type="radio" name="role" value="actor"><span><strong>Comédien 2</strong><small>Si la salle attend un duo.</small></span></label>
        </fieldset>
        <button class="big" type="submit">Rejoindre</button>
      </form>
    </section>

    <section class="settings card"><strong>Confort de lecture</strong><label><input id="motionToggle" type="checkbox" ${document.documentElement.dataset.motion === "reduced" ? "checked" : ""}> Réduire les animations</label><label><input id="contrastToggle" type="checkbox" ${document.documentElement.dataset.contrast === "high" ? "checked" : ""}> Contraste renforcé</label></section>
  </main>`;
  document.querySelector("#createForm").addEventListener("submit", createRoom);
  document.querySelector("#joinForm").addEventListener("submit", joinRoom);
  bindSettings();
}

async function createRoom(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  try {
    const result = await api("/api/rooms", { method: "POST", body: { name: data.get("name"), actorSlots: Number(data.get("actorSlots")) } });
    saveSession(result);
    setState(result.state);
    connect();
    render();
  } catch (error) { notify(error.message, true); }
}

async function joinRoom(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const code = String(data.get("code")).trim().toUpperCase();
  try {
    const result = await api(`/api/rooms/${code}/join`, { method: "POST", body: { name: data.get("name"), role: data.get("role") } });
    saveSession(result);
    setState(result.state);
    connect();
    render();
  } catch (error) { notify(error.message, true); }
}

function saveSession(result) {
  session = { roomCode: result.roomCode, playerId: result.playerId, token: result.token, role: result.role };
  sessionStorage.setItem(sessionKey, JSON.stringify(session));
}
function loadSession() { try { return JSON.parse(sessionStorage.getItem(sessionKey)); } catch { return null; } }

function connect() {
  events?.close();
  events = new EventSource(`/api/rooms/${session.roomCode}/events?playerId=${encodeURIComponent(session.playerId)}&token=${encodeURIComponent(session.token)}`);
  events.addEventListener("state", (event) => { setState(JSON.parse(event.data)); render(); });
  events.onerror = () => notify("Reconnexion au serveur…");
  clearInterval(clockTimer);
  clockTimer = setInterval(updateClock, 250);
}

function render() {
  if (!state) return renderLanding();
  const roleClass = state.me.role === "actor" ? "actor" : "audience";
  app.innerHTML = `<main class="game ${roleClass}">
    ${header()}
    <section class="phase-guide">${phaseGuide()}</section>
    <section class="game-grid">
      <article class="card main-panel">${mainPanel()}</article>
      <aside class="card side-panel">${sidePanel()}</aside>
    </section>
    <footer><button class="text-button" id="leave">Quitter la salle</button><span>Voix via Discord ou dans la même pièce — aucun audio enregistré.</span></footer>
  </main>`;
  bindGame();
  updateClock();
}

function header() {
  return `<header class="game-header">
    <div><p class="kicker">SALLE <button class="room-code" id="copyCode" title="Copier le code">${state.roomCode}</button></p><h1>Tomate <em>!</em></h1></div>
    <div class="header-status"><div class="phase"><span>${phaseLabel(state.phase)}</span><strong id="clock">${timeText()}</strong></div>${state.phase !== "lobby" && state.phase !== "verdict" ? `<div class="header-progress"><span style="width:${Math.round((state.progress || 0) * 100)}%"></span></div>` : ""}</div>
  </header>`;
}

function phaseGuide() {
  const guides = {
    lobby: ["1", "Composez la troupe", "Choisissez l’histoire et invitez le public."],
    briefing: ["2", "Découvrez votre rôle", "Lisez votre mission. Ne révélez pas votre objectif secret."],
    preparation: ["3", "Préparez la scène", "Repérez votre personnage, votre intention et le début de l’histoire."],
    performance: ["4", "Jouez l’histoire", state.me.role === "actor" ? "Lisez uniquement la zone TEXTE À DIRE lorsque c’est votre tour." : "Réagissez sans rendre la lecture impossible."],
    finale: ["5", "Concluez", "Les dernières répliques doivent donner une vraie fin à l’histoire."],
    verdict: ["6", "Rideau", "Découvrez ce que la troupe a réussi à sauver."]
  };
  const guide = guides[state.phase];
  return `<span class="step-number">${guide[0]}</span><div><strong>${guide[1]}</strong><small>${guide[2]}</small></div>`;
}

function mainPanel() {
  if (state.phase === "lobby") return lobbyPanel();
  if (state.phase === "verdict") return verdictPanel();
  if (["briefing", "preparation"].includes(state.phase)) return briefingPanel();
  return state.me.role === "actor" ? actorPerformance() : audiencePerformance();
}

function lobbyPanel() {
  const actors = state.players.filter((player) => player.role === "actor");
  const actorTwoMissing = state.actorSlots === 2 && actors.length < 2;
  const selected = state.availableScenes?.find((scene) => scene.id === state.scene.id);
  const hostControls = state.me.isHost ? `<div class="lobby-controls">
      <div class="control-block"><span class="field-title">FORMAT DE LA TROUPE</span><div class="segmented">
        <button class="${state.actorSlots === 1 ? "active" : ""}" data-slots="1">Solo — deux rôles</button>
        <button class="${state.actorSlots === 2 ? "active" : ""}" data-slots="2">Duo — un rôle chacun</button>
      </div></div>
      <label class="scene-select"><span class="field-title">HISTOIRE</span><select id="sceneSelect">${state.availableScenes.map((scene) => `<option value="${scene.id}" ${scene.id === state.scene.id ? "selected" : ""}>${escapeHtml(scene.title)} · ${scene.lineCount} répliques</option>`).join("")}</select></label>
      ${selected ? `<div class="scene-summary"><strong>${escapeHtml(selected.theme)}</strong><span>${selected.lineCount} répliques · environ ${Math.ceil(selected.durationSeconds / 60)} min · ${selected.cast.map(escapeHtml).join(" / ")}</span></div>` : ""}
      ${actorTwoMissing ? `<div class="warning-box"><strong>Il manque le second comédien.</strong><span>Un joueur doit rejoindre comme « Comédien 2 » ou être promu depuis le public.</span></div>` : ""}
      <button class="primary big" data-command="START_MATCH" ${actorTwoMissing ? "disabled" : ""}>Commencer la représentation</button>
    </div>` : `<div class="waiting"><strong>L’hôte prépare la troupe.</strong><span>Gardez cette page ouverte : la partie démarrera automatiquement.</span></div>`;

  return `<p class="kicker">AVANT LE LEVER DE RIDEAU</p><div class="title-row"><div><h2>${escapeHtml(state.scene.title)}</h2><p class="theme">${escapeHtml(state.scene.theme)}</p></div><span class="story-length">${state.scene.lineCount} répliques</span></div>
    <div class="invite-box"><div><span>Invitez les autres joueurs avec le code</span><strong>${state.roomCode}</strong></div><button id="copyJoin">Copier le lien d’invitation</button></div>
    ${castOverview()}${hostControls}`;
}

function briefingPanel() {
  const preparation = state.phase === "preparation";
  if (state.me.role === "audience") {
    return `<p class="kicker">${preparation ? "PRÉPARATION DU PUBLIC" : "BRIEFING DU PUBLIC"}</p><h2>${escapeHtml(state.scene.title)}</h2><p class="theme">${escapeHtml(state.scene.theme)}</p><div class="instruction-card public-instruction"><span>VOTRE MISSION</span><p>${escapeHtml(state.private.brief)}</p></div>${castOverview()}${state.me.isHost ? `<button data-command="ADVANCE_PHASE">Passer cette phase</button>` : ""}`;
  }

  const character = state.private.character;
  const firstLine = state.private.currentLine;
  return `<p class="kicker">${preparation ? "PRÉPARATION — LISEZ SANS JOUER" : "DISTRIBUTION DES RÔLES"}</p>
    <div class="role-identity"><span>VOUS JOUEZ</span><h2>${state.actorSlots === 1 ? "LES DEUX PERSONNAGES" : escapeHtml(character.name)}</h2><small>${state.actorSlots === 1 ? "Changez clairement de voix et de posture entre les personnages." : `Comédien ${state.me.actorSlot + 1}`}</small></div>
    <div class="briefing-grid"><div class="instruction-card"><span>MISSION PUBLIQUE</span><p>${escapeHtml(state.private.brief)}</p></div><div class="instruction-card secret"><span>OBJECTIF SECRET</span><p>${escapeHtml(state.private.secretGoal)}</p></div></div>
    ${preparation ? `<div class="first-line-preview"><span>LA SCÈNE COMMENCE PAR</span><strong>${escapeHtml(firstLine.act)}</strong><p><b>${escapeHtml(state.private.currentCharacter.name)}</b> — ${escapeHtml(firstLine.emotion)}</p><small>La didascalie indique quoi faire. Seule la zone « Texte à dire » doit être lue à voix haute.</small></div>` : castOverview()}
    ${state.me.isHost ? `<button data-command="ADVANCE_PHASE">Passer cette phase</button>` : ""}`;
}

function actorPerformance() {
  const line = state.private.currentLine || {};
  const character = state.private.currentCharacter || {};
  const myTurn = state.private.isMyTurn;
  const previous = state.private.previousLine;
  const next = state.private.nextOwnLine;
  const solo = state.actorSlots === 1;
  const turnLabel = myTurn ? "À TOI — LIS MAINTENANT" : `ATTENDS — ${character.name || "L’AUTRE COMÉDIEN"} PARLE`;

  return `<div class="stage-head"><div><p class="kicker">${state.phase === "finale" ? "FINALE — DONNEZ UNE VRAIE FIN" : escapeHtml(line.act || state.currentAct)}</p><h2>${escapeHtml(state.scene.title)}</h2></div><span class="line-count">${state.lineIndex + 1} / ${state.private.totalLines}</span></div>
    <div class="turn-banner ${myTurn ? "your-turn" : "wait-turn"}"><span>${myTurn ? "▶" : "⏸"}</span><div><strong>${escapeHtml(turnLabel)}</strong><small>${solo ? `Vous interprétez maintenant ${escapeHtml(character.name || "le personnage")}.` : myTurn ? "Les autres vous écoutent. Prenez une seconde avant de commencer." : "Écoutez la réplique et préparez votre prochaine intervention."}</small></div></div>
    ${previous ? `<details class="context-box"><summary>Contexte : réplique précédente</summary><p><b>${escapeHtml(previous.speaker)}</b> — ${escapeHtml(previous.text)}</p></details>` : ""}
    <div class="script-window ${hasEffect("blackout") ? "is-dark" : ""} ${myTurn ? "active-script" : "listening-script"}">
      <div class="splats">${state.effects.filter((effect) => effect.type === "tomato").map(splatHtml).join("")}</div>
      ${effectBanners()}
      <section class="script-zone direction-zone"><span>NE PAS LIRE — DIDASCALIE</span><p>${escapeHtml(line.stageDirection || "Restez attentif à la scène.")}</p></section>
      <section class="script-zone intention-zone"><span>INTENTION DE JEU</span><p>${escapeHtml(line.emotion || "Improviser")}</p></section>
      <section class="script-zone spoken-zone"><span>${myTurn ? "TEXTE À DIRE À VOIX HAUTE" : "RÉPLIQUE À ÉCOUTER"}</span><div class="speaker-chip">${escapeHtml(character.name || line.speaker || "")}</div><p>${escapeHtml(line.text || "")}</p></section>
      <div class="after-grid"><section><span>APRÈS LA RÉPLIQUE</span><p>${escapeHtml(line.after || "Passez la parole.")}</p></section><section><span>REPÈRE DE SCÈNE</span><p>${escapeHtml(line.cue || "Continuer")}</p></section></div>
    </div>
    ${!myTurn && next ? `<div class="next-turn-preview"><span>PRÉPARE TA PROCHAINE INTERVENTION</span><strong>${escapeHtml(next.act)}</strong><p>${escapeHtml(next.emotion)} — ${escapeHtml(next.text)}</p></div>` : ""}
    <div class="actions">${myTurn ? `<button class="primary big" data-command="NEXT_LINE">${state.lineIndex + 1 >= state.private.totalLines ? "Terminer la pièce" : "J’ai terminé cette réplique"}<small>Raccourci : barre Espace</small></button><button data-command="RECOVERED">J’ai intégré l’incident à mon jeu</button>` : `<div class="waiting-action"><span>Tour de ${escapeHtml(character.name || "l’autre personnage")}</span><small>Le bouton apparaîtra automatiquement lorsque ce sera à vous.</small></div>`}${state.me.isHost ? `<button class="danger-quiet" data-command="FORCE_NEXT_LINE">Forcer le passage</button><button class="danger-quiet" data-command="END_MATCH">Forcer le verdict</button>` : ""}</div>`;
}

function audiencePerformance() {
  const reactions = state.private.reactions || [];
  const current = state.private.currentLine || {};
  return `<div class="stage-head"><div><p class="kicker">${state.phase === "finale" ? "FINALE — DERNIÈRES RÉACTIONS" : "VOUS ÊTES LE PUBLIC"}</p><h2>${escapeHtml(state.scene.title)}</h2></div><span class="line-count">${state.lineIndex + 1} / ${state.scene.lineCount}</span></div>
    <div class="audience-now"><span>EN CE MOMENT</span><strong>${escapeHtml(current.speaker || state.currentSpeaker)}</strong><p>${escapeHtml(current.act || state.currentAct)}</p><small>Repère : ${escapeHtml(current.cue || "Suivez la scène")}</small></div>
    <div class="instruction-card public-instruction"><span>VOTRE MISSION</span><p>${escapeHtml(state.private.brief)}</p></div>
    <div class="energy"><div><span>VOS TOMATES</span><strong>${"●".repeat(state.me.energy)}${"○".repeat(Math.max(0, 6 - state.me.energy))}</strong></div><small>+1 toutes les 20 secondes ou après chaque réplique</small></div>
    <div class="reaction-grid">${reactions.map(reactionHtml).join("")}</div>
    <p class="audience-rule">Une perturbation doit créer une occasion d’improviser, pas empêcher le comédien de jouer.</p>`;
}

function verdictPanel() {
  const verdict = state.verdict;
  return `<p class="kicker">VERDICT DU PUBLIC</p><h2>${escapeHtml(verdict.title)}</h2><div class="score">${verdict.total}<small>/100</small></div><blockquote>${escapeHtml(verdict.quote)}</blockquote><div class="score-grid"><div><strong>${verdict.continuity}</strong><span>Histoire</span></div><div><strong>${verdict.recovery}</strong><span>Récupération</span></div><div><strong>${verdict.audience}</strong><span>Public</span></div><div><strong>${verdict.castBalance}</strong><span>${escapeHtml(verdict.castLabel)}</span></div><div><strong>${verdict.ending}</strong><span>Finale</span></div></div>${state.me.isHost ? `<button class="primary big" data-command="RESTART">Préparer une nouvelle histoire</button>` : "<p>La troupe prépare la prochaine représentation.</p>"}`;
}

function castOverview() {
  const actors = state.players.filter((player) => player.role === "actor");
  const audience = state.players.filter((player) => player.role === "audience");
  return `<section class="cast-overview"><div class="cast-slot"><span>COMÉDIEN 1</span><strong>${escapeHtml(actors.find((player) => player.actorSlot === 0)?.name || "En attente")}</strong><small>${escapeHtml(state.scene.cast[0]?.name || "Rôle A")}</small></div>${state.actorSlots === 2 ? `<div class="cast-slot ${actors.some((player) => player.actorSlot === 1) ? "" : "empty"}"><span>COMÉDIEN 2</span><strong>${escapeHtml(actors.find((player) => player.actorSlot === 1)?.name || "Place disponible")}</strong><small>${escapeHtml(state.scene.cast[1]?.name || "Rôle B")}</small></div>` : `<div class="cast-slot solo-slot"><span>DOUBLE RÔLE</span><strong>Le comédien 1 joue les deux personnages</strong><small>${state.scene.cast.map((member) => escapeHtml(member.name)).join(" + ")}</small></div>`}<div class="cast-slot audience-slot"><span>PUBLIC</span><strong>${audience.length} joueur${audience.length > 1 ? "s" : ""}</strong><small>Réactions et perturbations</small></div></section>`;
}

function sidePanel() {
  const playerRows = state.players.map((player) => {
    const canPromote = state.me.isHost && state.phase === "lobby" && state.actorSlots === 2 && player.role === "audience" && !state.actorIds[1];
    const canDemote = state.me.isHost && state.phase === "lobby" && player.role === "actor" && player.actorSlot === 1;
    return `<div class="player"><span class="player-icon">${player.role === "actor" ? "🎭" : "🍅"}</span><div><strong>${escapeHtml(player.name)}</strong><small>${player.role === "actor" ? escapeHtml(player.characterName || `Comédien ${player.actorSlot + 1}`) : "Public"}</small></div>${canPromote ? `<button class="mini-button" data-player-role="actor" data-player-id="${player.id}">Promouvoir</button>` : ""}${canDemote ? `<button class="mini-button" data-player-role="audience" data-player-id="${player.id}">Public</button>` : ""}</div>`;
  }).join("");
  return `<section class="players"><div class="side-title"><span>LA TROUPE</span><strong>${state.players.length}/12</strong></div>${playerRows}</section><section class="log"><div class="side-title"><span>JOURNAL DE SALLE</span></div><ol>${state.events.slice(0, 12).map((event) => `<li class="${event.kind}">${escapeHtml(event.text)}</li>`).join("")}</ol></section>`;
}

function effectBanners() {
  return state.effects.filter((effect) => ["dramatic", "phone", "forbidden"].includes(effect.type)).map((effect) => `<div class="effect-banner ${effect.type}">${effect.type === "forbidden" ? `MOT INTERDIT : ${escapeHtml(effect.word.toUpperCase())}` : escapeHtml(effect.label)}</div>`).join("");
}
function splatHtml(effect) { return `<span class="splat" style="left:${effect.x}%;top:${effect.y}%;--r:${effect.rotation}deg"></span>`; }
function reactionHtml(reaction) {
  const ready = (state.me.cooldowns[reaction.id] || 0) <= nowServer();
  const enough = state.me.energy >= reaction.cost;
  return `<button class="reaction ${reaction.kind === "positive" ? "positive" : ""}" data-reaction="${reaction.id}" data-cost="${reaction.cost}" ${ready && enough ? "" : "disabled"}><span class="cost">${reaction.cost}</span><strong>${escapeHtml(reaction.label)}</strong><small>${escapeHtml(reaction.description)}</small></button>`;
}

function bindGame() {
  document.querySelector("#copyCode")?.addEventListener("click", () => copy(state.roomCode));
  document.querySelector("#copyJoin")?.addEventListener("click", () => copy(`${location.origin}/?join=${state.roomCode}`));
  document.querySelector("#leave")?.addEventListener("click", leaveRoom);
  document.querySelector("#sceneSelect")?.addEventListener("change", (event) => command("SET_SCENE", { sceneId: event.target.value }));
  document.querySelectorAll("[data-slots]").forEach((button) => button.addEventListener("click", () => command("SET_ACTOR_SLOTS", { actorSlots: Number(button.dataset.slots) })));
  document.querySelectorAll("[data-command]").forEach((button) => button.addEventListener("click", () => command(button.dataset.command)));
  document.querySelectorAll("[data-reaction]").forEach((button) => button.addEventListener("click", () => command("REACTION", { reactionId: button.dataset.reaction })));
  document.querySelectorAll("[data-player-role]").forEach((button) => button.addEventListener("click", () => command("SET_PLAYER_ROLE", { playerId: button.dataset.playerId, role: button.dataset.playerRole })));
}

function leaveRoom() {
  events?.close();
  sessionStorage.removeItem(sessionKey);
  session = null;
  state = null;
  history.replaceState({}, "", location.pathname);
  renderLanding();
}

async function command(type, payload = {}) {
  if (busy) return;
  busy = true;
  try {
    setState(await api(`/api/rooms/${session.roomCode}/commands`, { method: "POST", body: { playerId: session.playerId, token: session.token, type, payload } }));
    render();
  } catch (error) { notify(error.message, true); }
  finally { busy = false; }
}

function updateClock() {
  const element = document.querySelector("#clock");
  if (element) element.textContent = timeText();
  updateReactionButtons();
}
function timeText() {
  if (!state?.phaseEndsAt) return state?.phase === "lobby" ? "EN ATTENTE" : state?.phase === "verdict" ? "RIDEAU" : "—";
  return formatSeconds(Math.max(0, Math.ceil((state.phaseEndsAt - nowServer()) / 1000)));
}
function formatSeconds(seconds) { return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`; }
function setState(nextState) { state = nextState; if (Number.isFinite(state?.serverNow)) serverOffset = state.serverNow - Date.now(); }
function nowServer() { return Date.now() + serverOffset; }
function updateReactionButtons() {
  if (!state || state.me.role !== "audience") return;
  document.querySelectorAll("[data-reaction]").forEach((button) => {
    button.disabled = (state.me.cooldowns[button.dataset.reaction] || 0) > nowServer() || state.me.energy < Number(button.dataset.cost || 0);
  });
}

function phaseLabel(phase) { return ({ lobby: "Salon", briefing: "Briefing", preparation: "Préparation", performance: "Représentation", finale: "Finale", verdict: "Verdict" })[phase] || phase; }
function hasEffect(type) { return state.effects.some((effect) => effect.type === type); }
function bindSettings() {
  document.querySelector("#motionToggle")?.addEventListener("change", (event) => { localStorage.setItem("tomate.reduceMotion", event.target.checked ? "1" : "0"); document.documentElement.dataset.motion = event.target.checked ? "reduced" : "full"; });
  document.querySelector("#contrastToggle")?.addEventListener("change", (event) => { localStorage.setItem("tomate.contrast", event.target.checked ? "1" : "0"); document.documentElement.dataset.contrast = event.target.checked ? "high" : "normal"; });
}

async function api(url, options = {}) {
  const response = await fetch(url, { ...options, headers: { "Content-Type": "application/json", ...(options.headers || {}) }, body: options.body ? JSON.stringify(options.body) : undefined });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Erreur ${response.status}`);
  return payload;
}
function notify(message, error = false) {
  toast.textContent = message;
  toast.className = `toast is-visible ${error ? "error" : ""}`;
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => { toast.className = "toast"; }, 2300);
}
async function copy(value) { try { await navigator.clipboard.writeText(value); notify("Copié !"); } catch { notify(value); } }
function escapeHtml(value) { return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]); }

document.addEventListener("keydown", (event) => {
  if (event.code !== "Space" || event.repeat || ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(document.activeElement?.tagName)) return;
  if (state?.me.role === "actor" && state.me.isMyTurn && ["performance", "finale"].includes(state.phase)) {
    event.preventDefault();
    command("NEXT_LINE");
  }
});
