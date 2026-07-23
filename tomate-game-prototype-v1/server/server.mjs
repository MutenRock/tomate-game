import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { networkInterfaces } from "node:os";
import { createEngine } from "./game-engine.mjs";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const publicRoot = join(projectRoot, "public");
const scenes = JSON.parse(await readFile(join(projectRoot, "content/scenes.json"), "utf8"));
const reactions = JSON.parse(await readFile(join(projectRoot, "content/reactions.json"), "utf8"));
const clients = new Map();
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "0.0.0.0";

const engine = createEngine({ scenes, reactions, onBroadcast: (room) => broadcastRoom(room.code) });
const mime = { ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".json":"application/json; charset=utf-8", ".svg":"image/svg+xml", ".png":"image/png", ".webmanifest":"application/manifest+json" };

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    if (url.pathname === "/api/health" && req.method === "GET") return json(res, 200, { ok:true, rooms:clients.size, version:"0.2.0" });
    if (url.pathname === "/api/rooms" && req.method === "POST") {
      const body = await bodyJson(req); const { room, player } = engine.createRoom(body.name);
      return json(res, 201, session(room, player));
    }
    const match = url.pathname.match(/^\/api\/rooms\/([A-Z0-9]{5})(?:\/(join|state|events|commands))?$/i);
    if (match) {
      const roomCode = match[1].toUpperCase(); const action = match[2] || "public";
      if (action === "public" && req.method === "GET") return json(res, 200, engine.publicRoomState(roomCode));
      if (action === "join" && req.method === "POST") { const body = await bodyJson(req); const { room, player } = engine.joinRoom(roomCode, body.name); return json(res, 201, session(room, player)); }
      if (action === "state" && req.method === "GET") { const { room, player } = engine.authenticate(roomCode, url.searchParams.get("playerId"), url.searchParams.get("token")); return json(res, 200, engine.personalizedState(room, player)); }
      if (action === "commands" && req.method === "POST") { const body = await bodyJson(req); return json(res, 200, engine.command(roomCode, body.playerId, body.token, body.type, body.payload)); }
      if (action === "events" && req.method === "GET") return openEvents(req, res, roomCode, url);
    }
    if (req.method === "GET") return staticFile(res, url.pathname);
    json(res, 404, { error:"Route introuvable." });
  } catch (error) {
    console.error(error.status ? error.message : error);
    json(res, error.status || 500, { error:error.status ? error.message : "Erreur interne du prototype." });
  }
});

function session(room, player) { return { roomCode:room.code, playerId:player.id, token:player.token, role:player.role, state:engine.personalizedState(room, player) }; }
function key(roomCode, playerId) { return `${roomCode}:${playerId}`; }
function openEvents(req, res, roomCode, url) {
  const playerId = url.searchParams.get("playerId"); const token = url.searchParams.get("token");
  const { room, player } = engine.authenticate(roomCode, playerId, token);
  res.writeHead(200, { "Content-Type":"text/event-stream", "Cache-Control":"no-cache, no-transform", "Connection":"keep-alive", "X-Accel-Buffering":"no" });
  res.write(`event: state\ndata: ${JSON.stringify(engine.personalizedState(room, player))}\n\n`);
  const clientKey = key(roomCode, playerId); clients.set(clientKey, { res, roomCode, playerId, token });
  const keepAlive = setInterval(() => res.write(": ping\n\n"), 15000);
  req.on("close", () => { clearInterval(keepAlive); clients.delete(clientKey); });
}
function broadcastRoom(roomCode) {
  for (const client of clients.values()) {
    if (client.roomCode !== roomCode) continue;
    try { const { room, player } = engine.authenticate(roomCode, client.playerId, client.token); client.res.write(`event: state\ndata: ${JSON.stringify(engine.personalizedState(room, player))}\n\n`); } catch { client.res.end(); }
  }
}
async function bodyJson(req) {
  let data = ""; for await (const chunk of req) { data += chunk; if (data.length > 100_000) throw Object.assign(new Error("Requête trop volumineuse."), {status:413}); }
  try { return data ? JSON.parse(data) : {}; } catch { throw Object.assign(new Error("JSON invalide."), {status:400}); }
}
function json(res, status, payload) { res.writeHead(status, {"Content-Type":"application/json; charset=utf-8", "Cache-Control":"no-store"}); res.end(JSON.stringify(payload)); }
async function staticFile(res, pathname) {
  const requested = pathname === "/" ? "/index.html" : pathname;
  const safe = normalize(decodeURIComponent(requested)).replace(/^(\.\.[/\\])+/, "");
  let file = resolve(publicRoot, `.${safe}`);
  if (!file.startsWith(publicRoot)) return json(res, 403, {error:"Accès interdit."});
  try { if ((await stat(file)).isDirectory()) file = join(file, "index.html"); const content = await readFile(file); res.writeHead(200, {"Content-Type":mime[extname(file)] || "application/octet-stream", "Cache-Control":"no-store"}); res.end(content); }
  catch { const content = await readFile(join(publicRoot, "index.html")); res.writeHead(200, {"Content-Type":mime[".html"], "Cache-Control":"no-store"}); res.end(content); }
}
function localAddresses() { const values=[]; for (const entries of Object.values(networkInterfaces())) for (const item of entries || []) if (item.family === "IPv4" && !item.internal) values.push(item.address); return [...new Set(values)]; }
server.listen(port, host, () => {
  console.log("\n🍅 TOMATE ! — PROTOTYPE MULTIJOUEUR\n");
  console.log(`Local :   http://localhost:${port}`);
  for (const address of localAddresses()) console.log(`Réseau :  http://${address}:${port}`);
  console.log("\nOuvrez l’adresse Réseau sur les téléphones connectés au même Wi-Fi.\n");
});
