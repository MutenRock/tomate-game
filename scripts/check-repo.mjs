import { access, readFile } from "node:fs/promises";

const requiredFiles = [
  "README.md",
  "CONTRIBUTING.md",
  "package.json",
  "content/scenes.json",
  "content/reactions.json",
  "public/index.html",
  "public/app.js",
  "public/styles.css",
  "server/server.mjs",
  "server/game-engine.mjs",
  "scripts/smoke-test.mjs",
  "docs/PROTOTYPE_V1.md",
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
const scenes = JSON.parse(await readFile("content/scenes.json", "utf8"));
const reactions = JSON.parse(await readFile("content/reactions.json", "utf8"));
const readme = await readFile("README.md", "utf8");
const decisions = await readFile("docs/15-product-decisions.md", "utf8");

if (packageJson.name !== "tomate-game") throw new Error("Le nom du package doit rester tomate-game.");
if (packageJson.version !== "0.2.0") throw new Error("La version attendue est 0.2.0.");
if (!readme.includes("# Tomate !")) throw new Error("Le README doit présenter Tomate !.");
if (!decisions.includes("D001 — Nom du projet")) throw new Error("Le registre des décisions produit doit contenir D001.");
if (scenes.length < 6) throw new Error("Le prototype doit contenir au moins six scènes.");
if (reactions.length < 6) throw new Error("Le prototype doit contenir au moins six réactions.");

console.log(`Tomate ! check passed — ${requiredFiles.length} fichiers, ${scenes.length} scènes, ${reactions.length} réactions.`);
