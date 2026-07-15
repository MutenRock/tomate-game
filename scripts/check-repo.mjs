import { access, readFile } from "node:fs/promises";

const sceneFiles = [
  "content/scenes-v3/pizza-trial-v3.json",
  "content/scenes-v3/orbital-laundry-v3.json",
  "content/scenes-v3/ghost-condo-v3.json",
  "content/scenes-v3/vampire-interview-v3.json",
  "content/scenes-v3/last-dinner-v3.json",
  "content/scenes-v3/robot-romance-v3.json"
];

const requiredFiles = [
  "README.md",
  "CONTRIBUTING.md",
  "package.json",
  "content/scenes.json",
  "content/reactions.json",
  ...sceneFiles,
  "public/index.html",
  "public/app.js",
  "public/styles.css",
  "public/manifest.webmanifest",
  "server/server.mjs",
  "server/game-engine.mjs",
  "scripts/smoke-test.mjs",
  "docs/PROTOTYPE_V1.md",
  "docs/PROTOTYPE_V3.md",
  "docs/00-concept.md",
  "docs/01-game-modes.md",
  "docs/02-roles.md",
  "docs/03-game-loop.md",
  "docs/04-audience-chaos.md",
  "docs/05-content-format.md",
  "docs/06-technical-architecture.md",
  "docs/07-roadmap.md",
  "docs/08-idea-backlog.md",
  "docs/09-open-questions.md",
  "docs/10-glossary.md",
  "docs/11-mvp-specification.md",
  "docs/12-scoring-and-verdict.md",
  "docs/13-accessibility-and-safety.md",
  "docs/14-playtest-plan.md",
  "docs/15-product-decisions.md"
];

for (const file of requiredFiles) await access(file);

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
const scenes = await Promise.all(sceneFiles.map(async (file) => JSON.parse(await readFile(file, "utf8"))));
const reactions = JSON.parse(await readFile("content/reactions.json", "utf8"));
const readme = await readFile("README.md", "utf8");
const decisions = await readFile("docs/15-product-decisions.md", "utf8");
const totalLines = scenes.reduce((sum, scene) => sum + scene.lines.length, 0);

if (packageJson.name !== "tomate-game") throw new Error("Le nom du package doit rester tomate-game.");
if (packageJson.version !== "0.3.0") throw new Error("La version attendue est 0.3.0.");
if (!readme.includes("# Tomate !")) throw new Error("Le README doit présenter Tomate !.");
if (!readme.includes("Prototype multijoueur v0.3")) throw new Error("Le README doit présenter le prototype v0.3.");
if (!decisions.includes("D001 — Nom du projet")) throw new Error("Le registre des décisions produit doit contenir D001.");
if (scenes.length < 6) throw new Error("Le prototype doit contenir au moins six histoires longues.");
if (totalLines < 90) throw new Error("Le prototype v0.3 doit contenir au moins quatre-vingt-dix répliques.");
if (scenes.some((scene) => scene.cast.length !== 2)) throw new Error("Chaque histoire v0.3 doit comporter exactement deux personnages.");
if (reactions.length < 6) throw new Error("Le prototype doit contenir au moins six réactions.");

console.log(`Tomate ! check passed — ${requiredFiles.length} fichiers, ${scenes.length} histoires, ${totalLines} répliques, ${reactions.length} réactions.`);
