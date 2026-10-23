// Lance Tomate ! + un tunnel Cloudflare temporaire, puis affiche le lien à envoyer aux amis.
// Usage : npm run remote   (options : --no-open pour ne pas ouvrir le navigateur)
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const port = process.env.PORT || "4173";
const isWin = process.platform === "win32";
const noOpen = process.argv.includes("--no-open");
const children = [];

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

main().catch((error) => { console.error(`\n✗ ${error.message}`); shutdown(1); });

async function main() {
  console.log("\n🍅 TOMATE ! — partie à distance\n");
  const url = await startTunnel();
  console.log(`✓ Tunnel ouvert : ${url}`);

  const server = spawn(process.execPath, ["server/server.mjs"], { cwd: root, env: { ...process.env, PORT: port, PUBLIC_URL: url }, stdio: "inherit" });
  children.push(server);
  server.on("exit", (code) => { if (code) { console.error("\n✗ Le serveur s'est arrêté."); shutdown(code); } });

  await waitFor(`http://127.0.0.1:${port}/api/health`, 15, "le serveur local");
  console.log("✓ Serveur local prêt");
  const reachable = await waitFor(`${url}/api/health`, 30, "le tunnel", true);
  console.log(reachable ? "✓ Lien public joignable depuis Internet" : "⚠ Le lien public ne répond pas encore (la propagation DNS peut prendre une minute) — réessayez dans un instant.");

  copyToClipboard(url);
  console.log(`
────────────────────────────────────────────
  Lien à envoyer à vos amis :

     ${url}

  (copié dans le presse-papiers)
  1. Ouvrez ce lien vous-même et cliquez « Ouvrir le rideau ».
  2. Cliquez « Copier le lien » dans le salon, ou donnez le code à 5 caractères.
  3. Ctrl+C dans cette fenêtre pour tout arrêter.
  Le lien change à chaque lancement ; les salles disparaissent à l'arrêt.
────────────────────────────────────────────
`);
  if (!noOpen) openBrowser(url);
}

async function startTunnel() {
  const target = `http://localhost:${port}`;
  const useBinary = spawnSync(isWin ? "where" : "which", ["cloudflared"], { stdio: "ignore" }).status === 0;
  const [cmd, args, shell] = useBinary
    ? ["cloudflared", ["tunnel", "--no-autoupdate", "--url", target], false]
    : ["npx", ["--yes", "cloudflared", "tunnel", "--no-autoupdate", "--url", target], isWin];
  console.log(useBinary ? "Tunnel : cloudflared détecté." : "Tunnel : cloudflared absent, téléchargement via npx (première fois : ~30 s)…");
  const child = spawn(cmd, args, { shell, stdio: ["ignore", "pipe", "pipe"], cwd: root });
  children.push(child);
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Aucune URL de tunnel après 90 s. Installez cloudflared (winget install Cloudflare.cloudflared) puis relancez.")), 90_000);
    const scan = (chunk) => {
      const found = String(chunk).match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/i);
      if (found) { clearTimeout(timer); resolve(found[0]); }
    };
    child.stdout.on("data", scan);
    child.stderr.on("data", scan);
    child.on("error", (error) => { clearTimeout(timer); reject(new Error(`Impossible de lancer le tunnel : ${error.message}`)); });
    child.on("exit", (code) => { clearTimeout(timer); reject(new Error(`Le tunnel s'est arrêté (code ${code}). Installez cloudflared : winget install Cloudflare.cloudflared`)); });
  });
}

async function waitFor(url, attempts, label, soft = false) {
  for (let index = 0; index < attempts; index += 1) {
    try { if ((await fetch(url)).ok) return true; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  if (soft) return false;
  throw new Error(`Impossible de joindre ${label} (${url}).`);
}

function copyToClipboard(text) {
  const [cmd, args] = isWin ? ["clip", []] : process.platform === "darwin" ? ["pbcopy", []] : ["xclip", ["-selection", "clipboard"]];
  try { const proc = spawn(cmd, args, { stdio: ["pipe", "ignore", "ignore"], shell: isWin }); proc.on("error", () => {}); proc.stdin.on("error", () => {}); proc.stdin.end(text); } catch {}
}
function openBrowser(url) {
  try {
    const [cmd, args] = isWin ? ["cmd", ["/c", "start", "", url]] : process.platform === "darwin" ? ["open", [url]] : ["xdg-open", [url]];
    spawn(cmd, args, { stdio: "ignore", detached: true }).on("error", () => {}).unref();
  } catch {}
}

function shutdown(code) {
  for (const child of children) {
    try {
      if (isWin && child.pid) spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
      else child.kill("SIGTERM");
    } catch {}
  }
  process.exit(code);
}
