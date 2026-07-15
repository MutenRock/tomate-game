const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const sessionKey = "tomate.session.v1";
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
    try { setState(await api(`/api/rooms/${session.roomCode}/state?playerId=${encodeURIComponent(session.playerId)}&token=${encodeURIComponent(session.token)}`)); connect(); render(); return; }
    catch { sessionStorage.removeItem(sessionKey); session = null; }
  }
  renderLanding();
}

function renderLanding() {
  const joinCode = (params.get("join") || "").toUpperCase();
  app.innerHTML = `<main class="landing">
    <section class="hero">
      <p class="kicker">PROTOTYPE MULTIJOUEUR LOCAL · V0.2</p>
      <h1>Tomate <em>!</em></h1>
      <p class="lead">Préparez-vous vite. Jouez votre rôle. Continuez quand tout part de travers.</p>
      <div class="feature-row"><span>2–12 joueurs</span><span>PC + téléphones</span><span>Voix via Discord</span></div>
    </section>
    <section class="entry-grid">
      <form id="createForm" class="card entry-card">
        <p class="kicker">COMÉDIEN / HÔTE</p><h2>Créer une salle</h2>
        <label>Votre pseudo<input name="name" maxlength="24" required placeholder="Le Roi"></label>
        <button class="primary" type="submit">Ouvrir le rideau</button>
      </form>
      <form id="joinForm" class="card entry-card">
        <p class="kicker">PUBLIC</p><h2>Rejoindre une salle</h2>
        <label>Code de salle<input name="code" maxlength="5" required value="${escapeHtml(joinCode)}" placeholder="ABCDE" autocapitalize="characters"></label>
        <label>Votre pseudo<input name="name" maxlength="24" required placeholder="Tomatophile"></label>
        <button type="submit">Rejoindre le public</button>
      </form>
    </section>
    <section class="settings card"><strong>Confort</strong><label><input id="motionToggle" type="checkbox" ${document.documentElement.dataset.motion === "reduced" ? "checked" : ""}> Réduire les animations</label><label><input id="contrastToggle" type="checkbox" ${document.documentElement.dataset.contrast === "high" ? "checked" : ""}> Contraste renforcé</label></section>
  </main>`;
  document.querySelector("#createForm").addEventListener("submit", createRoom);
  document.querySelector("#joinForm").addEventListener("submit", joinRoom);
  bindSettings();
}

async function createRoom(event) {
  event.preventDefault(); const data = new FormData(event.currentTarget);
  try { const result = await api("/api/rooms", { method:"POST", body:{name:data.get("name")} }); saveSession(result); setState(result.state); connect(); render(); }
  catch (e) { notify(e.message, true); }
}
async function joinRoom(event) {
  event.preventDefault(); const data = new FormData(event.currentTarget); const code=String(data.get("code")).trim().toUpperCase();
  try { const result = await api(`/api/rooms/${code}/join`, { method:"POST", body:{name:data.get("name")} }); saveSession(result); setState(result.state); connect(); render(); }
  catch (e) { notify(e.message, true); }
}
function saveSession(result) { session={roomCode:result.roomCode,playerId:result.playerId,token:result.token,role:result.role}; sessionStorage.setItem(sessionKey,JSON.stringify(session)); }
function loadSession() { try { return JSON.parse(sessionStorage.getItem(sessionKey)); } catch { return null; } }
function connect() {
  events?.close();
  events = new EventSource(`/api/rooms/${session.roomCode}/events?playerId=${encodeURIComponent(session.playerId)}&token=${encodeURIComponent(session.token)}`);
  events.addEventListener("state", (event) => { setState(JSON.parse(event.data)); render(); });
  events.onerror=()=>notify("Reconnexion au serveur…");
  clearInterval(clockTimer); clockTimer=setInterval(updateClock,250);
}

function render() {
  if (!state) return renderLanding();
  const roleClass=state.me.role === "actor" ? "actor" : "audience";
  app.innerHTML = `<main class="game ${roleClass}">
    ${header()}
    <section class="game-grid">
      <article class="card main-panel">${mainPanel()}</article>
      <aside class="card side-panel">${sidePanel()}</aside>
    </section>
    <footer><button class="text-button" id="leave">Quitter la salle</button><span>Prototype local — aucune voix ni donnée n’est enregistrée.</span></footer>
  </main>`;
  bindGame(); updateClock();
}
function header() {
  return `<header class="game-header"><div><p class="kicker">SALLE <button class="room-code" id="copyCode">${state.roomCode}</button></p><h1>Tomate <em>!</em></h1></div><div class="phase"><span>${phaseLabel(state.phase)}</span><strong id="clock">${timeText()}</strong></div></header>`;
}
function mainPanel() {
  if (state.phase === "lobby") return lobbyPanel();
  if (state.phase === "verdict") return verdictPanel();
  if (["briefing","preparation"].includes(state.phase)) return briefingPanel();
  return performancePanel();
}
function lobbyPanel() {
  const hostControls=state.me.isHost ? `<label class="scene-select">Thème<select id="sceneSelect">${state.availableScenes.map(s=>`<option value="${s.id}" ${s.id===state.scene.id?'selected':''}>${escapeHtml(s.title)} — ${escapeHtml(s.theme)}</option>`).join("")}</select></label><button class="primary big" data-command="START_MATCH">Commencer la représentation</button>` : `<div class="waiting">Le comédien choisit le thème…</div>`;
  return `<p class="kicker">AVANT LE LEVER DE RIDEAU</p><h2>${escapeHtml(state.scene.title)}</h2><p class="theme">${escapeHtml(state.scene.theme)}</p><div class="lobby-code"><span>Invitez le public avec</span><strong>${state.roomCode}</strong><button id="copyJoin">Copier le lien d’invitation</button></div>${hostControls}`;
}
function briefingPanel() {
  const isPrep=state.phase === "preparation";
  return `<p class="kicker">${isPrep?'PRÉPARATION':'BRIEFING'}</p><h2>${escapeHtml(state.scene.title)}</h2><p class="theme">${escapeHtml(state.scene.theme)}</p><div class="brief-box"><span>VOTRE MISSION</span><p>${escapeHtml(state.private.brief)}</p></div>${state.me.role==='actor'?`<div class="secret-box"><span>OBJECTIF SECRET</span><p>${escapeHtml(state.private.secretGoal)}</p></div>`:''}${state.me.isHost?`<button data-command="ADVANCE_PHASE">Passer cette phase</button>`:''}`;
}
function performancePanel() {
  if (state.me.role === "actor") return actorPerformance();
  return audiencePerformance();
}
function actorPerformance() {
  const line=state.private.line || {};
  return `<div class="stage-head"><div><p class="kicker">${state.phase==='finale'?'FINALE — CONCLUEZ !':'EN SCÈNE'}</p><h2>${escapeHtml(state.scene.title)}</h2></div><span class="line-count">${state.lineIndex+1}/${state.private.totalLines}</span></div>
    <div class="script-window ${hasEffect('blackout')?'is-dark':''}">
      <div class="splats">${state.effects.filter(e=>e.type==='tomato').map(splatHtml).join('')}</div>
      ${effectBanners()}
      <p class="speaker">${escapeHtml(line.speaker||'')}</p><p class="script-line">${escapeHtml(line.text||'')}</p>
      <div class="cue"><span>PROCHAIN CUE</span><strong>${escapeHtml(line.cue||'Improviser')}</strong></div>
    </div>
    <div class="actions"><button class="primary big" data-command="NEXT_LINE">${state.lineIndex+1>=state.private.totalLines?'Terminer la pièce':'Réplique dite'}</button><button data-command="RECOVERED">J’ai sauvé l’incident</button>${state.me.isHost?`<button class="danger-quiet" data-command="END_MATCH">Forcer le verdict</button>`:''}</div>`;
}
function audiencePerformance() {
  const reactions=state.private.reactions || [];
  return `<p class="kicker">VOUS ÊTES LE PUBLIC</p><h2>${state.phase==='finale'?'Dernière chance de réagir':'Faites vivre la salle'}</h2><p class="theme">Le comédien joue <strong>${escapeHtml(state.scene.title)}</strong>. Gênez-le, encouragez-le, mais laissez-lui toujours une chance de rebondir.</p><div class="energy"><span>Vos tomates</span><strong>${'●'.repeat(state.me.energy)}${'○'.repeat(Math.max(0,6-state.me.energy))}</strong><small>+1 toutes les 20 secondes ou après une réplique</small></div><div class="reaction-grid">${reactions.map(reactionHtml).join('')}</div>`;
}
function verdictPanel() {
  const v=state.verdict;
  return `<p class="kicker">VERDICT DU PUBLIC</p><h2>${escapeHtml(v.title)}</h2><div class="score">${v.total}<small>/100</small></div><blockquote>${escapeHtml(v.quote)}</blockquote><div class="score-grid"><div><strong>${v.continuity}</strong><span>Continuité</span></div><div><strong>${v.recovery}</strong><span>Récupération</span></div><div><strong>${v.audience}</strong><span>Public</span></div><div><strong>${v.ending}</strong><span>Finale</span></div></div>${state.me.isHost?`<button class="primary big" data-command="RESTART">Nouvelle représentation</button>`:'<p>Le comédien prépare la prochaine manche.</p>'}`;
}
function sidePanel() {
  return `<section class="players"><div class="side-title"><span>LA TROUPE</span><strong>${state.players.length}/12</strong></div>${state.players.map(p=>`<div class="player"><span>${p.role==='actor'?'🎭':'🍅'}</span><strong>${escapeHtml(p.name)}</strong><small>${p.role==='actor'?'Comédien':'Public'}</small></div>`).join('')}</section><section class="log"><div class="side-title"><span>JOURNAL DE SALLE</span></div><ol>${state.events.slice(0,10).map(e=>`<li class="${e.kind}">${escapeHtml(e.text)}</li>`).join('')}</ol></section>`;
}
function effectBanners() { return state.effects.filter(e=>['dramatic','phone','forbidden'].includes(e.type)).map(e=>`<div class="effect-banner ${e.type}">${e.type==='forbidden'?`MOT INTERDIT : ${escapeHtml(e.word.toUpperCase())}`:escapeHtml(e.label)}</div>`).join(''); }
function splatHtml(e) { return `<span class="splat" style="left:${e.x}%;top:${e.y}%;--r:${e.rotation}deg"></span>`; }
function reactionHtml(r) { const ready=(state.me.cooldowns[r.id]||0)<=nowServer(); const enough=state.me.energy>=r.cost; return `<button class="reaction ${r.kind==='positive'?'positive':''}" data-reaction="${r.id}" data-cost="${r.cost}" ${ready&&enough?'':'disabled'}><span class="cost">${r.cost}</span><strong>${escapeHtml(r.label)}</strong><small>${escapeHtml(r.description)}</small></button>`; }
function bindGame() {
  document.querySelector("#copyCode")?.addEventListener("click",()=>copy(state.roomCode));
  document.querySelector("#copyJoin")?.addEventListener("click",()=>copy(`${location.origin}/?join=${state.roomCode}`));
  document.querySelector("#leave")?.addEventListener("click",()=>{events?.close();sessionStorage.removeItem(sessionKey);session=null;state=null;history.replaceState({},'',location.pathname);renderLanding();});
  document.querySelector("#sceneSelect")?.addEventListener("change",e=>command("SET_SCENE",{sceneId:e.target.value}));
  document.querySelectorAll("[data-command]").forEach(b=>b.addEventListener("click",()=>command(b.dataset.command)));
  document.querySelectorAll("[data-reaction]").forEach(b=>b.addEventListener("click",()=>command("REACTION",{reactionId:b.dataset.reaction})));
}
async function command(type,payload={}) { if (busy) return; busy=true; try { setState(await api(`/api/rooms/${session.roomCode}/commands`,{method:"POST",body:{playerId:session.playerId,token:session.token,type,payload}}));render(); } catch(e){notify(e.message,true);} finally{busy=false;} }
function updateClock() { const el=document.querySelector("#clock"); if(el) el.textContent=timeText(); updateReactionButtons(); }
function timeText() { if(!state?.phaseEndsAt) return state?.phase==='lobby'?'EN ATTENTE':state?.phase==='verdict'?'RIDEAU':'—'; return formatSeconds(Math.max(0,Math.ceil((state.phaseEndsAt-nowServer())/1000))); }
function formatSeconds(s){return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}

function setState(nextState){ state=nextState; if(Number.isFinite(state?.serverNow)) serverOffset=state.serverNow-Date.now(); }
function nowServer(){ return Date.now()+serverOffset; }
function updateReactionButtons(){
  if(!state || state.me.role!=="audience") return;
  document.querySelectorAll("[data-reaction]").forEach((button)=>{
    const cooldown=(state.me.cooldowns[button.dataset.reaction]||0)>nowServer();
    const expensive=state.me.energy<Number(button.dataset.cost||0);
    button.disabled=cooldown||expensive;
  });
}
function phaseLabel(p){return ({lobby:'Salon',briefing:'Briefing',preparation:'Préparation',performance:'Représentation',finale:'Finale',verdict:'Verdict'})[p]||p;}
function hasEffect(type){return state.effects.some(e=>e.type===type);}
function bindSettings(){document.querySelector('#motionToggle')?.addEventListener('change',e=>{localStorage.setItem('tomate.reduceMotion',e.target.checked?'1':'0');document.documentElement.dataset.motion=e.target.checked?'reduced':'full';});document.querySelector('#contrastToggle')?.addEventListener('change',e=>{localStorage.setItem('tomate.contrast',e.target.checked?'1':'0');document.documentElement.dataset.contrast=e.target.checked?'high':'normal';});}
async function api(url,options={}){const response=await fetch(url,{...options,headers:{'Content-Type':'application/json',...(options.headers||{})},body:options.body?JSON.stringify(options.body):undefined});const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||`Erreur ${response.status}`);return data;}
async function copy(text){try{await navigator.clipboard.writeText(text);notify('Copié !');}catch{prompt('Copiez ce texte :',text);}}
function notify(message,error=false){toast.textContent=message;toast.className=`toast show ${error?'error':''}`;clearTimeout(notify.t);notify.t=setTimeout(()=>toast.className='toast',2200);}
function escapeHtml(value){return String(value??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));}
