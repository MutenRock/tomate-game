# Tomate !

> Un jeu multijoueur asymétrique autour d'une pièce de théâtre qui doit survivre à ses comédiens, sa régie et son public.

**Tomate !** est un jeu de théâtre chaotique jouable entre amis. Selon le mode, les joueurs deviennent comédiens, metteur en scène, régisseur, accessoiriste ou membres du public. Ils disposent de quelques secondes pour préparer une représentation, puis doivent sauver le spectacle malgré les erreurs, les contraintes et les réactions du public.

## Vision

Le jeu doit produire des histoires que les joueurs auront envie de raconter après la partie :

- une entrée déclenchée trop tôt ;
- un micro coupé pendant une confession ;
- une tomate qui masque la réplique essentielle ;
- un comédien qui improvise une explication absurde ;
- un public qui récompense finalement la catastrophe.

Le chaos n'est pas seulement aléatoire : il naît surtout des erreurs, des informations partielles et des réactions en chaîne.

## Nature du jeu

Tomate ! est principalement un jeu **multijoueur asymétrique et simultané** : chaque rôle possède une interface, des informations et des responsabilités différentes pendant la même représentation.

Des modes réellement asynchrones sont également prévus. Dans **Téléphone théâtral**, par exemple, chaque joueur poursuit une scène à partir d'un fragment de la contribution précédente avant de découvrir le montage final.

## Premier objectif

Construire un **prototype navigateur** centré sur le mode **Lecture sous pression** :

1. un joueur lit et interprète un texte ;
2. les autres joueurs incarnent le public ;
3. le public déclenche des perturbations et des encouragements ;
4. la représentation se termine par un verdict et des récompenses narratives ;
5. le rôle de comédien tourne entre les manches.

La voix peut rester sur Discord pendant les premiers tests. Le prototype ne dépend pas d'une reconnaissance vocale ou d'un service d'IA.

## Modes envisagés

- **Lecture sous pression** — un comédien, tous les autres dans le public ;
- **Seul en scène** — un joueur interprète plusieurs personnages ;
- **Duo catastrophe** — deux comédiens aux informations incomplètes ;
- **Théâtre asymétrique complet** — comédiens, régisseur, metteur en scène et accessoiriste ;
- **Improvisation publique** — le public choisit les rebondissements ;
- **Pièce tournante** — les rôles passent d'un joueur à l'autre ;
- **Mauvais régisseur** — la technique poursuit des objectifs secrets ;
- **Doublage catastrophique** — doublage sous contraintes et perturbations ;
- **Téléphone théâtral** — création asynchrone assemblée à la fin ;
- **Répetition contre public** — une équipe prépare, l'autre orchestre le chaos ;
- **Public contre IA** — personnages secondaires ou public simulés ;
- **Atelier créateur** — pièces et packs personnalisés.

## État actuel

Le dépôt contient :

- une maquette locale jouable sans dépendances ;
- quatre variantes de scène ;
- un prompteur, un minuteur et une humeur du public ;
- des tomates visuelles et plusieurs réactions ;
- une documentation de game design ;
- une architecture cible pour le multijoueur ;
- une spécification précise du premier MVP ;
- un système proposé de score et de verdict ;
- des règles d'accessibilité et d'anti-acharnement ;
- un protocole de playtest ;
- un registre des décisions produit.

Le réseau, les salons et la synchronisation multijoueur ne sont pas encore implémentés.

## Lancer la maquette

Prérequis : Node.js 20 ou plus récent.

```bash
npm run dev
```

Puis ouvrir :

```text
http://localhost:4173
```

Aucune installation de dépendances n'est nécessaire.

### Sous Windows avec Git Bash

```bash
git clone https://github.com/MutenRock/tomate-game.git
cd tomate-game
npm run dev
```

## Vérifier le dépôt

```bash
npm run check
```

Cette commande vérifie la présence des principaux fichiers et le nom du package.

## Documentation

### Game design

- [Concept général](docs/00-concept.md)
- [Modes de jeu](docs/01-game-modes.md)
- [Rôles](docs/02-roles.md)
- [Boucle de partie](docs/03-game-loop.md)
- [Public et chaos](docs/04-audience-chaos.md)
- [Format du contenu](docs/05-content-format.md)
- [Backlog d'idées](docs/08-idea-backlog.md)
- [Score et verdict](docs/12-scoring-and-verdict.md)

### Produit et production

- [Roadmap](docs/07-roadmap.md)
- [Questions ouvertes](docs/09-open-questions.md)
- [Spécification du premier MVP](docs/11-mvp-specification.md)
- [Accessibilité, confort et sécurité sociale](docs/13-accessibility-and-safety.md)
- [Plan de playtest](docs/14-playtest-plan.md)
- [Décisions produit](docs/15-product-decisions.md)

### Technique

- [Architecture technique](docs/06-technical-architecture.md)
- [Glossaire](docs/10-glossary.md)
- [Guide de contribution](CONTRIBUTING.md)

## Principes de conception

1. **Une partie doit rester compréhensible même lorsqu'elle déraille.**
2. **Le public joue réellement : il ne se contente pas de regarder.**
3. **Une erreur doit créer une nouvelle opportunité de jeu.**
4. **Chaque rôle possède des informations et des responsabilités différentes.**
5. **Le jeu doit fonctionner avec très peu de joueurs avant de viser les grandes salles.**
6. **L'IA enrichit le contenu, mais le cœur du jeu doit fonctionner sans elle.**
7. **Le verdict récompense la récupération plutôt qu'un talent théâtral supposé.**
8. **Une perturbation possède toujours une limite et un contre-jeu.**

## Architecture envisagée

- frontend TypeScript adapté à chaque rôle ;
- application web responsive et installable ;
- téléphone prioritaire pour le public ;
- serveur Node.js autoritaire ;
- communication temps réel par WebSocket ;
- journal d'événements pour la reconnexion et le verdict ;
- WebRTC et transcription seulement après validation de la boucle principale.

## Structure du dépôt

```text
.
├── .github/                 Modèles d'issues, PR et workflow de vérification
├── docs/                    Documentation de conception et technique
├── prototype/               Maquette locale sans dépendances
├── scripts/                 Vérifications du dépôt
├── CONTRIBUTING.md
├── package.json
└── README.md
```

## Statut

Préproduction / exploration du concept.

La priorité suivante est de tester la maquette avec plusieurs groupes, puis de construire le vertical slice multijoueur du mode **Lecture sous pression**.

## Licence

Aucune licence open source n'a encore été choisie. Tous droits réservés par défaut. La licence du code, des textes, des packs communautaires et des éventuels enregistrements devra être décidée avant l'ouverture large aux contributions.