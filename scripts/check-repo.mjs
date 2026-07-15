import { access, readFile, readdir } from "node:fs/promises";
import vm from "node:vm";

const sceneRoot = "content/scenes-v3";
const sceneFiles = (await readdir(sceneRoot)).filter((file) => file.endsWith(".json"));
const studyRoot = "research/player-study-v2";
const studyScripts = [
  `${studyRoot}/google-forms/Code.gs`,
  `${studyRoot}/google-forms/Bootstrap.gs`,
  `${studyRoot}/google-forms/Questions_01_25.gs`,
  `${studyRoot}/google-forms/Questions_26_51.gs`
];
const required = [
  "README.md",
  "package.json",
  "content/reactions.json",
  "public/index.html",
  "public/app.js",
  "public/styles.css",
  "server/server.mjs",
  "server/game-engine.mjs",
  "scripts/smoke-test.mjs",
  "docs/PROTOTYPE_V031.md",
  `${studyRoot}/README.md`,
  `${studyRoot}/questionnaire.md`,
  `${studyRoot}/analysis-guide.md`,
  ...studyScripts,
  ...sceneFiles.map((file) => `${sceneRoot}/${file}`)
];

for (const file of required) await access(file);

const pkg = JSON.parse(await readFile("package.json", "utf8"));
const scenes = await Promise.all(sceneFiles.map(async (file) => JSON.parse(await readFile(`${sceneRoot}/${file}`, "utf8"))));
const reactions = JSON.parse(await readFile("content/reactions.json", "utf8"));

if (pkg.name !== "tomate-game" || pkg.version !== "0.3.1") {
  throw new Error("Version attendue : tomate-game 0.3.1.");
}
if (!scenes.some((scene) => scene.tutorial)) throw new Error("Une scène tutoriel est obligatoire.");
if (scenes.some((scene) => scene.cast?.length !== 2 || !Array.isArray(scene.lines) || scene.lines.length < 7)) {
  throw new Error("Chaque histoire doit avoir deux personnages et au moins sept répliques.");
}
if (reactions.length < 6) throw new Error("Six réactions minimum.");

const studySource = (await Promise.all(studyScripts.map((file) => readFile(file, "utf8")))).join("\n\n");
const studyContext = { Logger: { log() {} } };
vm.runInNewContext(
  `${studySource}\nconst __studyResult = validateQuestionnaireDefinition(); globalThis.__studyResult = __studyResult;`,
  studyContext,
  { filename: "player-study-v2.gs" }
);

if (studyContext.__studyResult.questionCount !== 51 || studyContext.__studyResult.sectionCount !== 11) {
  throw new Error("L’étude joueurs doit contenir exactement 51 questions dans 11 sections.");
}

console.log(
  `Tomate ! v0.3.1 check passed — ${scenes.length} histoires, ` +
  `${scenes.reduce((sum, scene) => sum + scene.lines.length, 0)} répliques, ` +
  `${studyContext.__studyResult.questionCount} questions d’étude.`
);
