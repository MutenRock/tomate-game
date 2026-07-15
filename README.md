# Tomate !

> Un jeu multijoueur asymétrique autour d'une représentation qui doit survivre à son comédien, à sa régie et à son public.

**Tomate !** est un jeu de performance chaotique jouable entre amis. Selon le mode, les joueurs deviennent comédiens, metteur en scène, régisseur, accessoiriste ou membres du public. Ils disposent de quelques secondes pour se préparer, puis doivent sauver le spectacle malgré les erreurs, les contraintes et les réactions de la salle.

## Prototype multijoueur v0.2

Le dépôt contient désormais un premier prototype jouable du mode **Lecture sous pression** :

- un comédien et jusqu'à onze membres du public ;
- création et connexion à une salle avec un code court ;
- écrans différents pour le comédien et le public ;
- six scènes et six réactions ;
- briefing, préparation, représentation, finale et verdict ;
- synchronisation en temps réel par Server-Sent Events ;
- énergie individuelle, temps de recharge et budget de gêne ;
- score de continuité, récupération, participation du public et finale ;
- interface responsive pour ordinateur et téléphone ;
- aucune dépendance NPM.

La voix reste volontairement sur Discord ou dans la même pièce. Aucune voix n'est enregistrée.

## Lancer le prototype

Prérequis : **Node.js 20 ou plus récent**.

### Windows

Double-cliquer sur :

```text
start_windows.bat
```

Le terminal affiche :

- une adresse **Local** pour le PC du comédien ;
- une ou plusieurs adresses **Réseau** pour les téléphones connectés au même Wi-Fi.

Le pare-feu Windows peut demander d'autoriser Node.js sur les réseaux privés lors du premier lancement.

### Terminal

```bash
npm run dev
```

Adresse locale par défaut :

```text
http://localhost:4173
```

### Tester seul

Ouvrir deux onglets :

1. créer une salle dans le premier ;
2. rejoindre la salle comme public dans le second.

Chaque onglet conserve une session distincte.

## Vérifications

```bash
npm run check
npm run smoke
```

Le smoke test vérifie la création d'une salle, l'arrivée du public, les phases, une tomate, une récupération, la progression du texte et le verdict.

## Nature du jeu

Tomate ! est principalement un jeu **multijoueur asymétrique et simultané** : chaque rôle possède une interface, des informations et des responsabilités différentes pendant la même représentation.

Des modes réellement asynchrones sont aussi envisagés, notamment **Téléphone théâtral**, dans lequel chaque joueur poursuit une scène à partir d'un fragment de la contribution précédente.

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
- **Répétition contre public** — une équipe prépare, l'autre orchestre le chaos ;
- **Public contre IA** — personnages secondaires ou public simulés ;
- **Atelier créateur** — pièces et packs personnalisés.

## Documentation

### Prototype

- [Prototype multijoueur V1](docs/PROTOTYPE_V1.md)
- [Installation rapide](INSTALLATION_RAPIDE.txt)
- [Changelog](CHANGELOG.md)

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

## Structure

```text
content/             Scènes et réactions en JSON
public/              Interface navigateur multijoueur
server/              Serveur HTTP/SSE et moteur de partie
prototype/           Première maquette locale conservée comme référence
scripts/             Vérifications et smoke test
docs/                Game design et documentation produit
```

## Limites actuelles

- salles conservées uniquement en mémoire ;
- un seul comédien à la fois ;
- pas de compte ni de sauvegarde persistante ;
- pas d'audio intégré, de reconnaissance vocale ou d'IA générative ;
- pas de matchmaking ni d'exposition Internet automatique ;
- rotation du comédien encore manuelle.

## Principes de conception

1. Une partie reste compréhensible même lorsqu'elle déraille.
2. Le public joue réellement : il ne se contente pas de regarder.
3. Une erreur crée une nouvelle opportunité de jeu.
4. Chaque rôle possède des informations et responsabilités différentes.
5. Le verdict récompense la récupération plutôt qu'un talent théâtral supposé.
6. Une perturbation possède toujours une limite et un contre-jeu.
7. L'IA peut enrichir le contenu, mais le cœur du jeu fonctionne sans elle.

## Licence

Aucune licence open source n'a encore été choisie. Tous droits réservés par défaut.
