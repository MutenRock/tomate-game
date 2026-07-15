const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const sessionKey = "tomate.session.v031";
let session = loadSession();
let state = null;
let events = null;
let clockTimer = null;
let busy = false;
let serverOffset = 0;
const params = new URLSearchParams(location.search);

bootstrap();

async function bootstrap() {
  applyPreferences();
  if (session) {
    try {
      setState(await api(`/api/rooms/${session.roomCode}/state?playerId=${encodeURIComponent(session.playerId)}&token=${encodeURIComponent(session.token)}`));
      connect(); render(); return;
    } catch { sessionStorage.removeItem(sessionKey); session = null; }
  }
  renderLanding();
}

function renderLanding() {
  const joinCode = (params.get("join") || "").toUpperCase();
  app.innerHTML = `<main class="landing">
    <section class="hero"><p class="kicker">PLAYTEST READY · V0.3.1</p><h1>Tomate <em>!</em></h1><p>Une histoire, un ou deux comédiens, un public imprévisible — et maintenant un vrai parcours de test.</p><div class="chips"><span>Tutoriel 2–3 min</span><span>Prêt / reconnecté</span><span>Feedback intégré</span></div></section>
    <section class="entry-grid">
      <form id="createForm" class="card"><h2>Créer une salle</h2><label>Pseudo<input name="name" maxlength="24" required></label><fieldset><legend>Format</legend><label><input type="radio" name="actorSlots" value="1" checked> 1 comédien, deux rôles</label><label><input type="radio" name="actorSlots" value="2"> 2 comédiens</label></fieldset><button class="primary">Ouvrir le rideau</button></form>
      <form id="joinForm" class="card"><h2>Rejoindre</h2><label>Code de salle<input name="code" maxlength="5" value="${escapeHtml(joinCode)}" required></label><label>Pseudo<input name="name" maxlength="24" required></label><fieldset><legend>Place</legend><label><input type="radio" name="role" value="audience" checked> Public</label><label><input type="radio" name="role" value="actor"> Comédien 2</label></fieldset><button>Rejoindre</button></form>
      <form id="reclaimForm" class="card compact-card"><h2>Reprendre ma place</h2><p>À utiliser après un changement d’appareil ou une perte de session.</p><label>Code de salle<input name="code" maxlength="5" value="${escapeHtml(joinCode)}" required></label><label>Pseudo exact<input name="name" maxlength="24" required></label><label>Code de reprise<input name="reclaimCode" maxlength="6" required></label><button>Reprendre</button></form>
    </section>
    <section class="card settings"><strong>Confort</strong><label><input id="motionToggle" type="checkbox"> Réduire les animations</label><label><input id="contrastToggle" type="checkbox"> Contraste renforcé</label></section>
  </main>`;
  document.querySelector("#createForm").addEventListener("submit", createRoom);
  document.querySelector("#joinForm").addEventListener("submit", joinRoom);
  document.querySelector("#reclaimForm").addEventListener("submit", reclaimRoom);
  bindSettings();
}

async function createRoom(event) {
  event.preventDefault(); const data = new FormData(event.currentTarget);
  await enter(() => api("/api/rooms", { method: "POST", body: { name: data.get("name"), actorSlots: Number(data.get("actorSlots")) } }));
}
async function joinRoom(event) {
  event.preventDefault(); const data = new FormData(event.currentTarget); const code = String(data.get("code")).trim().toUpperCase();
  await enter(() => api(`/api/rooms/${code}/join`, { method: "POST", body: { name: data.get("name"), role: data.get("role") } }));
}
async function reclaimRoom(event) {
  event.preventDefault(); const data = new FormData(event.currentTarget); const code = String(data.get("code")).trim().toUpperCase();
  await enter(() => api(`/api/rooms/${code}/reclaim`, { method: "POST", body: { name: data.get("name"), reclaimCode: data.get("reclaimCode") } }));
}
async function enter(loader) {
  try { const result = await loader(); saveSession(result); setState(result.state); connect(); render(); }
  catch (error) { notify(error.message, true); }
}
function saveSession(result) { session = { roomCode: result.roomCode, playerId: result.playerId, token: result.token, role: result.role, reclaimCode: result.reclaimCode }; sessionStorage.setItem(sessionKey, JSON.stringify(session)); }
function loadSession() { try { return JSON.parse(sessionStorage.getItem(sessionKey)); } catch { return null; } }

function connect() {
  events?.close();
  events = new EventSource(`/api/rooms/${session.roomCode}/events?playerId=${encodeURIComponent(session.playerId)}&token=${encodeURIComponent(session.token)}`);
  events.addEventListener("state", (event) => { setState(JSON.parse(event.data)); render(); });
  events.onerror = () => notify("Reconnexion au serveur…");
  clearInterval(clockTimer); clockTimer = setInterval(updateTimers, 250);
}

function render() {
  if (!state) return renderLanding();
  app.innerHTML = `<main class="game ${state.me.role}">${header()}${state.paused ? pauseBanner() : ""}<section class="phase-guide">${phaseGuide()}</section><section class="layout"><article class="card main">${mainPanel()}</article><aside class="card aside">${sidePanel()}</aside></section><footer><button id="leave" class="link">Quitter</button><span>Aucun audio n’est enregistré.</span></footer></main>`;
  bindGame(); updateTimers();
}
function header() {
  return `<header><div><p class="kicker">SALLE <button id="copyCode" class="room-code">${state.roomCode}</button></p><h1>Tomate <em>!</em></h1></div><div class="phase"><span>${phaseLabel(state.phase)}</span><strong id="clock">${timeText()}</strong></div></header>`;
}
function pauseBanner() { return `<section class="pause"><strong>⏸ Partie en pause</strong><span>${escapeHtml(state.paused.reason)}. La scène reprendra automatiquement après reconnexion ou remplacement.</span></section>`; }
function phaseGuide() {
  const guides = { lobby:["Composez la troupe","Choisissez l’histoire, vérifiez les connexions puis mettez tout le monde prêt."], briefing:["Découvrez votre rôle","Lisez votre mission sans révéler l’objectif secret."], preparation:["Préparez-vous","Repérez personnage, intention et première réplique."], performance:["Jouez","Lisez uniquement la zone TEXTE À DIRE lorsque c’est votre tour."], finale:["Concluez","Donnez une vraie fin à l’histoire."], verdict:["Donnez votre retour","Le questionnaire prend moins d’une minute."] };
  const guide = guides[state.phase]; return `<strong>${guide[0]}</strong><span>${guide[1]}</span>`;
}
function mainPanel() {
  if (state.phase === "lobby") return lobbyPanel();
  if (state.phase === "verdict") return verdictPanel();
  if (["briefing", "preparation"].includes(state.phase)) return briefingPanel();
  return state.me.role === "actor" ? actorPanel() : audiencePanel();
}

function lobbyPanel() {
  const selected = state.availableScenes?.find((scene) => scene.id === state.scene.id);
  const host = state.me.isHost ? `<div class="host-controls"><label>Format<select id="slotSelect"><option value="1" ${state.actorSlots===1?"selected":""}>Solo — deux rôles</option><option value="2" ${state.actorSlots===2?"selected":""}>Duo — un rôle chacun</option></select></label><label>Histoire<select id="sceneSelect">${state.availableScenes.map((scene)=>`<option value="${scene.id}" ${scene.id===state.scene.id?"selected":""}>${scene.tutorial?"Tutoriel · ":""}${escapeHtml(scene.title)} · ${scene.lineCount} répliques</option>`).join("")}</select></label>${selected?`<div class="story-info"><strong>${escapeHtml(selected.theme)}</strong><span>${selected.tutorial?"Tutoriel conseillé avant le premier test · ":""}${Math.ceil(selected.durationSeconds/60)} min</span></div>`:""}<button class="primary big" data-command="START_MATCH" ${state.canStart?"":"disabled"}>Commencer</button>${state.startBlockers.length?`<ul class="blockers">${state.startBlockers.map((item)=>`<li>${escapeHtml(item)}</li>`).join("")}</ul>`:""}</div>` : `<p class="waiting">L’hôte prépare la partie.</p>`;
  return `<p class="kicker">SALON</p><h2>${escapeHtml(state.scene.title)}</h2><p>${escapeHtml(state.scene.theme)}</p><div class="invite"><strong>${state.roomCode}</strong><button id="copyJoin">Copier le lien</button></div>${reclaimBox()}${playerReadiness()}<button class="ready ${state.me.ready?"is-ready":""}" data-command="TOGGLE_READY" data-ready="${!state.me.ready}">${state.me.ready?"✓ Je suis prêt":"Je suis prêt"}</button>${host}`;
}
function reclaimBox() { return `<div class="reclaim"><span>Votre code de reprise</span><strong>${state.me.reclaimCode}</strong><button id="copyReclaim">Copier</button><small>Conservez-le seulement pour cette session.</small></div>`; }
function playerReadiness() {
  return `<div class="readiness">${state.players.map((player)=>`<div class="ready-row"><span class="dot ${player.connected?"online":"offline"}"></span><div><strong>${escapeHtml(player.name)}</strong><small>${roleText(player)} · ${player.connected?"connecté":"déconnecté"}</small></div><b class="ready-state ${player.ready?"yes":"no"}">${player.ready?"PRÊT":"PAS PRÊT"}</b></div>`).join("")}</div>`;
}
function briefingPanel() {
  if (state.me.role === "audience") return `<p class="kicker">${state.phase==="preparation"?"PRÉPARATION":"BRIEFING"}</p><h2>${escapeHtml(state.scene.title)}</h2><div class="mission"><span>VOTRE MISSION</span><p>${escapeHtml(state.private.brief)}</p></div>${state.scene.tutorial?`<div class="tutorial-tip">🎓 Le tutoriel vous indiquera quelle réaction essayer à chaque étape.</div>`:""}${state.me.isHost?`<button data-command="ADVANCE_PHASE">Passer cette phase</button>`:""}`;
  return `<p class="kicker">${state.phase==="preparation"?"PRÉPARATION":"BRIEFING"}</p><div class="identity"><span>VOUS JOUEZ</span><h2>${state.actorSlots===1?"LES DEUX PERSONNAGES":escapeHtml(state.private.character.name)}</h2></div><div class="brief-grid"><div class="mission"><span>MISSION</span><p>${escapeHtml(state.private.brief)}</p></div><div class="mission secret"><span>OBJECTIF SECRET</span><p>${escapeHtml(state.private.secretGoal)}</p></div></div>${state.scene.tutorial?`<div class="tutorial-tip">🎓 L’écran séparera toujours ce qui est à lire de ce qui est à jouer.</div>`:""}${state.me.isHost?`<button data-command="ADVANCE_PHASE">Passer cette phase</button>`:""}`;
}

function actorPanel() {
  const line = state.private.currentLine || {}; const character = state.private.currentCharacter || {}; const myTurn = state.private.isMyTurn;
  return `<div class="stage-head"><div><p class="kicker">${escapeHtml(line.act||state.currentAct)}</p><h2>${escapeHtml(state.scene.title)}</h2></div><span>${state.lineIndex+1}/${state.private.totalLines}</span></div><div class="turn ${myTurn?"mine":"wait"}"><strong>${myTurn?"▶ À TOI — LIS MAINTENANT":`⏸ ATTENDS — ${escapeHtml(character.name)} PARLE`}</strong><span>${myTurn?"Les autres vous écoutent.":"Préparez votre prochaine intervention."}</span></div>${state.scene.tutorial&&line.tutorialActorTip?`<div class="tutorial-tip">🎓 ${escapeHtml(line.tutorialActorTip)}</div>`:""}<div class="script ${hasEffect("blackout")?"dark":""}">${effectBanners()}<div class="splats">${state.effects.filter((effect)=>effect.type==="tomato").map(splatHtml).join("")}</div><section class="direction"><span>NE PAS LIRE — DIDASCALIE</span><p>${escapeHtml(line.stageDirection)}</p></section><section class="intention"><span>INTENTION</span><p>${escapeHtml(line.emotion)}</p></section><section class="spoken"><span>${myTurn?"TEXTE À DIRE À VOIX HAUTE":"RÉPLIQUE À ÉCOUTER"}</span><b>${escapeHtml(character.name||line.speaker||"")}</b><p>${escapeHtml(line.text)}</p></section><div class="after"><section><span>APRÈS</span><p>${escapeHtml(line.after)}</p></section><section><span>REPÈRE</span><p>${escapeHtml(line.cue)}</p></section></div></div><div class="actions">${myTurn?`<button class="primary big" data-command="NEXT_LINE">J’ai terminé cette réplique</button><button data-command="RECOVERED">J’ai intégré l’incident</button>`:`<div class="waiting">Le bouton apparaîtra à votre tour.</div>`}${state.me.isHost?`<button data-command="FORCE_NEXT_LINE">Forcer le passage</button><button data-command="END_MATCH">Forcer le verdict</button>`:""}</div>`;
}
function audiencePanel() {
  const current = state.private.currentLine || {}; const reactions = state.private.reactions || [];
  return `<p class="kicker">PUBLIC</p><h2>${escapeHtml(state.scene.title)}</h2><div class="now"><span>EN CE MOMENT</span><strong>${escapeHtml(current.speaker||state.currentSpeaker)}</strong><small>${escapeHtml(current.act||state.currentAct)}</small></div>${state.scene.tutorial&&current.tutorialAudienceTip?`<div class="tutorial-tip">🎓 ${escapeHtml(current.tutorialAudienceTip)}</div>`:""}<div class="energy"><strong>${"●".repeat(state.me.energy)}${"○".repeat(Math.max(0,6-state.me.energy))}</strong><span>+1 tomate toutes les 20 secondes</span></div><div class="reactions">${reactions.map((reaction)=>reactionButton(reaction,current.recommendedReaction)).join("")}</div><p class="rule">Une bonne perturbation crée du jeu ; elle ne bloque pas la scène.</p>`;
}
function reactionButton(reaction, recommended) {
  const ready=(state.me.cooldowns[reaction.id]||0)<=nowServer(); const enough=state.me.energy>=reaction.cost;
  return `<button class="reaction ${reaction.kind==="positive"?"positive":""} ${recommended===reaction.id?"recommended":""}" data-reaction="${reaction.id}" data-label="${escapeHtml(reaction.label)}" data-cost="${reaction.cost}" ${ready&&enough?"":"disabled"}><span class="cost">${reaction.cost}</span><strong>${escapeHtml(reaction.label)}</strong><small>${escapeHtml(reaction.description)}</small>${recommended===reaction.id?"<em>À ESSAYER MAINTENANT</em>":""}</button>`;
}
function verdictPanel() {
  const verdict=state.verdict;
  return `<p class="kicker">VERDICT</p><h2>${escapeHtml(verdict.title)}</h2><div class="score">${verdict.total}<small>/100</small></div><blockquote>${escapeHtml(verdict.quote)}</blockquote><div class="score-grid"><div><b>${verdict.continuity}</b><span>Histoire</span></div><div><b>${verdict.recovery}</b><span>Récupération</span></div><div><b>${verdict.audience}</b><span>Public</span></div><div><b>${verdict.castBalance}</b><span>${escapeHtml(verdict.castLabel)}</span></div></div>${feedbackPanel()}${state.me.isHost?`<div class="host-end"><button id="exportReport">Exporter le rapport JSON</button><span>${state.feedbackSummary.submitted}/${state.feedbackSummary.expected} retours reçus</span><button class="primary" data-command="RESTART">Nouvelle partie</button></div>`:""}`;
}
function feedbackPanel() {
  if (state.me.feedbackSubmitted) return `<div class="feedback-thanks"><strong>Merci !</strong><span>Votre retour est enregistré dans le rapport de playtest.</span></div>`;
  return `<form id="feedbackForm" class="feedback"><h3>Retour rapide</h3>${rating("roleClarity","J’ai compris mon rôle")}${rating("actionClarity","Je savais toujours quoi faire")}${rating("durationFit","La durée était adaptée")}${rating("disruptionsFun","Les perturbations étaient amusantes")}<label>Je voudrais rejouer<select name="replay" required><option value="yes">Oui</option><option value="maybe" selected>Peut-être</option><option value="no">Non</option></select></label><label>Moment mémorable — facultatif<textarea name="memorableMoment" maxlength="500"></textarea></label><button class="primary">Envoyer mon retour</button></form>`;
}
function rating(name,label) { return `<label>${label}<select name="${name}" required><option value="5">5 — Tout à fait</option><option value="4">4</option><option value="3" selected>3 — Moyen</option><option value="2">2</option><option value="1">1 — Pas du tout</option></select></label>`; }

function sidePanel() {
  const disconnectedActor = state.players.find((player)=>player.role==="actor"&&!player.connected);
  return `<section><div class="side-title"><span>TROUPE</span><b>${state.players.length}/12</b></div>${state.players.map((player)=>`<div class="player"><span class="dot ${player.connected?"online":"offline"}"></span><div><strong>${escapeHtml(player.name)}</strong><small>${roleText(player)} · ${player.ready?"prêt":"pas prêt"}</small></div>${replacementButton(player,disconnectedActor)}</div>`).join("")}</section><section class="log"><div class="side-title"><span>JOURNAL</span></div><ol>${state.events.slice(0,12).map((event)=>`<li class="${event.kind}">${escapeHtml(event.text)}</li>`).join("")}</ol></section>`;
}
function replacementButton(player,disconnectedActor) {
  if (!state.me.isHost||!disconnectedActor||player.role!=="audience"||!player.connected||state.phase==="verdict") return "";
  return `<button class="mini" data-replace-slot="${disconnectedActor.actorSlot}" data-player-id="${player.id}">Remplacer</button>`;
}
function roleText(player) { return player.role==="actor"?(player.characterName||`Comédien ${Number(player.actorSlot)+1}`):"Public"; }

function effectBanners() { return state.effects.filter((effect)=>["dramatic","phone","forbidden"].includes(effect.type)).map((effect)=>`<div class="effect ${effect.type}" data-effect-end="${effect.endsAt}"><strong>${escapeHtml(effect.by)} → ${escapeHtml(effect.targetActorName)}</strong><span>${effect.type==="forbidden"?`MOT INTERDIT : ${escapeHtml(effect.word.toUpperCase())}`:escapeHtml(effect.label)}</span><small class="effect-time"></small></div>`).join(""); }
function splatHtml(effect) { return `<span class="splat" style="left:${effect.x}%;top:${effect.y}%;--r:${effect.rotation}deg"></span>`; }
function hasEffect(type) { return state.effects.some((effect)=>effect.type===type); }

function bindGame() {
  document.querySelector("#copyCode")?.addEventListener("click",()=>copy(state.roomCode));
  document.querySelector("#copyJoin")?.addEventListener("click",()=>copy(`${location.origin}/?join=${state.roomCode}`));
  document.querySelector("#copyReclaim")?.addEventListener("click",()=>copy(state.me.reclaimCode));
  document.querySelector("#leave")?.addEventListener("click",leaveRoom);
  document.querySelector("#sceneSelect")?.addEventListener("change",(event)=>command("SET_SCENE",{sceneId:event.target.value}));
  document.querySelector("#slotSelect")?.addEventListener("change",(event)=>command("SET_ACTOR_SLOTS",{actorSlots:Number(event.target.value)}));
  document.querySelectorAll("[data-command]").forEach((button)=>button.addEventListener("click",()=>command(button.dataset.command,{ready:button.dataset.ready==="true"})));
  document.querySelectorAll("[data-reaction]").forEach((button)=>button.addEventListener("click",async()=>{ await command("REACTION",{reactionId:button.dataset.reaction}); notify(`${button.dataset.label} envoyée à ${state.currentSpeaker}.`); }));
  document.querySelectorAll("[data-replace-slot]").forEach((button)=>button.addEventListener("click",()=>command("REPLACE_ACTOR",{actorSlot:Number(button.dataset.replaceSlot),playerId:button.dataset.playerId})));
  document.querySelector("#feedbackForm")?.addEventListener("submit",submitFeedback);
  document.querySelector("#exportReport")?.addEventListener("click",exportReport);
}
async function submitFeedback(event) { event.preventDefault(); const data=Object.fromEntries(new FormData(event.currentTarget)); await command("SUBMIT_FEEDBACK",data); notify("Merci pour votre retour !"); }
async function exportReport() {
  try { const report=await api(`/api/rooms/${session.roomCode}/report?playerId=${encodeURIComponent(session.playerId)}&token=${encodeURIComponent(session.token)}`); const blob=new Blob([JSON.stringify(report,null,2)],{type:"application/json"}); const url=URL.createObjectURL(blob); const link=document.createElement("a"); link.href=url; link.download=`tomate-playtest-${session.roomCode}-${new Date().toISOString().slice(0,10)}.json`; link.click(); URL.revokeObjectURL(url); notify("Rapport exporté."); } catch(error) { notify(error.message,true); }
}
function leaveRoom() { events?.close(); sessionStorage.removeItem(sessionKey); session=null; state=null; history.replaceState({},"",location.pathname); renderLanding(); }
async function command(type,payload={}) { if(busy)return; busy=true; try { setState(await api(`/api/rooms/${session.roomCode}/commands`,{method:"POST",body:{playerId:session.playerId,token:session.token,type,payload}})); render(); } catch(error) { notify(error.message,true); } finally { busy=false; } }

function updateTimers() {
  document.querySelector("#clock")?.replaceChildren(document.createTextNode(timeText()));
  document.querySelectorAll("[data-effect-end]").forEach((element)=>{ const remaining=Math.max(0,Math.ceil((Number(element.dataset.effectEnd)-nowServer())/1000)); const target=element.querySelector(".effect-time"); if(target)target.textContent=`${remaining}s`; });
  if(state?.me.role==="audience") document.querySelectorAll("[data-reaction]").forEach((button)=>{ button.disabled=(state.me.cooldowns[button.dataset.reaction]||0)>nowServer()||state.me.energy<Number(button.dataset.cost||0); });
}
function timeText() { if(state?.paused)return "PAUSE"; if(!state?.phaseEndsAt)return state?.phase==="lobby"?"EN ATTENTE":state?.phase==="verdict"?"RIDEAU":"—"; const seconds=Math.max(0,Math.ceil((state.phaseEndsAt-nowServer())/1000)); return `${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`; }
function setState(next) { state=next; if(Number.isFinite(state?.serverNow))serverOffset=state.serverNow-Date.now(); }
function nowServer() { return Date.now()+serverOffset; }
function phaseLabel(phase) { return ({lobby:"Salon",briefing:"Briefing",preparation:"Préparation",performance:"Représentation",finale:"Finale",verdict:"Verdict"})[phase]||phase; }

function applyPreferences() { document.documentElement.dataset.motion=localStorage.getItem("tomate.reduceMotion")==="1"?"reduced":"full"; document.documentElement.dataset.contrast=localStorage.getItem("tomate.contrast")==="1"?"high":"normal"; }
function bindSettings() { const motion=document.querySelector("#motionToggle"); const contrast=document.querySelector("#contrastToggle"); motion.checked=document.documentElement.dataset.motion==="reduced"; contrast.checked=document.documentElement.dataset.contrast==="high"; motion.addEventListener("change",()=>{localStorage.setItem("tomate.reduceMotion",motion.checked?"1":"0");applyPreferences();}); contrast.addEventListener("change",()=>{localStorage.setItem("tomate.contrast",contrast.checked?"1":"0");applyPreferences();}); }
async function api(url,options={}) { const response=await fetch(url,{...options,headers:{"Content-Type":"application/json",...(options.headers||{})},body:options.body?JSON.stringify(options.body):undefined}); const payload=await response.json().catch(()=>({})); if(!response.ok)throw new Error(payload.error||`Erreur ${response.status}`); return payload; }
function notify(message,error=false) { toast.textContent=message; toast.className=`toast show ${error?"error":""}`; clearTimeout(notify.timer); notify.timer=setTimeout(()=>toast.className="toast",2600); }
async function copy(value) { try{await navigator.clipboard.writeText(value);notify("Copié !");}catch{notify(value);} }
function escapeHtml(value) { return String(value??"").replace(/[&<>'"]/g,(char)=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[char]); }

document.addEventListener("keydown",(event)=>{ if(event.code!=="Space"||event.repeat||["INPUT","TEXTAREA","SELECT","BUTTON"].includes(document.activeElement?.tagName))return; if(state?.me.role==="actor"&&state.me.isMyTurn&&["performance","finale"].includes(state.phase)&&!state.paused){event.preventDefault();command("NEXT_LINE");} });
