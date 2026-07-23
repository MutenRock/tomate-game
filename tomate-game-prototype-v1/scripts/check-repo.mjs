import { access, readFile } from "node:fs/promises";
const requiredFiles=["README.md","package.json","server/server.mjs","server/game-engine.mjs","public/index.html","public/app.js","public/styles.css","content/scenes.json","content/reactions.json","docs/00-concept.md","docs/01-game-modes.md","docs/06-technical-architecture.md","docs/07-roadmap.md","docs/PROTOTYPE_V1.md"];
for(const file of requiredFiles) await access(file);
const pkg=JSON.parse(await readFile("package.json","utf8")); if(pkg.name!=="tomate-game") throw new Error("Le nom du package doit rester tomate-game.");
const scenes=JSON.parse(await readFile("content/scenes.json","utf8")); if(scenes.length<6) throw new Error("Le prototype doit fournir au moins six scènes.");
const reactions=JSON.parse(await readFile("content/reactions.json","utf8")); if(reactions.length<6) throw new Error("Le prototype doit fournir au moins six réactions.");
console.log(`Tomate ! check passed — ${requiredFiles.length} fichiers, ${scenes.length} scènes, ${reactions.length} réactions.`);
