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
  const actor = await request("/api/rooms", { name: "Test Actor" });
  const audience = await request(`/api/rooms/${actor.roomCode}/join`, { name: "Test Public" });

  const command = (session, type, payload = {}) => request(`/api/rooms/${actor.roomCode}/commands`, {
    playerId: session.playerId,
    token: session.token,
    type,
    payload
  });

  await command(actor, "START_MATCH");
  await command(actor, "ADVANCE_PHASE");
  await command(actor, "ADVANCE_PHASE");
  const reaction = await command(audience, "REACTION", { reactionId: "tomato" });

  if (reaction.phase !== "performance") throw new Error("La phase performance n'est pas active.");
  if (!reaction.effects.some((effect) => effect.type === "tomato")) throw new Error("La tomate n'a pas été résolue.");

  await command(actor, "RECOVERED");
  await command(actor, "NEXT_LINE");
  await command(actor, "NEXT_LINE");
  await command(actor, "NEXT_LINE");
  await command(actor, "NEXT_LINE");
  const verdict = await command(actor, "NEXT_LINE");

  if (verdict.phase !== "verdict" || !verdict.verdict) throw new Error("Le verdict n'a pas été généré.");
  console.log(`Smoke test passed — salle ${actor.roomCode}, score ${verdict.verdict.total}/100.`);
} finally {
  server.kill("SIGTERM");
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
