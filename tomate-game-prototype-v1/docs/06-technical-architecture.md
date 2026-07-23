# Architecture technique

## Objectif initial

Application web installable, jouable sur ordinateur et téléphone, avec un serveur temps réel autoritaire.

## Architecture cible

```text
Navigateur comédien ─┐
Navigateur régie ────┼── WebSocket ── Serveur de partie
Navigateur public ───┘                   │
                                        ├── moteur de règles
                                        ├── horloge autoritaire
                                        ├── stockage des parties
                                        └── génération de contenu
```

## Frontend

Proposition :

- TypeScript ;
- React ou Preact ;
- Vite ;
- machine à états explicite ;
- interfaces adaptées par rôle ;
- PWA pour l'accès mobile ;
- Web Audio API pour certains effets ;
- animations CSS ou Canvas pour les perturbations.

## Backend

Proposition :

- Node.js et TypeScript ;
- WebSocket via Socket.IO ou bibliothèque plus légère ;
- serveur autoritaire ;
- validation des messages ;
- salons à code court ;
- reconnexion ;
- journal d'événements ;
- limitation de débit des actions du public.

## État d'une partie

```ts
type MatchPhase =
  | "lobby"
  | "casting"
  | "briefing"
  | "preparation"
  | "performance"
  | "finale"
  | "verdict";
```

Le serveur conserve :

- phase ;
- horloge ;
- joueurs et rôles ;
- scène courante ;
- cues ;
- incidents actifs ;
- ressources du public ;
- score ;
- journal d'événements.

## Événements réseau initiaux

### Client vers serveur

- `room:create`
- `room:join`
- `player:ready`
- `role:select`
- `match:start`
- `line:confirm`
- `reaction:play`
- `cue:trigger`
- `director:instruction`

### Serveur vers client

- `room:snapshot`
- `match:phase`
- `timer:sync`
- `script:update`
- `reaction:resolved`
- `incident:started`
- `incident:ended`
- `verdict:ready`

## Horloge

Le serveur décide du temps. Les clients affichent une interpolation locale et se resynchronisent périodiquement.

## Audio

Ordre conseillé :

1. voix via Discord ou autre service externe pendant les tests ;
2. détection manuelle des répliques ;
3. WebRTC intégré ;
4. transcription facultative ;
5. analyse de rythme ou d'intention en option.

## IA

Usages raisonnables :

- proposer des thèmes ;
- adapter un texte à un nombre de joueurs ;
- générer des contraintes ;
- produire une critique finale ;
- résumer la représentation.

Usages à éviter au MVP :

- jugement entièrement opaque ;
- transcription obligatoire ;
- génération en direct sans garde-fous ;
- dépendance à un fournisseur unique.

## Sécurité

- aucune clé d'API dans le client ;
- validation de tous les événements ;
- limites de débit ;
- codes de salon non prédictibles ;
- filtrage du contenu utilisateur ;
- consentement explicite avant enregistrement audio ;
- suppression configurable des enregistrements.
