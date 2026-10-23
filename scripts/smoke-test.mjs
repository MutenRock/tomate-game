import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
const port=4199;const base=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,["server/server.mjs"],{cwd:fileURLToPath(new URL("..",import.meta.url)),env:{...process.env,PORT:String(port),HOST:"127.0.0.1"},stdio:["ignore","pipe","pipe"]});
let logs="";server.stdout.on("data",(c)=>logs+=c);server.stderr.on("data",(c)=>logs+=c);
const streams=[];
try{await waitForServer();await testReadiness();await testDuoReconnectFeedback();await testDuoWithoutAudienceAvatarVoice();console.log("Smoke test passed — ready state, pause/reclaim, duo, feedback, report, wardrobe, duo without audience and voice relay validated.");}finally{for(const stream of streams)stream.abort();server.kill("SIGTERM");}

async function testReadiness(){
  const host=await post("/api/rooms",{name:"Host",actorSlots:1});
  const audience=await post(`/api/rooms/${host.roomCode}/join`,{name:"Public",role:"audience"});
  await openStream(host);await openStream(audience);
  let failed=false;try{await command(host,"START_MATCH");}catch(error){failed=/prêt/i.test(error.message);}if(!failed)throw new Error("La partie devrait être bloquée avant les états prêt.");
  await command(host,"TOGGLE_READY",{ready:true});await command(audience,"TOGGLE_READY",{ready:true});
  const started=await command(host,"START_MATCH");if(started.phase!=="briefing")throw new Error("Le briefing n'a pas démarré.");
}

async function testDuoReconnectFeedback(){
  const host=await post("/api/rooms",{name:"Alice",actorSlots:2});
  const actor2=await post(`/api/rooms/${host.roomCode}/join`,{name:"Bob",role:"actor"});
  const audience=await post(`/api/rooms/${host.roomCode}/join`,{name:"Charly",role:"audience"});
  const hostStream=await openStream(host);const actorStream=await openStream(actor2);await openStream(audience);
  for(const session of [host,actor2,audience])await command(session,"TOGGLE_READY",{ready:true});
  let state=await command(host,"START_MATCH");state=await command(host,"ADVANCE_PHASE");state=await command(host,"ADVANCE_PHASE");
  await command(audience,"REACTION",{reactionId:"tomato"});
  actorStream.abort();await sleep(2900);
  state=await getState(host);if(!state.paused)throw new Error("La déconnexion du second comédien n'a pas mis la scène en pause.");
  const reclaimed=await post(`/api/rooms/${host.roomCode}/reclaim`,{name:"Bob",reclaimCode:actor2.reclaimCode});
  await openStream(reclaimed);await sleep(300);
  state=await getState(host);if(state.paused)throw new Error("La reprise de place n'a pas relancé la scène.");
  const actors=new Map([[host.playerId,host],[reclaimed.playerId,reclaimed]]);
  while(state.phase!=="verdict"){
    const current=actors.get(state.activeActorId);if(!current)throw new Error("Tour de parole sans comédien associé.");
    state=await command(current,"NEXT_LINE");
  }
  await command(host,"SUBMIT_FEEDBACK",{roleClarity:5,actionClarity:5,durationFit:4,disruptionsFun:5,replay:"yes",memorableMoment:"La tomate du tutoriel."});
  await command(audience,"SUBMIT_FEEDBACK",{roleClarity:4,actionClarity:5,durationFit:4,disruptionsFun:4,replay:"yes",memorableMoment:"Le passage de parole."});
  const report=await get(`/api/rooms/${host.roomCode}/report?playerId=${host.playerId}&token=${host.token}`);
  if(report.version!=="0.3.2"||report.feedback.submitted!==2)throw new Error("Le rapport de playtest est incomplet.");
  const serialized=JSON.stringify(report);if(serialized.includes("Alice")||serialized.includes("Bob")||serialized.includes("Charly"))throw new Error("Le rapport ne doit pas contenir les pseudos.");
  hostStream.abort();
}

async function testDuoWithoutAudienceAvatarVoice(){
  const host=await post("/api/rooms",{name:"Ana",actorSlots:2});
  const actor2=await post(`/api/rooms/${host.roomCode}/join`,{name:"Ben",role:"actor"});
  await openStream(host);
  const controller=new AbortController();streams.push(controller);
  const response=await fetch(`${base}/api/rooms/${host.roomCode}/events?playerId=${actor2.playerId}&token=${actor2.token}`,{signal:controller.signal});
  const reader=response.body.getReader();
  let state=await command(host,"SET_AVATAR",{hat:"crown",outfit:"king",skin:"mint"});
  if(state.me.avatar.hat!=="crown"||state.me.avatar.skin!=="mint")throw new Error("Le costume n'a pas été appliqué.");
  let rejected=false;try{await command(host,"SET_AVATAR",{hat:"inconnu"});}catch{rejected=true;}if(!rejected)throw new Error("Un costume inconnu doit être refusé.");
  for(const session of [host,actor2])await command(session,"TOGGLE_READY",{ready:true});
  state=await command(host,"START_MATCH");if(state.phase!=="briefing")throw new Error("Un duo sans public doit pouvoir démarrer.");
  await post(`/api/rooms/${host.roomCode}/voice`,{playerId:host.playerId,token:host.token,level:6});
  const decoder=new TextDecoder();let received="";const deadline=Date.now()+2500;
  while(!received.includes("event: voice")&&Date.now()<deadline){const chunk=await Promise.race([reader.read(),sleep(500).then(()=>null)]);if(chunk?.value)received+=decoder.decode(chunk.value);}
  if(!received.includes("event: voice")||!received.includes(host.playerId))throw new Error("Le niveau de voix n'a pas été relayé.");
  state=await command(host,"ADVANCE_PHASE");state=await command(host,"ADVANCE_PHASE");
  rejected=false;try{await command(host,"SET_AVATAR",{hat:"none"});}catch{rejected=true;}if(!rejected)throw new Error("Le vestiaire doit être fermé pendant la scène.");
  state=await command(host,"END_MATCH");if(state.phase!=="verdict"||state.verdict.audience!==null)throw new Error("Le verdict d'un duo sans public est incorrect.");
}

async function openStream(session){const controller=new AbortController();streams.push(controller);const response=await fetch(`${base}/api/rooms/${session.roomCode}/events?playerId=${session.playerId}&token=${session.token}`,{signal:controller.signal});if(!response.ok)throw new Error("SSE impossible");return controller;}
async function getState(session){return get(`/api/rooms/${session.roomCode}/state?playerId=${session.playerId}&token=${session.token}`);}
async function command(session,type,payload={}){return post(`/api/rooms/${session.roomCode}/commands`,{playerId:session.playerId,token:session.token,type,payload});}
async function post(path,body){const response=await fetch(`${base}${path}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});const payload=await response.json();if(!response.ok)throw new Error(payload.error||`HTTP ${response.status}`);return payload;}
async function get(path){const response=await fetch(`${base}${path}`);const payload=await response.json();if(!response.ok)throw new Error(payload.error||`HTTP ${response.status}`);return payload;}
async function waitForServer(){for(let i=0;i<50;i+=1){try{const response=await fetch(`${base}/api/health`);if(response.ok)return;}catch{}await sleep(100);}throw new Error(`Serveur non démarré.\n${logs}`);}
function sleep(ms){return new Promise((resolve)=>setTimeout(resolve,ms));}
