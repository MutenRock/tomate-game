import { access, readFile } from "node:fs/promises";

const requiredFiles = [
  "README.md",
  "docs/00-concept.md",
  "docs/01-game-modes.md",
  "docs/06-technical-architecture.md",
  "docs/07-roadmap.md",
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

console.log(`Repository check passed: ${requiredFiles.length} required files found.`);
