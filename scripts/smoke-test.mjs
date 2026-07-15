import { spawn } from "node:child_process";

const port = 4199;
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["server/server.mjs"], {
  env: { ...process.env, PORT: String(port), HOST: "127.0.0.1" },
  stdio: ["ignore", "pipe", "pipe"]
});

let output = "";
server.stdout.on("data", (chunk) => { output += chunk; });
server.stderr.on("data", (chunk) => { output += chunk; });

try {
  await waitForServer();
  await testSoloRoom();
  await testDuoRoom();
  console.log("Smoke test passed — modes solo et duo validés.");
} finally {
  server.kill("SIGTERM");
}

async function testSoloRoom() {
  const actor = await request("/api/rooms", { name: "Solo Actor", actorSlots: 1 });
  const audience = await request(`/api/rooms/${actor.roomCode}/join`, { name: "Solo Public", role: "audience" });
  const send = commander(actor.roomCode);

  let actorState = await send(actor, "START_MATCH");
  actorState = await send(actor, "ADVANCE_PHASE");
  actorState = await send(actor, "ADVANCE_PHASE");
  const reaction = await send(audience, "REACTION", { reactionId: "tomato" });
  if (!reaction.effects.some((effect) => effect.type === "tomato")) throw new Error("La tomate solo n'a pas été résolue.");
  await send(actor, "RECOVERED");

  const totalLines = actorState.scene.lineCount;
  for (let index = 0; index < totalLines; index += 1) actorState = await send(actor, "NEXT_LINE");
  if (actorState.phase !== "verdict" || !actorState.verdict) throw new Error("Le verdict solo n'a pas été généré.");
}

async function testDuoRoom() {
  const actorOne = await request("/api/rooms", { name: "Actor One", actorSlots: 2 });
  const actorTwo = await request(`/api/rooms/${actorOne.roomCode}/join`, { name: "Actor Two", role: "actor" });
  const audience = await request(`/api/rooms/${actorOne.roomCode}/join`, { name: "Duo Public", role: "audience" });
  const send = commander(actorOne.roomCode);

  let state = await send(actorOne, "START_MATCH");
  state = await send(actorOne, "ADVANCE_PHASE");
  state = await send(actorOne, "ADVANCE_PHASE");
  await send(audience, "REACTION", { reactionId: "dramatic" });

  const sessions = new Map([[actorOne.playerId, actorOne], [actorTwo.playerId, actorTwo]]);
  const totalLines = state.scene.lineCount;
  for (let index = 0; index < totalLines; index += 1) {
    const currentActor = sessions.get(state.activeActorId);
    if (!currentActor) throw new Error(`Aucun comédien ne correspond au tour ${index + 1}.`);
    state = await send(currentActor, "NEXT_LINE");
  }
  if (state.phase !== "verdict" || !state.verdict) throw new Error("Le verdict duo n'a pas été généré.");
  if (state.verdict.castBalance <= 0) throw new Error("Le score de duo n'a pas été calculé.");
}

function commander(roomCode) {
  return (session, type, payload = {}) => request(`/api/rooms/${roomCode}/commands`, {
    playerId: session.playerId,
    token: session.token,
    type,
    payload
  });
}

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`${base}/api/health`);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Le serveur n'a pas démarré.\n${output}`);
}

async function request(path, body) {
  const response = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || `Erreur HTTP ${response.status}`);
  return payload;
}
