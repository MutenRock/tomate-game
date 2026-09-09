# Architecture technique

> Ce document distingue désormais **l'architecture active** de la **cible éventuelle**.
>
> Pour l'état exact du projet, lire aussi [`CURRENT_STATE.md`](CURRENT_STATE.md) et [`../AGENTS.md`](../AGENTS.md).

## Architecture active — v0.3.1

Le prototype actuel privilégie une architecture volontairement simple afin de tester le jeu avant d'engager une migration technique lourde.

```text
Navigateur comédien ─┐
Navigateur comédien ─┼── HTTP commandes ─┐
Navigateur public ───┘                    │
                                          ├── Serveur Node.js
Tous les navigateurs <── SSE état ────────┘       │
                                                  ├── moteur de règles
                                                  ├── salons en mémoire
                                                  ├── horloge / phases
                                                  ├── réactions / incidents
                                                  └── rapports de playtest
```

### Runtime

- Node.js 20+ ;
- JavaScript ESM ;
- aucune dépendance NPM requise pour l'application active ;
- serveur : `server/server.mjs` ;
- moteur : `server/game-engine.mjs`.

### Frontend

Le client actif n'utilise pas de framework :

- `public/index.html` ;
- `public/app.js` ;
- `public/styles.css` ;
- `public/manifest.webmanifest`.

Cette simplicité est intentionnelle pour le prototype de playtest.

## Réseau actuel

### Client vers serveur

Les actions passent par HTTP JSON.

Routes principales :

```text
POST /api/rooms
POST /api/rooms/:code/join
POST /api/rooms/:code/reclaim
GET  /api/rooms/:code/state
POST /api/rooms/:code/commands
GET  /api/rooms/:code/report
GET  /api/rooms/:code/events
```

### Serveur vers client

`/events` utilise **Server-Sent Events (SSE)** pour diffuser les snapshots personnalisés.

Le serveur reste autoritaire : le client ne décide pas de l'état officiel de la partie.

### Pourquoi SSE maintenant ?

- aucun besoin de bibliothèque externe ;
- diffusion serveur → clients suffisante pour le prototype ;
- commandes client → serveur simples en HTTP ;
- débogage facile ;
- acceptable pour les tests actuels.

Une migration WebSocket ne doit être entreprise que lorsqu'un besoin réel la justifie.

## État d'une partie

Phases actives :

```text
lobby
briefing
preparation
performance
finale
verdict
```

Le serveur conserve notamment :

- code de salon ;
- phase ;
- échéance de phase ;
- scène ;
- réplique active ;
- joueurs ;
- rôle / emplacement des comédiens ;
- état prêt ;
- état de connexion ;
- énergie du public ;
- cooldowns ;
- incidents actifs ;
- métriques de partie ;
- feedback ;
- verdict.

## Sessions et reconnexion

Chaque participant possède :

- un `playerId` ;
- un token de session ;
- un code de reprise à six caractères.

La reprise de place permet de retrouver une session depuis un nouvel onglet ou appareil tant que le serveur est toujours vivant.

Une déconnexion d'un comédien peut mettre les phases chronométrées en pause. L'hôte peut remplacer manuellement un comédien absent.

## Persistance

Il n'y en a **aucune** actuellement.

Toutes les salles sont conservées en mémoire dans le processus Node.

Conséquences :

- redémarrer le serveur supprime les salles ;
- le tunnel Cloudflare n'apporte aucune persistance ;
- aucune base de données n'est requise pour le prototype ;
- ne pas ajouter une base uniquement “pour faire propre” avant que le besoin de playtest ne le justifie.

## Exposition réseau

### Localhost

Pour tester plusieurs rôles dans différents onglets :

```text
http://localhost:4173
```

### LAN

`server/server.mjs` affiche les adresses IPv4 locales afin que les téléphones connectés au même Wi-Fi puissent rejoindre la partie.

### Test distant

`start_windows_cloudflare.bat` lance le serveur puis un Cloudflare Tunnel temporaire avec :

```bash
npx cloudflared tunnel --url http://localhost:4173
```

Ce tunnel :

- ne nécessite pas de compte Cloudflare dans ce mode ;
- produit une URL temporaire ;
- ne constitue pas un hébergement de production ;
- dépend du PC hôte et de son processus Node.

## Contenu

### Histoires actives

`content/scenes-v3/`

- tutoriel guidé ;
- six histoires longues ;
- deux personnages par histoire dans la structure actuelle.

### Réactions

`content/reactions.json`

Le serveur valide :

- coût ;
- cooldown ;
- sévérité ;
- budget de gêne ;
- cible active.

## Rapport de playtest

Le moteur peut produire un rapport JSON anonymisé comprenant notamment :

- version ;
- scène ;
- mode solo / duo ;
- nombre de joueurs ;
- durée ;
- répliques terminées ;
- réactions ;
- récupérations ;
- passages forcés ;
- déconnexions ;
- verdict ;
- feedback agrégé / anonymisé.

Les pseudos ne doivent pas être ajoutés à cet export sans décision explicite.

## Audio

Ordre actuel :

1. voix dans la même pièce ou via Discord ;
2. validation manuelle des répliques ;
3. seulement après validation du gameplay : étude de WebRTC ;
4. transcription facultative éventuelle ;
5. analyse de rythme ou d'intention uniquement si elle apporte une vraie valeur.

Aucun audio n'est enregistré par le prototype actuel.

## IA

Le moteur critique du jeu ne dépend pas d'une IA générative.

Usages futurs possibles :

- proposer des thèmes ;
- adapter une pièce ;
- générer des contraintes ;
- produire une critique finale ;
- résumer la représentation ;
- jouer certains personnages secondaires.

À éviter avant validation du cœur :

- jugement opaque du talent d'un joueur ;
- transcription obligatoire ;
- génération en direct indispensable au déroulement ;
- dépendance à un fournisseur unique.

## Sécurité / robustesse actuelle

Déjà présents ou visés par le moteur :

- serveur autoritaire ;
- tokens de session ;
- codes de salon non triviaux ;
- budget de gêne ;
- cooldowns ;
- limites fonctionnelles sur les réactions ;
- export sans pseudos.

Avant un déploiement public stable, il faudra renforcer :

- validation stricte de toutes les entrées ;
- rate limiting réseau ;
- expiration / nettoyage des salles ;
- stockage sécurisé ;
- observabilité ;
- gestion d'abus ;
- stratégie de secrets et configuration d'environnement.

## Cible technique éventuelle — non engagée

Une architecture plus structurée reste envisageable plus tard :

- TypeScript ;
- React / Preact ou autre framework léger ;
- Vite ;
- machine à états explicite ;
- WebSocket ;
- stockage persistant ;
- déploiement stable ;
- PWA plus complète.

**Ce n'est pas une décision active.**

Une migration doit répondre à un problème observé : complexité croissante, besoin de typage, bidirectionnalité temps réel, persistance ou déploiement. Elle ne doit pas retarder les playtests actuels.
