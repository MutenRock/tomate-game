import { access, readFile } from "node:fs/promises";

const requiredFiles = [
  "README.md",
  "CONTRIBUTING.md",
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
  "docs/15-product-decisions.md",
  "prototype/index.html",
  "prototype/app.js",
  "prototype/style.css"
];

for (const file of requiredFiles) {
  await access(file);
}

const packageJson = JSON.parse(await readFile("package.json", "utf8"));

if (packageJson.name !== "tomate-game") {
  throw new Error("Le nom du package doit rester tomate-game.");
}

const readme = await readFile("README.md", "utf8");

if (!readme.includes("# Tomate !")) {
  throw new Error("Le README doit présenter Tomate !.");
}

const decisions = await readFile("docs/15-product-decisions.md", "utf8");

if (!decisions.includes("D001 — Nom du projet")) {
  throw new Error("Le registre des décisions produit doit contenir D001.");
}

console.log(`Repository check passed: ${requiredFiles.length} required files found.`);