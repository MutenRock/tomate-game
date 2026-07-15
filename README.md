# Tomate !

> Un jeu multijoueur asymétrique autour d'une représentation qui doit survivre à ses comédiens, à sa régie et à son public.

**Tomate !** est un jeu de performance chaotique jouable entre amis. Selon le mode, les joueurs deviennent comédiens, metteur en scène, régisseur, accessoiriste ou membres du public. Ils disposent de quelques secondes pour se préparer, puis doivent sauver le spectacle malgré les erreurs, les contraintes et les réactions de la salle.

## Prototype multijoueur v0.3

La v0.3 transforme la première démonstration en véritable prototype de lecture théâtrale :

- mode **solo**, avec un comédien interprétant les deux personnages ;
- mode **duo**, avec un rôle et un objectif secret différents pour chaque comédien ;
- jusqu'à dix autres joueurs dans le public ;
- six histoires longues, structurées en quatre actes ;
- **96 répliques** au total et une durée cible de six à huit minutes par histoire ;
- indication synchronisée du tour de parole ;
- séparation visuelle entre la didascalie, l'intention, le texte à lire et l'action suivante ;
- aperçu de la réplique précédente et de la prochaine intervention ;
- création et connexion à une salle avec un code court ;
- réactions du public, énergie, temps de recharge et budget de gêne ;
- briefing, préparation, représentation, finale et verdict ;
- score de continuité, récupération, participation du public, conclusion et équilibre du duo ;
- interface responsive pour ordinateur et téléphone ;
- aucune dépendance NPM.

La voix reste volontairement sur Discord ou dans la même pièce. Aucune voix n'est enregistrée.

## Comprendre l'écran comédien

Pendant une réplique, l'interface sépare cinq informations :

1. **Ne pas lire — Didascalie** : le mouvement ou l'action à jouer ;
2. **Intention de jeu** : l'émotion et le rythme recommandés ;
3. **Texte à dire à voix haute** : la seule zone à lire ;
4. **Après la réplique** : ce qu'il faut faire avant de passer la parole ;
5. **Repère de scène** : une indication de rythme ou une fenêtre pour le public.

En duo, une bannière affiche clairement **À toi — lis maintenant** ou **Attends — l'autre comédien parle**. Le serveur refuse qu'un joueur valide la réplique de l'autre.

## Lancer le prototype

Prérequis : **Node.js 20 ou plus récent**.

### Windows

Double-cliquer sur :

```text
start_windows.bat
```

Le terminal affiche :

- une adresse **Local** pour le PC de l'hôte ;
- une ou plusieurs adresses **Réseau** pour les autres joueurs connectés au même Wi-Fi.

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

Pour le mode solo, ouvrir deux onglets :

1. créer une salle avec **1 comédien** dans le premier ;
2. rejoindre la salle comme public dans le second.

Pour simuler un duo, ouvrir trois onglets :

1. créer une salle avec **2 comédiens** ;
2. rejoindre comme **Comédien 2** ;
3. rejoindre comme public.

Chaque onglet conserve une session distincte.

## Vérifications

```bash
npm run check
npm run smoke
```

Le check valide les six histoires, les deux personnages par histoire et un minimum de quatre-vingt-dix répliques. Le smoke test joue automatiquement une partie solo puis une partie duo complète.

## Nature du jeu

Tomate ! est principalement un jeu **multijoueur asymétrique et simultané** : chaque rôle possède une interface, des informations et des responsabilités différentes pendant la même représentation.

Des modes réellement asynchrones sont aussi envisagés, notamment **Téléphone théâtral**, dans lequel chaque joueur poursuit une scène à partir d'un fragment de la contribution précédente.

## Modes envisagés

- **Lecture sous pression** — un comédien, tous les autres dans le public ;
- **Duo catastrophe** — deux comédiens aux informations incomplètes ;
- **Seul en scène** — un joueur interprète plusieurs personnages ;
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

- [Prototype multijoueur V0.3](docs/PROTOTYPE_V3.md)
- [Prototype multijoueur V0.2](docs/PROTOTYPE_V1.md)
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
content/
├── reactions.json           Réactions du public
├── scenes.json              Anciennes scènes v0.2 conservées
└── scenes-v3/               Six histoires longues v0.3
public/                       Interface navigateur multijoueur
server/                       Serveur HTTP/SSE et moteur de partie
prototype/                    Première maquette locale conservée comme référence
scripts/                      Vérifications et smoke test
docs/                         Game design et documentation produit
```

## Limites actuelles

- salles conservées uniquement en mémoire ;
- maximum de deux comédiens simultanés ;
- pas de remplacement automatique d'un comédien pendant une représentation ;
- pas de compte ni de sauvegarde persistante ;
- pas d'audio intégré, de reconnaissance vocale ou d'IA générative ;
- pas de matchmaking ni d'exposition Internet automatique ;
- le public cible automatiquement le personnage actuellement actif.

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
