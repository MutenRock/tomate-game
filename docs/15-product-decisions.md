# Décisions produit

Ce document enregistre les choix déjà actés afin d'éviter de rouvrir les mêmes débats sans nouvel élément de test.

## D001 — Nom du projet

**Décision :** le jeu s'appelle **Tomate !**

Le dépôt technique utilise `tomate-game` pour conserver une URL et un nom de package simples.

Le point d'exclamation fait partie du ton de marque, mais ne doit pas compliquer les identifiants techniques.

## D002 — Nature multijoueur

**Décision :** le cœur du jeu est **asymétrique et simultané**.

Les joueurs disposent de rôles et d'interfaces différentes pendant une même représentation.

Le terme « asynchrone » est réservé aux modes où les contributions sont réellement réalisées à des moments différents, comme **Téléphone théâtral**.

## D003 — Plusieurs modes autour d'un moteur commun

**Décision :** Tomate ! n'est pas limité à une distribution fixe des rôles.

Le moteur doit permettre :

- un comédien et tous les autres dans le public ;
- plusieurs comédiens ;
- régisseur ou metteur en scène humain ;
- rôles automatisés ;
- public humain, simulé ou hybride ;
- modes synchrones et modes différés.

Le mode ne doit pas être codé comme une page entièrement indépendante : il configure les rôles, les phases, les ressources et les règles disponibles.

## D004 — Premier mode développé

**Décision :** commencer par **Lecture sous pression**.

Raisons :

- testable avec très peu de joueurs ;
- public immédiatement actif ;
- peu de dépendances techniques ;
- voix externalisable vers Discord ;
- permet de valider les tomates et le budget de gêne ;
- fournit la base du prompteur et du verdict.

## D005 — Le chaos doit être causal

**Décision :** privilégier les réactions en chaîne plutôt qu'une accumulation d'événements aléatoires.

Une bonne catastrophe suit ce modèle :

```text
instruction imparfaite
  -> erreur compréhensible
  -> réaction d'un autre rôle
  -> improvisation
  -> nouvelle situation mémorable
```

Les incidents purement aléatoires restent possibles, mais doivent ouvrir une possibilité de jeu.

## D006 — Le public est un rôle complet

**Décision :** le public possède ses propres ressources, objectifs et choix.

Il peut :

- gêner ;
- encourager ;
- voter ;
- combiner des réactions ;
- reconnaître une récupération ;
- influencer le verdict.

Le public ne doit pas être un simple chat ou une source illimitée de malus.

## D007 — Les tomates gênent l'interface

**Décision :** la tomate est une perturbation visuelle concrète qui salit ou masque temporairement l'écran du comédien.

Elle doit :

- être immédiatement compréhensible ;
- ne masquer qu'une partie du contenu ;
- pouvoir être nettoyée ou compensée ;
- rester amusante à regarder ;
- respecter les réglages d'accessibilité.

## D008 — Pas de reconnaissance vocale obligatoire au départ

**Décision :** le comédien confirme manuellement les répliques dans les premiers prototypes.

Raisons :

- réduire le risque technique ;
- éviter les erreurs liées aux accents, micros et environnements bruyants ;
- tester la boucle avant d'intégrer WebRTC ou transcription ;
- ne pas conditionner l'accessibilité à un service externe.

## D009 — L'IA enrichit, elle ne tient pas le jeu seule

**Décision :** le système de base doit fonctionner sans IA générative.

Usages futurs pertinents :

- création de thèmes ;
- adaptation d'une pièce ;
- personnages secondaires ;
- public simulé ;
- critique finale ;
- résumé de partie.

Le score et les règles critiques restent fondés sur des événements explicites et vérifiables.

## D010 — Le public automatisé commence par des règles

**Décision :** avant un véritable public piloté par un LLM, utiliser des profils déterministes.

Exemples :

- critique snob ;
- amateur d'explosions ;
- romantique ;
- troll ;
- puriste ;
- défenseur de l'improvisation.

Ces profils rendent les tests reproductibles et permettent d'équilibrer le jeu hors ligne.

## D011 — Priorité au navigateur

**Décision :** la cible initiale est une application web responsive.

- ordinateur recommandé pour comédien, régisseur et metteur en scène ;
- téléphone prioritaire pour le public ;
- installation PWA envisagée ;
- aucune application native nécessaire au MVP.

## D012 — Le serveur est autoritaire

**Décision :** le serveur contrôle les phases, le temps, les ressources, la cible des réactions et leur résolution.

Cela limite :

- les divergences entre écrans ;
- le spam ;
- la triche ;
- les doubles déclenchements ;
- les problèmes de reconnexion.

## D013 — L'échec ne doit pas arrêter la scène

**Décision :** oublier une réplique, rater un cue ou perdre du temps ne déclenche pas un écran d'échec immédiat.

Le système propose plutôt :

- une reformulation ;
- une aide du souffleur ;
- une conclusion de secours ;
- un changement de contrainte ;
- une reconnaissance de récupération.

## D014 — La performance n'est pas un concours de talent pur

**Décision :** le verdict ne juge pas la qualité professionnelle d'un comédien.

Il met en avant :

- continuité ;
- respect des contraintes ;
- récupération ;
- divertissement ;
- chaos maîtrisé.

Les distinctions narratives sont préférées à un classement humiliant.

## D015 — Direction artistique encore ouverte

**Décision :** aucune direction artistique définitive n'est validée.

Pistes compatibles avec le concept :

- théâtre de papier et affiches imprimées ;
- cabaret populaire ;
- coulisses analogiques ;
- console de régie rétro ;
- marionnettes ou silhouettes ;
- taches, tampons et annotations physiques.

Contraintes :

- interfaces très lisibles ;
- identité non générique de jeu mobile ;
- tomates visuellement satisfaisantes ;
- rôles immédiatement distinguables ;
- effets adaptables aux options d'accessibilité.

## D016 — Licence non choisie

**Décision :** tous droits réservés par défaut jusqu'à un choix explicite.

Avant toute contribution externe importante, décider séparément :

- licence du code ;
- licence des textes et packs ;
- règles des créations communautaires ;
- droits sur les enregistrements et résumés de partie.

## Format des futures décisions

```markdown
## DXXX — Titre

**Statut :** proposé | accepté | remplacé  
**Date :** YYYY-MM-DD  
**Décision :** ...

### Contexte

### Raisons

### Conséquences

### Éléments pouvant rouvrir la décision
```

Une décision peut être remplacée après un playtest, mais elle doit alors pointer vers la nouvelle décision.