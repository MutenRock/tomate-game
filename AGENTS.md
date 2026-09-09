# AGENTS.md — Tomate !

Ce fichier est le **point d'entrée prioritaire pour tout agent ou contributeur qui reprend le projet sans contexte de conversation**.

> Source de vérité actuelle : `AGENTS.md` + `docs/CURRENT_STATE.md` + le code de `main`.
>
> Les documents plus anciens décrivent parfois une cible ou une étape historique. En cas de contradiction, vérifier dans cet ordre : code actuel → `package.json` → `docs/CURRENT_STATE.md` → décisions produit → autres docs.

## 1. Pitch

**Tomate !** est un jeu web multijoueur asymétrique de performance théâtrale chaotique. Un ou deux comédiens tentent de maintenir une histoire compréhensible tandis qu'un public actif peut encourager, imposer des contraintes et provoquer des incidents limités.

Le principe central n'est pas de jouer parfaitement : **une erreur doit créer une situation à récupérer plutôt qu'arrêter la partie**.

## 2. État actuel

Version active : **v0.3.1 — prototype playtest-ready**.

Fonctionnel aujourd'hui :

- navigateur uniquement, responsive ;
- Node.js 20+, aucune dépendance NPM pour le prototype ;
- serveur HTTP avec synchronisation temps réel par **Server-Sent Events (SSE)** ;
- salons à code court ;
- mode solo : un comédien joue deux personnages ;
- mode duo : deux comédiens, chacun avec personnage et objectif secret ;
- public sur téléphone ou navigateur ;
- tutoriel guidé + six histoires longues ;
- didascalie, intention, texte à lire, action suivante et repère visuellement séparés ;
- états prêt / connecté / déconnecté ;
- pause automatique lors de la déconnexion d'un comédien ;
- reprise de place par code ;
- remplacement manuel d'un comédien par l'hôte ;
- réactions du public avec énergie, cooldown et budget de gêne ;
- verdict ;
- feedback de fin de partie ;
- export JSON de playtest anonymisé ;
- lancement LAN ;
- tunnel Cloudflare optionnel pour des tests distants.

Voir `docs/CURRENT_STATE.md` pour le détail.

## 3. Hypothèse à tester maintenant

La priorité produit n'est **pas** d'ajouter de nouveaux rôles immédiatement.

L'hypothèse principale à valider est :

> Lire / interpréter une histoire sous pression, avec un public actif et des incidents récupérables, est-il amusant et suffisamment clair pour donner envie de rejouer ?

Questions secondaires :

- l'écran comédien est-il compris sans explication externe ?
- le duo garde-t-il un rythme naturel ?
- les histoires de 6–8 minutes sont-elles trop longues, trop courtes ou adaptées ?
- le public a-t-il assez de décisions intéressantes entre deux réactions ?
- les perturbations produisent-elles du jeu plutôt que de la frustration ?

**Ne pas lancer une grosse refonte technique ou le rôle de régisseur avant d'avoir des retours de playtest qui la justifient.**

## 4. Commandes essentielles

```bash
npm run check
npm run smoke
npm run dev
```

Serveur local par défaut :

```text
http://localhost:4173
```

Windows :

```text
start_windows.bat
```

Test distant Windows :

```text
start_windows_cloudflare.bat
```

Le tunnel Cloudflare est uniquement un moyen de test. Les salles restent en mémoire du processus Node.

## 5. Architecture réellement utilisée

### Serveur

- `server/server.mjs` : HTTP, endpoints, SSE, connexions/déconnexions ;
- `server/game-engine.mjs` : règles, salles, phases, acteurs, réactions, verdict, feedback, rapport ;
- état des salons **en mémoire uniquement**.

### Client

- `public/index.html` ;
- `public/app.js` ;
- `public/styles.css` ;
- pas de React/Vite/TypeScript dans l'implémentation active.

### Contenu

- `content/scenes-v3/` : tutoriel et histoires actives ;
- `content/reactions.json` : réactions actuelles ;
- `content/scenes.json` : contenu plus ancien conservé pour historique / compatibilité, ne pas prendre comme source principale du contenu v0.3.1.

### Validation

- `scripts/check-repo.mjs` : cohérence du dépôt et de l'étude joueurs ;
- `scripts/smoke-test.mjs` : parcours automatisé du prototype.

## 6. Répertoires à ne pas confondre

### `prototype/`

Première maquette locale conservée comme référence historique.

### `tomate-game-prototype-v1/`

Snapshot complet d'un ancien état du dépôt ajouté le 23 juillet 2026. **Ne pas développer dedans.** Il sert uniquement d'archive / comparaison. Le projet actif est à la racine du dépôt.

### `research/player-study-v2/`

Étude joueurs externe de 51 questions, distincte du petit questionnaire de feedback intégré au prototype.

Elle contient :

- le questionnaire en Markdown ;
- un guide d'analyse ;
- un générateur Google Forms Apps Script.

## 7. Décisions déjà actées

Lire `docs/15-product-decisions.md` avant de rouvrir ces sujets.

À retenir :

- le cœur est multijoueur **asymétrique et simultané** ;
- le public doit être un vrai rôle, pas un simple chat ;
- le chaos doit créer du contre-jeu ;
- les tomates gênent l'interface mais ne doivent pas la rendre totalement inutilisable ;
- pas de reconnaissance vocale obligatoire au MVP ;
- l'IA peut enrichir le contenu mais le jeu doit fonctionner sans elle ;
- le serveur est autoritaire ;
- une erreur ne provoque pas une défaite immédiate ;
- le verdict récompense surtout continuité et récupération ;
- cible initiale : web responsive ;
- direction artistique définitive et licence restent ouvertes.

Une décision ne doit être rouverte qu'avec une nouvelle donnée de playtest ou une contrainte technique réelle.

## 8. Travail de recherche en cours

Le dossier `research/player-study-v2/` contient un questionnaire plus large sur :

- tailles de groupe ;
- durée ;
- vocal ;
- lecture / improvisation ;
- rôles ;
- public ;
- chaos ;
- confort ;
- rejouabilité ;
- usage du téléphone ;
- modèle commercial.

Ces réponses servent à orienter les versions futures mais **ne remplacent pas l'observation en playtest**.

## 9. Prochain travail recommandé

Ordre conseillé :

1. faire plusieurs playtests humains de la v0.3.1 ;
2. conserver les rapports JSON exportés ;
3. noter les problèmes de compréhension / rythme ;
4. analyser les réponses de l'étude joueurs V2 lorsqu'un échantillon suffisant existe ;
5. corriger les problèmes observés ;
6. seulement ensuite choisir le prochain axe majeur : public enrichi, régisseur, prompteur plus dynamique ou autre.

## 10. Garde-fous pour les prochains agents

Avant toute modification :

1. lire ce fichier et `docs/CURRENT_STATE.md` ;
2. lire les derniers commits de `main` ;
3. vérifier `package.json` et les fichiers réellement concernés ;
4. exécuter `npm run check` et `npm run smoke` après modification ;
5. mettre à jour `docs/CURRENT_STATE.md` si l'état fonctionnel change ;
6. mettre à jour `docs/15-product-decisions.md` seulement lorsqu'une décision produit est réellement prise ;
7. ne jamais considérer une ancienne roadmap comme plus fiable que le code actuel.

## 11. Definition of Done minimale

Un changement est prêt à être fusionné si :

- le comportement est testable ;
- `npm run check` passe ;
- `npm run smoke` passe si le moteur ou le client est touché ;
- le mobile reste utilisable pour les interfaces public ;
- une perturbation nouvelle possède une limite / un contre-jeu ;
- la documentation de l'état courant est mise à jour si nécessaire ;
- aucune donnée personnelle supplémentaire n'est collectée sans décision explicite.
