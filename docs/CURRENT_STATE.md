# État courant du projet — Tomate !

Dernière mise à jour : 2026-09-09

Ce document décrit **l'implémentation réellement active** du dépôt. Il complète `AGENTS.md` et doit être mis à jour dès qu'un changement important modifie le prototype, son architecture ou sa priorité produit.

## Version active

**v0.3.1 — prototype playtest-ready**

Le prototype est suffisamment complet pour être confié à un groupe extérieur avec peu d'explications.

## Ce qui fonctionne aujourd'hui

### Partie

- création d'un salon avec code court ;
- jusqu'à 12 participants ;
- mode 1 comédien ;
- mode 2 comédiens ;
- public actif ;
- sélection d'une histoire ;
- briefing ;
- préparation ;
- représentation ;
- finale ;
- verdict ;
- nouvelle partie sans recréer le serveur.

### Comédiens

- personnage et objectif secret ;
- tour de parole synchronisé ;
- didascalie séparée du texte à lire ;
- intention de jeu ;
- action après la réplique ;
- repère de scène ;
- rappel de la réplique précédente ;
- aperçu de la prochaine intervention ;
- bouton de récupération d'un incident ;
- passage forcé par l'hôte en secours.

### Public

- énergie individuelle ;
- temps de recharge ;
- budget global de gêne ;
- tomate ;
- émotion imposée ;
- téléphone / sonnerie ;
- mot interdit ;
- micro-coupure ;
- applaudissements ;
- expéditeur, cible et durée des réactions affichés.

### Résilience de session

- état prêt ;
- état connecté / déconnecté ;
- pause automatique si un comédien se déconnecte ;
- code de reprise à six caractères ;
- récupération de session depuis un autre onglet / appareil ;
- remplacement manuel d'un comédien absent par un membre du public.

### Playtest

- tutoriel : `Répétition générale : la couronne disparue` ;
- questionnaire rapide après verdict ;
- export JSON anonymisé ;
- rapport contenant notamment durée, progression, réactions, récupérations, passages forcés, déconnexions, score et feedback ;
- aucun pseudo dans l'export ;
- aucun audio enregistré.

## Contenu actif

Dossier : `content/scenes-v3/`

Il contient :

- 1 tutoriel guidé ;
- 6 histoires longues ;
- histoires prévues pour environ 6 à 8 minutes selon le rythme du groupe.

`content/scenes.json` correspond à une étape plus ancienne et ne doit pas guider les nouveaux développements de contenu.

## Architecture active

### Runtime

- Node.js 20+ ;
- JavaScript ESM ;
- aucune dépendance NPM requise pour le serveur actif ;
- serveur lancé avec `node server/server.mjs`.

### Transport

Le prototype utilise actuellement :

- HTTP pour les commandes et lectures d'état ;
- **Server-Sent Events (SSE)** pour la diffusion temps réel serveur → clients.

Ce n'est pas encore l'architecture WebSocket / TypeScript envisagée historiquement.

### Données

Toutes les salles et parties sont stockées **en mémoire**.

Conséquences :

- redémarrer le serveur supprime toutes les salles ;
- aucune base de données ;
- aucune sauvegarde de compte ;
- aucune reprise après redémarrage serveur.

### Exposition réseau

Trois usages actuels :

1. `localhost` pour un test sur le même ordinateur ;
2. IP locale pour plusieurs appareils sur le même Wi-Fi ;
3. Cloudflare Tunnel temporaire pour des joueurs distants.

Le script Windows `start_windows_cloudflare.bat` lance le serveur puis `npx cloudflared tunnel --url http://localhost:4173`.

L'URL `trycloudflare.com` change à chaque lancement et ne constitue pas un déploiement de production.

## Fichiers principaux

```text
AGENTS.md                       Handoff prioritaire pour agents
README.md                       Présentation et guide utilisateur
package.json                    Version et commandes
server/server.mjs               HTTP, SSE, sessions réseau
server/game-engine.mjs          Règles de partie
public/index.html               Entrée client
public/app.js                   Interface et état client
public/styles.css               UI responsive
content/scenes-v3/              Contenu actif
content/reactions.json          Réactions du public
scripts/check-repo.mjs          Validation structurelle
scripts/smoke-test.mjs          Validation automatisée du parcours
research/player-study-v2/       Étude joueurs externe
```

## Archives / références historiques

### `prototype/`

Ancienne maquette locale. Ne pas y développer de nouvelles fonctionnalités.

### `tomate-game-prototype-v1/`

Snapshot complet d'un état antérieur ajouté le 23 juillet 2026. Il duplique de nombreux fichiers avec une version plus ancienne du produit.

**Important : ne jamais prendre ce dossier comme racine du projet actif.**

Le projet actif est directement à la racine de `tomate-game`.

## Étude joueurs V2

Dossier : `research/player-study-v2/`

Contenu :

- questionnaire de 51 questions ;
- 11 sections ;
- guide d'analyse ;
- générateur Google Forms Apps Script.

Objectif : obtenir des données plus générales sur les préférences de groupe, la lecture, l'improvisation, le chaos, les rôles, le public, la rejouabilité et le modèle commercial.

Cette étude est distincte du feedback intégré à la fin d'une partie.

### État du générateur Google Forms

Le générateur est actuellement réparti entre plusieurs fichiers `.gs`.

Le projet Apps Script doit contenir les définitions de questions **et** la fonction d'assemblage. Une erreur déjà observée en installation manuelle est :

```text
ReferenceError: getPlayerStudySections_ is not defined
```

Elle signifie que le fichier d'assemblage n'a pas été copié ou chargé dans le projet Apps Script.

Le handoff documentaire doit donc préserver une installation explicite et, idéalement, simplifier ce générateur dans une prochaine modification.

## Hypothèses produit actuelles

### À valider en priorité

1. La lecture sous pression est amusante.
2. L'interface comédien réduit suffisamment la charge cognitive.
3. Le duo crée plus d'interactions intéressantes qu'il n'ajoute de friction.
4. Le public possède suffisamment de décisions intéressantes.
5. Les incidents donnent envie d'improviser plutôt que de subir.
6. Les histoires longues gardent un bon rythme jusqu'à la conclusion.

### Pas encore validé

- régisseur comme rôle complet ;
- metteur en scène ;
- accessoiriste ;
- souffleur humain ;
- public simulé ;
- IA générative en partie ;
- WebRTC ;
- matchmaking ;
- progression persistante ;
- création communautaire ;
- modèle économique final.

## Priorité actuelle

**Obtenir des données de playtest humain avant d'augmenter fortement le périmètre.**

Ordre recommandé :

1. tester le tutoriel avec des personnes qui ne connaissent pas le projet ;
2. tester au moins une histoire longue ;
3. exporter le rapport JSON ;
4. noter les observations externes que le questionnaire ne capture pas ;
5. répéter sur plusieurs groupes ;
6. analyser les tendances ;
7. corriger la v0.3.1 ;
8. décider ensuite du prochain axe majeur.

## Problèmes / limites connus

- aucune persistance serveur ;
- une déconnexion reste gérée au niveau du processus vivant uniquement ;
- maximum de deux comédiens ;
- remplacement de comédien manuel ;
- public ciblant automatiquement le personnage actif ;
- audio externe au jeu ;
- pas de modération / matchmaking ;
- tunnel Cloudflare de test uniquement ;
- direction artistique non figée ;
- licence non choisie ;
- documentation historique encore présente pour référence.

## Commandes de validation

Avant toute fusion :

```bash
npm run check
npm run smoke
```

Pour lancer le jeu :

```bash
npm run dev
```

## Documents de référence

Priorité de lecture :

1. `AGENTS.md` ;
2. ce document ;
3. `README.md` ;
4. `docs/15-product-decisions.md` ;
5. `docs/PROTOTYPE_V031.md` ;
6. code actuel ;
7. roadmap et documents historiques pour le contexte seulement.
