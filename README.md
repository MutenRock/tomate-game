# Tomate !

> Un jeu multijoueur asymétrique autour d'une représentation qui doit survivre à ses comédiens, à sa régie et à son public.

**Tomate !** est un jeu de performance chaotique jouable entre amis. Un ou deux comédiens tentent de maintenir une histoire compréhensible pendant que le public les encourage, leur impose des contraintes et lance des perturbations limitées.

## Prototype playtest v0.3.1

La v0.3.1 est conçue pour être confiée à un groupe qui ne connaît pas encore le projet :

- mode **solo**, avec un comédien interprétant les deux personnages ;
- mode **duo**, avec un rôle et un objectif secret différents pour chaque comédien ;
- six histoires longues de six à huit minutes ;
- une scène tutoriel guidée de deux à trois minutes ;
- indication synchronisée du tour de parole ;
- séparation visuelle entre didascalie, intention, texte à lire et action suivante ;
- état **prêt** obligatoire avant le lancement ;
- affichage des joueurs connectés et déconnectés ;
- pause automatique si un comédien perd sa connexion ;
- code de reprise pour récupérer sa place sur un autre appareil ;
- remplacement d'un comédien absent par un membre du public ;
- réactions indiquant leur expéditeur, leur cible et leur durée ;
- questionnaire rapide directement après le verdict ;
- rapport JSON anonymisé exportable par l'hôte ;
- aucune dépendance NPM.

La voix reste volontairement sur Discord ou dans la même pièce. **Aucun audio n'est enregistré.**

## Parcours conseillé pour un premier test

1. L'hôte crée une salle en choisissant un ou deux comédiens.
2. Les autres joueurs rejoignent avec le code de salle.
3. L'hôte sélectionne **Répétition générale : la couronne disparue**.
4. Chaque participant confirme qu'il est prêt.
5. Le groupe joue le tutoriel jusqu'au verdict.
6. Chaque joueur remplit le questionnaire intégré.
7. L'hôte exporte le rapport JSON.
8. Le groupe lance ensuite une histoire longue.

## Comprendre l'écran comédien

Pendant une réplique, l'interface sépare cinq informations :

1. **Ne pas lire — Didascalie** : le mouvement ou l'action à jouer ;
2. **Intention de jeu** : l'émotion et le rythme recommandés ;
3. **Texte à dire à voix haute** : la seule zone à lire ;
4. **Après la réplique** : ce qu'il faut faire avant de passer la parole ;
5. **Repère de scène** : une indication de rythme ou une fenêtre pour le public.

En duo, une bannière affiche clairement **À toi — lis maintenant** ou **Attends — l'autre comédien parle**. Le serveur refuse qu'un joueur valide la réplique de l'autre.

## Reprendre une place

Chaque joueur reçoit un code de reprise à six caractères dans le salon. Pour récupérer une place après une perte de session ou un changement d'appareil, renseigner :

- le code de salle ;
- le pseudo exact ;
- le code de reprise.

Une déconnexion de comédien met les phases chronométrées en pause. La partie reprend automatiquement après sa reconnexion, ou lorsque l'hôte le remplace.

## Rapport de playtest

Après le verdict, l'hôte peut exporter un rapport contenant :

- l'histoire et le format solo ou duo ;
- le nombre de participants ;
- la durée de la partie ;
- les répliques terminées ;
- les réactions jouées ;
- les récupérations et passages forcés ;
- les déconnexions ;
- le score final ;
- les moyennes du questionnaire ;
- les moments mémorables volontairement renseignés.

Les pseudos ne sont pas inclus dans ce rapport.

## Lancer le prototype

Prérequis : **Node.js 20 ou plus récent**.

### Windows

Double-cliquer sur :

```text
start_windows.bat
```

### Terminal

```bash
npm run dev
```

Adresse locale par défaut :

```text
http://localhost:4173
```

Le terminal affiche également une adresse **Réseau** à ouvrir sur les appareils connectés au même Wi-Fi.

## Vérifications

```bash
npm run check
npm run smoke
```

Le smoke test vérifie notamment :

- le blocage tant que les joueurs ne sont pas prêts ;
- une partie duo ;
- la pause lors de la déconnexion d'un comédien ;
- la reprise de sa place ;
- le questionnaire final ;
- l'absence de pseudos dans le rapport exporté.

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

- [Prototype playtest V0.3.1](docs/PROTOTYPE_V031.md)
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
└── scenes-v3/               Tutoriel et histoires longues
public/                       Interface navigateur multijoueur
server/                       Serveur HTTP/SSE et moteur de partie
prototype/                    Première maquette locale conservée
scripts/                      Vérifications et smoke test
docs/                         Game design et documentation produit
```

## Limites actuelles

- salles conservées uniquement en mémoire ;
- maximum de deux comédiens simultanés ;
- pas de compte ni de sauvegarde persistante ;
- pas d'audio intégré, de reconnaissance vocale ou d'IA générative ;
- pas de matchmaking ni d'exposition Internet automatique ;
- le public cible automatiquement le personnage actif ;
- le remplacement d'un comédien reste une action manuelle de l'hôte.

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
