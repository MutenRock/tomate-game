# Plan de playtest

## But

Le playtest doit répondre à des questions de game design, pas seulement vérifier que le logiciel fonctionne.

Questions prioritaires :

1. Lire sous pression est-il réellement amusant ?
2. Le public prend-il des décisions intéressantes ?
3. Les incidents créent-ils de l'improvisation ou seulement de la frustration ?
4. Les joueurs comprennent-ils les règles sans explication longue ?
5. Ont-ils envie de changer de rôle et de rejouer ?

## Étapes de test

### Test A — Papier ou partage d'écran

**Participants :** 3 à 5  
**Matériel :** texte imprimé ou partagé, cartes de réactions, minuteur

Objectifs :

- tester la durée des textes ;
- mesurer la fréquence acceptable des incidents ;
- identifier les réactions naturellement amusantes ;
- vérifier si les encouragements sont utilisés.

Aucun développement réseau n'est nécessaire.

### Test B — Maquette locale

**Participants :** 2 à 5 autour d'un même écran

Objectifs :

- tester la lisibilité ;
- observer les tomates et le nettoyage ;
- comparer les niveaux de chaos ;
- vérifier la compréhension du journal de salle ;
- tester la rotation des scènes.

### Test C — Prototype distant

**Participants :** 3 à 8 sur plusieurs appareils

Objectifs :

- rejoindre un salon sans assistance ;
- vérifier les délais de synchronisation ;
- tester la reconnexion ;
- observer les usages mobiles du public ;
- valider trois manches consécutives.

### Test D — Session ouverte ou stream privé

Uniquement après les garde-fous de modération.

Objectifs :

- mesurer l'effet d'un public plus large ;
- tester les votes collectifs ;
- observer les risques d'acharnement ;
- identifier les besoins d'overlay et de modération.

## Composition des groupes

Éviter de tester uniquement avec des joueurs très à l'aise à l'oral.

Chercher au minimum :

- un groupe d'amis habitué aux party games ;
- un groupe peu habitué à l'improvisation ;
- des joueurs sur téléphone ;
- une personne ayant besoin d'options de lisibilité ;
- un groupe qui ne connaît pas le projet ;
- si possible, un groupe comprenant un streamer ou animateur de communauté.

## Script d'une session

1. Présenter le pitch en une phrase.
2. Ne pas expliquer les stratégies.
3. Laisser les joueurs rejoindre et découvrir l'interface.
4. Jouer une manche en chaos doux.
5. Jouer une manche en chaos normal.
6. Faire tourner le rôle de comédien.
7. Poser les questions immédiatement après.
8. Noter les moments où l'animateur a dû intervenir.

## Observations à noter

### Compréhension

- temps avant la première action ;
- boutons ignorés ;
- erreurs répétées ;
- vocabulaire incompris ;
- moment où le joueur comprend réellement son objectif.

### Comédien

- fréquence des arrêts ;
- perte de ligne ;
- utilisation du nettoyage ;
- reformulations ;
- intégration des incidents ;
- niveau de stress déclaré ;
- plaisir visible ou déclaré.

### Public

- réactions préférées ;
- ressources conservées ou dépensées immédiatement ;
- usage des aides ;
- coordination spontanée ;
- répétition d'une même réaction ;
- ciblage ou acharnement ;
- périodes sans décision.

### Rythme

- préparation trop courte ou trop longue ;
- temps morts ;
- incidents trop rapprochés ;
- finale comprise ;
- verdict attendu ou ignoré.

## Questionnaire après la session

Notes de 1 à 5 :

- J'ai compris mon rôle rapidement.
- J'avais régulièrement une décision intéressante à prendre.
- Les perturbations étaient gênantes mais amusantes.
- La scène est restée compréhensible.
- Le verdict représentait bien la partie.
- J'aimerais rejouer immédiatement.
- J'aimerais essayer un autre rôle.

Questions ouvertes :

- Quel moment raconterais-tu à quelqu'un demain ?
- Quel incident t'a le plus amusé ?
- Quel incident t'a le plus frustré ?
- À quel moment ne savais-tu plus quoi faire ?
- Qu'aurais-tu voulu pouvoir faire depuis ton rôle ?
- La manche était-elle trop courte, trop longue ou correcte ?

## Métriques minimales

Sans audio enregistré :

- durée de connexion ;
- durée de chaque phase ;
- répliques atteintes ;
- réactions jouées par type ;
- fréquence des aides ;
- nombre de nettoyages ;
- incidents simultanés ;
- déconnexions ;
- manche terminée ou abandonnée ;
- demande de revanche ;
- rotation du rôle acceptée.

## Signaux d'alerte

Revoir le design si :

- les spectateurs spamment toujours la même réaction ;
- le comédien attend la fin des incidents au lieu de continuer ;
- les joueurs évitent systématiquement le rôle principal ;
- le public oublie les réactions positives ;
- le verdict provoque davantage de débat que de satisfaction ;
- le jeu n'est amusant qu'avec un animateur connaissant les règles ;
- une seule tomate suffit à perdre durablement la ligne ;
- les joueurs ne se souviennent d'aucun événement précis.

## Journal de test

Créer une entrée par session :

```markdown
## Session YYYY-MM-DD

- Version :
- Nombre de joueurs :
- Appareils :
- Mode et scènes :
- Niveau de chaos :
- Hypothèse testée :
- Résultat :
- Moments marquants :
- Frictions :
- Décision prise :
- Prochain test :
```

Les retours ne deviennent pas automatiquement des fonctionnalités. Chaque changement doit être relié à une hypothèse observée.