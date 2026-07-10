const scenes = {
  lecture: {
    title: "Le procès de la dernière part",
    theme: "Procès médiéval absurde",
    secret: "Objectif secret : cacher que vous avez mangé la dernière part.",
    lines: [
      {
        speaker: "LE ROI — solennel, mais nerveux",
        text: "Que le coupable se dénonce avant le coucher du soleil. Le royaume ne survivra pas à une nouvelle nuit sans pizza.",
        cue: "Tonnerre après « royaume »"
      },
      {
        speaker: "LE ROI — de plus en plus suspect",
        text: "Je n'accuse personne, mais le chevalier portait hier une armure qui sentait étrangement le fromage fondu.",
        cue: "Lumière rouge sur le chevalier"
      },
      {
        speaker: "LE ROI — confession contrariée",
        text: "Je dois pourtant vous révéler que cette nuit, dans les cuisines, j'ai aperçu une silhouette couronnée.",
        cue: "Couper le micro après « cuisines »"
      }
    ]
  },
  solo: {
    title: "Trois voix pour une prophétie",
    theme: "Fantasy jouée par une seule personne",
    secret: "Objectif secret : rendre les trois personnages parfaitement reconnaissables.",
    lines: [
      {
        speaker: "L'ORACLE — très lent",
        text: "Quand la troisième cloche sonnera, le héros devra choisir entre sauver le royaume et terminer sa soupe.",
        cue: "Changer immédiatement pour le héros"
      },
      {
        speaker: "LE HÉROS — trop enthousiaste",
        text: "Je sauverai le royaume, bien sûr, mais quelqu'un pourrait-il surveiller mon bol pendant mon absence ?",
        cue: "Faire entrer le dragon"
      },
      {
        speaker: "LE DRAGON — chuchotement menaçant",
        text: "Je garderai la soupe. Je ne garantis simplement pas qu'elle soit encore là à ton retour.",
        cue: "Rire maléfique prolongé"
      }
    ]
  },
  duo: {
    title: "La réunion des fantômes",
    theme: "Comédie de copropriété surnaturelle",
    secret: "Objectif secret : convaincre l'autre comédien que vous êtes encore vivant.",
    lines: [
      {
        speaker: "MADAME BRUME — faussement polie",
        text: "Avant de parler des murs qui saignent, j'aimerais revenir sur le bruit de chaînes après vingt-deux heures.",
        cue: "Deuxième comédien entre trop tôt"
      },
      {
        speaker: "MONSIEUR SPECTRE — vexé",
        text: "Ces chaînes font partie de ma culture. En revanche, vos hurlements traversent toutes les cloisons.",
        cue: "Bruit de porte qui claque"
      },
      {
        speaker: "MADAME BRUME — paniquée",
        text: "Mes hurlements ? Mais je croyais qu'ils venaient de votre appartement depuis cent quarante ans.",
        cue: "Lumière froide générale"
      }
    ]
  },
  regie: {
    title: "La déclaration sous l'orage",
    theme: "Romance sabotée par la technique",
    secret: "Objectif secret : continuer malgré chaque erreur de régie.",
    lines: [
      {
        speaker: "CAMILLE — sincère",
        text: "Depuis notre première rencontre, chaque silence entre nous ressemble à une promesse.",
        cue: "Musique romantique, piste 2"
      },
      {
        speaker: "CAMILLE — sous un mauvais bruitage",
        text: "Je voulais simplement te dire que je n'ai jamais cessé de penser à toi.",
        cue: "Ne pas déclencher l'explosion"
      },
      {
        speaker: "CAMILLE — après la catastrophe",
        text: "Et si le plafond vient réellement de tomber, prenons cela comme un signe pour partir ensemble.",
        cue: "Rideau lent"
      }
    ]
  }
};

const state = {
  mode: "lecture",
  lineIndex: 0,
  tomatoes: 5,
  seconds: 90,
  mood: 0,
  timer: null
};

const elements = {
  modeGrid: document.querySelector("#modeGrid"),
  playTitle: document.querySelector("#playTitle"),
  themeText: document.querySelector("#themeText"),
  speaker: document.querySelector("#speaker"),
  scriptLine: document.querySelector("#scriptLine"),
  secretGoal: document.querySelector("#secretGoal"),
  cueText: document.querySelector("#cueText"),
  tomatoLayer: document.querySelector("#tomatoLayer"),
  nextLine: document.querySelector("#nextLine"),
  cleanScreen: document.querySelector("#cleanScreen"),
  restartScene: document.querySelector("#restartScene"),
  tomatoCount: document.querySelector("#tomatoCount"),
  timer: document.querySelector("#timer"),
  moodValue: document.querySelector("#moodValue"),
  eventLog: document.querySelector("#eventLog"),
  toast: document.querySelector("#toast"),
  reactions: [...document.querySelectorAll(".reaction")]
};

function renderScene() {
  const scene = scenes[state.mode];
  const line = scene.lines[state.lineIndex];

  elements.playTitle.textContent = scene.title;
  elements.themeText.textContent = scene.theme;
  elements.secretGoal.textContent = scene.secret;
  elements.speaker.textContent = line.speaker;
  elements.scriptLine.textContent = line.text;
  elements.cueText.textContent = line.cue;
  elements.tomatoCount.textContent = String(state.tomatoes);
  elements.timer.textContent = formatTime(state.seconds);
  elements.moodValue.textContent = moodLabel(state.mood);

  for (const button of elements.reactions) {
    const cost = Number(button.dataset.cost);
    button.disabled = state.tomatoes < cost;
  }
}

function selectMode(mode) {
  state.mode = mode;
  state.lineIndex = 0;
  state.seconds = 90;
  state.mood = 0;
  state.tomatoes = 5;
  elements.tomatoLayer.replaceChildren();

  for (const card of document.querySelectorAll(".mode-card")) {
    card.classList.toggle("is-selected", card.dataset.mode === mode);
  }

  logEvent(`Mode sélectionné : ${scenes[mode].title}.`);
  renderScene();
}

function nextLine() {
  const scene = scenes[state.mode];
  state.lineIndex = (state.lineIndex + 1) % scene.lines.length;
  state.tomatoes = Math.min(7, state.tomatoes + 1);
  state.mood += 1;
  logEvent("Le comédien termine une réplique et regagne une tomate de public.");
  renderScene();
}

function playReaction(action, cost) {
  if (state.tomatoes < cost) {
    showToast("Le public n'a plus assez de tomates.");
    return;
  }

  state.tomatoes -= cost;

  switch (action) {
    case "tomato":
      addSplat();
      state.mood -= 1;
      logEvent("Une tomate masque une partie du prompteur.");
      showToast("SPLAT ! Le spectacle continue.");
      break;

    case "emotion":
      elements.speaker.textContent += " · BEAUCOUP TROP DRAMATIQUE";
      state.mood += 1;
      logEvent("Le public impose une interprétation beaucoup trop dramatique.");
      showToast("Nouvelle intention : tragédie absolue.");
      break;

    case "noise":
      state.mood += 1;
      logEvent("Un téléphone sonne dans la salle. Le comédien doit l'intégrer.");
      showToast("DRING DRING — quelqu'un répond ?");
      break;

    case "applause":
      state.seconds = Math.min(120, state.seconds + 12);
      state.mood += 2;
      cleanOneSplat();
      logEvent("Les applaudissements rendent douze secondes et nettoient une tache.");
      showToast("Le public est conquis.");
      break;
  }

  renderScene();
}

function addSplat() {
  const splat = document.createElement("span");
  splat.className = "splat";
  splat.style.left = `${18 + Math.random() * 64}%`;
  splat.style.top = `${18 + Math.random() * 64}%`;
  splat.style.setProperty("--rotation", `${Math.floor(Math.random() * 120 - 60)}deg`);
  elements.tomatoLayer.append(splat);
}

function cleanOneSplat() {
  elements.tomatoLayer.lastElementChild?.remove();
}

function cleanScreen() {
  if (!elements.tomatoLayer.childElementCount) {
    showToast("L'écran est déjà propre.");
    return;
  }

  cleanOneSplat();
  state.seconds = Math.max(0, state.seconds - 4);
  logEvent("Le comédien perd quatre secondes pour essuyer l'écran.");
  renderScene();
}

function restartScene() {
  state.lineIndex = 0;
  state.seconds = 90;
  state.tomatoes = 5;
  state.mood = 0;
  elements.tomatoLayer.replaceChildren();
  logEvent("La représentation recommence depuis le début.");
  renderScene();
}

function logEvent(message) {
  const item = document.createElement("li");
  item.textContent = message;
  elements.eventLog.prepend(item);

  while (elements.eventLog.children.length > 8) {
    elements.eventLog.lastElementChild.remove();
  }
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => {
    elements.toast.classList.remove("is-visible");
  }, 1800);
}

function moodLabel(value) {
  if (value >= 5) return "Conquis";
  if (value >= 2) return "Amusé";
  if (value <= -3) return "Hostile";
  if (value < 0) return "Moqueur";
  return "Curieux";
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

function startTimer() {
  clearInterval(state.timer);
  state.timer = setInterval(() => {
    if (state.seconds <= 0) {
      clearInterval(state.timer);
      showToast("Rideau ! Place au verdict.");
      logEvent("La représentation se termine.");
      return;
    }

    state.seconds -= 1;
    elements.timer.textContent = formatTime(state.seconds);
  }, 1000);
}

elements.modeGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".mode-card");
  if (card) selectMode(card.dataset.mode);
});

elements.nextLine.addEventListener("click", nextLine);
elements.cleanScreen.addEventListener("click", cleanScreen);
elements.restartScene.addEventListener("click", restartScene);

for (const reaction of elements.reactions) {
  reaction.addEventListener("click", () => {
    playReaction(reaction.dataset.action, Number(reaction.dataset.cost));
  });
}

renderScene();
startTimer();
