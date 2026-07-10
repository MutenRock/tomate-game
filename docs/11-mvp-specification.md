# Spécification du premier MVP

## Objectif

Valider une seule hypothèse : **est-ce amusant de lire et interpréter une courte scène pendant qu'un public humain perturbe et encourage la prestation ?**

Le MVP ne cherche pas encore à simuler tout un théâtre. Il doit fournir une partie complète, jouable à distance, avec un début, une montée en tension et un verdict.

## Mode retenu

**Lecture sous pression**

- 2 à 8 joueurs ;
- 1 comédien ;
- 1 hôte, qui peut aussi appartenir au public ;
- tous les autres joueurs dans le public ;
- voix assurée par Discord ou un autre outil externe ;
- aucun LLM nécessaire pendant la partie.

## Durée cible

- création et connexion au salon : moins de 60 secondes ;
- briefing : 20 secondes ;
- préparation du comédien : 30 secondes ;
- représentation : 90 à 150 secondes ;
- verdict : 30 secondes ;
- durée totale d'une manche : environ 4 minutes.

Une session normale comporte trois manches avec rotation automatique du comédien.

## Parcours de l'hôte

1. Ouvrir Tomate !
2. Créer un salon.
3. Copier ou afficher un code court.
4. Choisir un pack de scènes et un niveau de chaos.
5. Attendre que les joueurs soient prêts.
6. Lancer la manche.
7. Consulter le verdict.
8. Relancer une manche avec rotation du rôle principal.

## Parcours du comédien

1. Rejoindre le salon.
2. Recevoir le rôle de comédien.
3. Lire le thème, le personnage et l'objectif secret.
4. Découvrir le texte pendant la préparation.
5. Lire et interpréter la scène.
6. Confirmer chaque réplique avec un bouton ou une touche.
7. Réagir aux incidents sans interrompre la partie.
8. Découvrir les votes et la critique finale.

## Parcours du public

1. Rejoindre le salon depuis un téléphone ou un ordinateur.
2. Recevoir une main de réactions.
3. Gagner progressivement de l'énergie de salle.
4. Dépenser cette énergie pour gêner ou aider.
5. Voter pendant les fenêtres prévues.
6. Évaluer la prestation à la fin.

## Contenu minimal

### Scènes

Au moins six scènes courtes :

- deux comédies absurdes ;
- une romance ;
- une scène horrifique ;
- une scène dramatique ;
- une scène librement expérimentale.

Chaque scène contient :

- un titre ;
- un thème ;
- un personnage ;
- une intention initiale ;
- un objectif secret ;
- six à douze répliques ;
- deux ou trois moments propices aux incidents ;
- une conclusion jouable même si le temps est presque écoulé.

### Réactions du public

Réactions obligatoires :

- **Tomate** : masque temporairement une zone du texte ;
- **Émotion imposée** : modifie l'intention de jeu ;
- **Téléphone dans la salle** : incident sonore ou textuel à intégrer ;
- **Mot interdit** : ajoute une contrainte courte ;
- **Applaudissements** : rend du temps ou réduit une gêne ;
- **Souffleur** : révèle ou restaure une information.

## Niveaux de chaos

### Doux

- réactions moins fréquentes ;
- aucune superposition de gêne majeure ;
- davantage d'actions positives ;
- conseillé pour une première partie.

### Normal

- rythme prévu par défaut ;
- une gêne majeure maximum à la fois ;
- incidents positifs et négatifs équilibrés.

### Cabaret infernal

- coût réduit des réactions ;
- combinaisons collectives ;
- texte plus sensible aux perturbations ;
- accessible seulement après une première manche.

## États de partie

```text
LOBBY
  -> BRIEFING
  -> PREPARATION
  -> PERFORMANCE
  -> FINALE
  -> VERDICT
  -> LOBBY
```

Le serveur est autoritaire pour les phases, le temps, les ressources et la résolution des réactions.

## Règles de reconnexion

- un joueur conserve son identité pendant au moins cinq minutes ;
- le comédien reconnecté récupère immédiatement son texte et les incidents actifs ;
- une déconnexion du public n'interrompt jamais la manche ;
- si le comédien ne revient pas après quinze secondes, l'hôte peut terminer la manche ou transférer le rôle ;
- le journal d'événements permet de reconstruire l'état visible.

## Conditions de réussite du MVP

Le MVP est considéré comme validé si, pendant les playtests :

- au moins 80 % des groupes terminent une manche sans aide extérieure ;
- la connexion au salon prend moins d'une minute dans la majorité des cas ;
- au moins deux tiers des joueurs souhaitent rejouer immédiatement une manche ;
- le public utilise aussi les réactions positives ;
- les tomates gênent réellement sans bloquer durablement la lecture ;
- les joueurs peuvent raconter au moins un moment mémorable après la session ;
- aucun rôle ne reste sans décision intéressante plus de vingt secondes.

## Hors périmètre

Le premier MVP n'inclut pas :

- plusieurs comédiens simultanés ;
- régisseur humain ;
- metteur en scène humain ;
- reconnaissance vocale obligatoire ;
- notation automatique de l'intonation ;
- enregistrement audio ;
- matchmaking public ;
- comptes persistants ;
- boutique ;
- éditeur communautaire ;
- intégration Twitch ;
- génération de pièces en direct.

## Definition of Done

Le vertical slice est terminé lorsqu'il permet :

1. de créer et rejoindre un salon ;
2. de lancer trois manches consécutives ;
3. de faire tourner le rôle de comédien ;
4. de synchroniser le texte, le temps et les réactions ;
5. de reconnecter un joueur ;
6. d'afficher un verdict compréhensible ;
7. de fonctionner sur Chrome et Firefox récents, ordinateur et téléphone ;
8. de collecter les métriques anonymes nécessaires au playtest, après consentement.