# Score et verdict

## Intention

Le verdict doit récompenser une représentation amusante et la capacité à récupérer les catastrophes. Il ne doit pas prétendre mesurer objectivement le talent théâtral.

Le score sert à :

- donner une conclusion claire à la manche ;
- mettre en valeur plusieurs styles de jeu ;
- créer des souvenirs partageables ;
- encourager le public à aider autant qu'à perturber ;
- nourrir la rotation des rôles et les défis futurs.

## Axes du verdict

Chaque axe est affiché sur 5, mais le calcul interne peut utiliser une échelle plus précise.

### Continuité

La scène a-t-elle avancé jusqu'à une conclusion compréhensible ?

Signaux possibles :

- répliques confirmées ;
- durée des silences ;
- progression avant la fin du temps ;
- finale atteinte ;
- abandon ou interruption.

### Interprétation

Évaluation principalement fournie par le public :

- intention lisible ;
- engagement ;
- variation ;
- plaisir à écouter.

Ce score ne doit pas être inféré automatiquement depuis le microphone dans le MVP.

### Respect des contraintes

- émotion imposée suivie ;
- mot obligatoire utilisé ;
- mot interdit évité ;
- objectif secret accompli ;
- incident intégré à la scène.

### Récupération

Mesure centrale de Tomate !

Une récupération est reconnue lorsqu'un incident est suivi rapidement d'une action cohérente :

- le comédien continue après une tomate ;
- un bruitage devient un élément de l'histoire ;
- une réplique oubliée est reformulée ;
- une erreur technique provoque une improvisation ;
- une contrainte inattendue est intégrée sans arrêter la scène.

Au MVP, ces récupérations peuvent être déclarées par vote du public ou par un bouton « belle récupération » à fenêtre limitée.

### Divertissement

Vote final du public. La question doit rester simple :

> Est-ce que cette représentation t'a donné envie de voir la suivante ?

### Chaos maîtrisé

Compare le nombre d'incidents, leur intensité et la continuité de la scène. Beaucoup de chaos avec une scène encore lisible produit un bon résultat. Une scène détruite par un spam de réactions n'en produit pas.

## Score du public

Le public reçoit aussi un verdict collectif.

Axes possibles :

- variété des réactions ;
- synchronisation ;
- usage des encouragements ;
- incidents intégrables ;
- respect du budget de gêne ;
- absence d'acharnement sur une seule cible.

Le public ne gagne pas en empêchant le comédien de jouer. Il gagne en rendant la représentation plus mémorable.

## Calcul initial proposé

Le score global ne doit pas masquer les catégories, mais un total peut être utilisé pour la progression.

```text
score global =
  20 % continuité
+ 15 % interprétation
+ 20 % contraintes
+ 25 % récupération
+ 20 % divertissement
```

Le **chaos maîtrisé** apparaît comme un badge séparé afin de ne pas pousser artificiellement tous les modes vers la même intensité.

## Vote du public

Pour réduire les votes arbitraires :

- vote rapide après la scène ;
- trois questions maximum ;
- aucune note négative publique attribuée par un individu ;
- médiane ou moyenne tronquée plutôt que moyenne brute ;
- votes absents ignorés ;
- vote du comédien sur la qualité du public.

Questions MVP :

1. La scène était-elle amusante ?
2. Le comédien a-t-il bien récupéré les incidents ?
3. Le niveau de chaos était-il trop faible, bon ou trop fort ?

## Titres de fin de manche

Les titres racontent mieux la partie qu'un classement unique.

Exemples :

- **Rideau de fer** — a terminé malgré une forte gêne ;
- **Maître de l'improvisation** — plusieurs récupérations reconnues ;
- **Chouchou du public** — beaucoup d'encouragements reçus ;
- **Cible préférée** — a reçu le plus de tomates sans abandon ;
- **Salle en délire** — combinaison collective réussie ;
- **Critique constructive** — public équilibré entre aide et perturbation ;
- **La phrase de trop** — dernière réplique devenue mémorable ;
- **Accident industriel** — chaos maximal, compréhension minimale, mais session terminée.

## Critique finale

La critique finale est composée à partir d'événements réels :

```text
« Une prestation courageuse, marquée par trois tomates,
un téléphone opportunément transformé en appel royal
et une confession finale presque compréhensible. »
```

Une IA générative peut reformuler cette critique plus tard. Les faits utilisés doivent toujours provenir du journal de partie.

## Données à conserver

Pour chaque manche :

- scène et mode ;
- durée réelle ;
- nombre de répliques atteintes ;
- incidents déclenchés ;
- encouragements ;
- récupérations reconnues ;
- niveau de gêne maximal ;
- votes agrégés ;
- titre attribué ;
- abandon ou déconnexion.

Les données vocales ne sont ni requises ni conservées par défaut.

## Garde-fous

- ne jamais afficher « mauvais acteur » ;
- ne pas comparer directement des joueurs n'ayant pas joué le même rôle ;
- distinguer échec de la scène et échec du système ;
- limiter l'impact d'un public hostile ;
- offrir un mode sans score chiffré ;
- permettre de masquer les statistiques personnelles ;
- privilégier les faits amusants aux jugements de valeur.