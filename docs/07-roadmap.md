# Roadmap

> État synchronisé avec le prototype **v0.3.1**.
>
> Pour l'état technique exact, lire d'abord [`../AGENTS.md`](../AGENTS.md) et [`CURRENT_STATE.md`](CURRENT_STATE.md). Une case cochée signifie que la fonctionnalité existe dans le prototype actuel ; elle ne signifie pas nécessairement qu'elle est validée par des playtests humains.

La roadmap sépare volontairement **implémentation** et **validation produit**.

## Phase 0 — Cadrage

- [x] Définir le pitch.
- [x] Choisir le nom **Tomate !**.
- [x] Lister les modes.
- [x] Définir les rôles.
- [x] Définir les principes du public.
- [x] Créer le dépôt.
- [x] Écrire une spécification du premier MVP.
- [x] Définir une première proposition de score et de verdict.
- [x] Définir les garde-fous d'accessibilité et d'anti-acharnement.
- [x] Préparer un protocole de playtest.
- [x] Créer une étude joueurs V2 plus large.
- [ ] Accumuler suffisamment de playtests humains pour valider le cœur du concept.
- [ ] Choisir une direction artistique définitive.
- [ ] Choisir le ton éditorial définitif du maître de cérémonie.
- [ ] Décider de la licence avant les contributions externes importantes.

## Phase 1 — Boucle de jeu jouable

**Objectif :** vérifier que lire / interpréter sous pression est amusant et compréhensible.

### Implémenté

- [x] écran comédien distinct ;
- [x] écran public distinct et mobile ;
- [x] briefing ;
- [x] préparation ;
- [x] représentation ;
- [x] finale ;
- [x] verdict ;
- [x] six histoires longues ;
- [x] tutoriel guidé ;
- [x] mode solo ;
- [x] mode duo ;
- [x] objectifs secrets par comédien ;
- [x] indication claire du tour de parole ;
- [x] didascalie / intention / texte / action suivante séparés ;
- [x] réactions avec coût, durée et sévérité ;
- [x] tomate ;
- [x] émotion imposée ;
- [x] téléphone / sonnerie ;
- [x] mot interdit ;
- [x] micro-coupure ;
- [x] applaudissements ;
- [x] options de confort initiales ;
- [x] état prêt ;
- [x] feedback intégré après la partie ;
- [x] rapport JSON anonymisé.

### À valider par observation

- [ ] trois groupes extérieurs comprennent le tutoriel sans explication détaillée ;
- [ ] le duo conserve un rythme naturel ;
- [ ] les histoires de 6–8 minutes gardent l'attention ;
- [ ] le public ne passe pas trop de temps en attente ;
- [ ] les perturbations créent davantage d'improvisation que de frustration ;
- [ ] la hiérarchie visuelle de l'écran comédien est suffisante ;
- [ ] le verdict est perçu comme amusant et non comme un jugement du talent théâtral.

## Phase 2 — Prototype multijoueur de playtest

**Objectif :** permettre des tests sur plusieurs appareils, localement ou à distance.

### Implémenté en v0.3.1

- [x] serveur Node.js autoritaire ;
- [x] création de salon ;
- [x] code de connexion court ;
- [x] rôle d'hôte ;
- [x] un ou deux comédiens ;
- [x] plusieurs membres du public ;
- [x] ressource individuelle du public ;
- [x] synchronisation serveur → clients par SSE ;
- [x] budget de gêne calculé côté serveur ;
- [x] reconnexion / reprise de place ;
- [x] état connecté / déconnecté ;
- [x] pause automatique sur déconnexion d'un comédien ;
- [x] remplacement manuel d'un comédien ;
- [x] journal de partie ;
- [x] verdict partagé ;
- [x] interface public sur téléphone ;
- [x] test LAN ;
- [x] tunnel Cloudflare temporaire pour tests distants ;
- [x] smoke test automatisé.

### Restant avant un vrai vertical slice public

- [ ] persistance des salles / parties ;
- [ ] déploiement stable public ;
- [ ] reprise après redémarrage serveur ;
- [ ] rotation automatique et équitable des rôles ;
- [ ] plusieurs manches consécutives mieux outillées ;
- [ ] supervision / logs exploitables en environnement déployé ;
- [ ] sécurisation plus complète des entrées et limitations de débit ;
- [ ] tests réseau avec plusieurs groupes réels à distance.

## Sprint actuel — Playtest et apprentissage

**Priorité actuelle : obtenir des données, pas ajouter une grande nouvelle couche de gameplay.**

Ordre recommandé :

1. faire jouer le tutoriel à des personnes qui ne connaissent pas Tomate ! ;
2. enchaîner avec une histoire longue ;
3. exporter le rapport JSON ;
4. recueillir les observations qualitatives de l'organisateur ;
5. répéter avec plusieurs tailles de groupe ;
6. analyser les réponses de `research/player-study-v2/` quand l'échantillon devient utile ;
7. corriger les points de friction observés ;
8. choisir le prochain axe majeur seulement à partir de ces données.

### Critères de sortie du sprint

- au moins trois groupes différents testés ;
- au moins un test avec deux comédiens ;
- au moins un test distant ;
- rapports de playtest conservés ;
- problèmes de compréhension classés par fréquence / gravité ;
- décision explicite sur le prochain axe de développement.

## Axes candidats après playtests

Le choix doit venir des données, pas de l'ordre de cette liste.

### A — Public enrichi

À choisir si le public manque de décisions ou attend trop entre deux réactions.

Pistes :

- votes ;
- combos ;
- objectifs collectifs ;
- ressources partagées ;
- aide active au comédien ;
- événements rares plus lisibles.

### B — Régisseur

À choisir si le cœur lecture + public est déjà solide et qu'un nouveau rôle asymétrique peut augmenter la coordination.

Pistes :

- cues ;
- sons ;
- lumières ;
- déclencheurs contextuels ;
- informations différentes de celles des comédiens.

### C — Prompteur plus dynamique

À choisir si les comédiens se perdent encore dans le texte ou si le rythme de lecture reste trop lourd.

Pistes :

- découpage plus fin ;
- préparation de la prochaine intention ;
- aides contextuelles ;
- souffleur ;
- réglages de densité de texte.

### D — Robustesse / déploiement

À choisir si les playtests sont suffisamment amusants mais difficiles à organiser techniquement.

Pistes :

- persistance ;
- hébergement stable ;
- meilleure reconnexion ;
- observabilité ;
- URLs de salle partageables.

## Phase 3 — Contenu et progression légère

- [ ] packs thématiques ;
- [ ] contraintes secrètes plus variées ;
- [ ] résumé de partie enrichi ;
- [ ] titres narratifs ;
- [ ] affiche ou souvenir partageable ;
- [ ] récompenses cosmétiques non compétitives ;
- [ ] historique des représentations ;
- [ ] rotation équitable des rôles.

## Phase 4 — Théâtre asymétrique complet

- [x] plusieurs comédiens, jusqu'à deux dans le prototype actuel ;
- [ ] régisseur ;
- [ ] metteur en scène ;
- [ ] souffleur humain ;
- [ ] accessoiriste ;
- [ ] système de cues multi-rôles ;
- [ ] entrées et sorties ;
- [ ] effets sonores et lumineux complets ;
- [ ] public simulé ;
- [x] objectifs secrets pour les comédiens ;
- [ ] objectifs secrets pour les autres rôles ;
- [ ] score de récupération multi-rôles ;
- [ ] interface distincte pour chaque métier.

## Phase 5 — Modes étendus

- [x] seul en scène, sous forme du mode solo actuel ;
- [x] duo catastrophe, sous forme du mode duo actuel ;
- [ ] improvisation publique ;
- [ ] pièce tournante ;
- [ ] mauvais régisseur ;
- [ ] doublage catastrophique ;
- [ ] téléphone théâtral ;
- [ ] répétition contre public ;
- [ ] public contre IA ;
- [ ] streaming participatif.

## Phase 6 — Création et IA

- [ ] éditeur de pièces ;
- [ ] import et export de packs ;
- [ ] validation automatique des contenus ;
- [ ] génération assistée de thèmes et contraintes ;
- [ ] adaptation d'une pièce au nombre de joueurs ;
- [ ] modération du contenu ;
- [ ] critiques générées à partir du journal réel ;
- [ ] personnages secondaires génératifs ;
- [ ] bibliothèque communautaire ;
- [ ] gestion des droits et licences des créations.

## Phase 7 — Audio intégré et diffusion

Cette phase reste volontairement tardive.

- [ ] WebRTC intégré ;
- [ ] réglages individuels de volume ;
- [ ] consentement explicite à l'enregistrement ;
- [ ] transcription facultative ;
- [ ] détection optionnelle des silences et mots-clés ;
- [ ] overlays de streaming ;
- [ ] modération des réactions externes ;
- [ ] export de replay ou montage avec consentement.

## Principes de priorisation

Une fonctionnalité passe avant une autre si elle :

1. permet de tester l'hypothèse principale ;
2. améliore une décision fréquente d'un rôle ;
3. transforme une erreur en opportunité de jeu ;
4. réduit une frustration observée en playtest ;
5. augmente la rejouabilité sans exiger beaucoup de contenu manuel.

Une fonctionnalité reste en attente si elle :

- dépend d'une IA alors qu'une règle simple suffit ;
- nécessite l'audio intégré avant validation de la boucle ;
- ajoute du chaos sans contre-jeu ;
- complexifie le serveur sans bénéfice visible pour les tests ;
- répond à une hypothèse qui n'a pas encore été observée.
