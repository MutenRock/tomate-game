# Tomate !

> Un jeu multijoueur asymétrique où une représentation doit survivre à son comédien et à son public.

Ce dépôt contient le **premier prototype multijoueur local** de Tomate !. Un joueur incarne le comédien sur ordinateur et les autres rejoignent le public depuis leur téléphone. Le public peut gêner, encourager et imposer des contraintes pendant que le comédien tente de terminer la scène.

## Ce qui est jouable

- 1 comédien et jusqu’à 11 spectateurs ;
- connexion par code de salle ;
- six scènes ;
- briefing, préparation, représentation, finale et verdict ;
- six réactions du public ;
- budget de gêne, énergie et temps de recharge ;
- score de récupération et de continuité ;
- interface responsive ;
- aucune dépendance NPM.

## Lancer sous Windows

1. Installer Node.js 20 ou plus récent.
2. Double-cliquer sur `start_windows.bat`.
3. Ouvrir l’adresse `Local` sur le PC du comédien.
4. Ouvrir l’adresse `Réseau` sur les téléphones connectés au même Wi-Fi.

Le pare-feu Windows peut demander l’autorisation d’accès au réseau privé lors du premier lancement.

## Lancer en terminal

```bash
npm run dev
```

Adresse locale par défaut :

```text
http://localhost:4173
```

## Jouer

1. Le comédien clique sur **Créer une salle**.
2. Il partage le code ou le lien d’invitation.
3. Le public rejoint la salle depuis un autre appareil ou un autre onglet.
4. Le comédien choisit une scène et lance la représentation.
5. Utilisez Discord si les joueurs ne sont pas dans la même pièce.

Chaque onglet possède sa propre session : il est donc possible de tester seul avec deux onglets du même navigateur.

## Vérification

```bash
npm run check
npm run smoke
```

## Structure

```text
content/             Scènes et réactions en JSON
public/              Interface navigateur
server/              Serveur HTTP, SSE et moteur de partie
docs/                Game design et documentation du prototype
prototype-legacy/    Première maquette locale conservée comme référence
scripts/              Vérifications du dépôt
```

## Documentation

- [Prototype multijoueur V1](docs/PROTOTYPE_V1.md)
- [Concept général](docs/00-concept.md)
- [Modes de jeu](docs/01-game-modes.md)
- [Rôles](docs/02-roles.md)
- [Boucle de partie](docs/03-game-loop.md)
- [Public et chaos](docs/04-audience-chaos.md)
- [Format du contenu](docs/05-content-format.md)
- [Architecture technique](docs/06-technical-architecture.md)
- [Roadmap](docs/07-roadmap.md)
- [Backlog d’idées](docs/08-idea-backlog.md)

## Limites

Il s’agit d’un prototype de playtest : pas de comptes, de sauvegarde persistante, d’audio intégré, d’IA générative ou de serveur Internet public. Les salles sont conservées uniquement en mémoire.

## Statut

Prototype expérimental. Aucune licence open source n’a encore été choisie ; tous droits réservés par défaut.
