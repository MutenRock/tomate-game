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

## Premier objectif

Construire un **prototype navigateur** centré sur le mode **Lecture sous pression** :

1. un joueur lit et interprète un texte ;
2. les autres joueurs incarnent le public ;
3. le public déclenche des perturbations et des encouragements ;
4. la représentation se termine par un verdict et des récompenses narratives.

Le prototype inclus dans ce dépôt est une maquette locale non connectée. Il permet déjà de tester le rythme, les réactions du public et la lisibilité du concept.

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

## Documentation

- [Concept général](docs/00-concept.md)
- [Modes de jeu](docs/01-game-modes.md)
- [Rôles](docs/02-roles.md)
- [Boucle de partie](docs/03-game-loop.md)
- [Public et chaos](docs/04-audience-chaos.md)
- [Format du contenu](docs/05-content-format.md)
- [Architecture technique](docs/06-technical-architecture.md)
- [Roadmap](docs/07-roadmap.md)
- [Backlog d'idées](docs/08-idea-backlog.md)
- [Questions ouvertes](docs/09-open-questions.md)
- [Glossaire](docs/10-glossary.md)

## Principes de conception

1. **Une partie doit rester compréhensible même lorsqu'elle déraille.**
2. **Le public joue réellement : il ne se contente pas de regarder.**
3. **Une erreur doit créer une nouvelle opportunité de jeu.**
4. **Chaque rôle possède des informations et des responsabilités différentes.**
5. **Le jeu doit fonctionner avec très peu de joueurs avant de viser les grandes salles.**
6. **L'IA enrichit le contenu, mais le cœur du jeu doit fonctionner sans elle.**

## Structure du dépôt

```text
.
├── .github/                 Modèles d'issues et de pull requests
├── docs/                    Documentation de conception et technique
├── prototype/               Maquette locale sans dépendances
├── scripts/                 Vérifications du dépôt
├── package.json
└── README.md
```

## Statut

Préproduction / exploration du concept.

Aucune licence open source n'a encore été choisie. Tous droits réservés par défaut.
