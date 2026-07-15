# Prototype multijoueur V1

## Objectif

Valider la boucle **Lecture sous pression** avec un comédien et un public actif, sur plusieurs appareils connectés au même réseau local.

## Inclus

- création et connexion à une salle par code ;
- un écran comédien et une interface public adaptée au téléphone ;
- six scènes ;
- briefing, préparation, représentation, finale et verdict ;
- serveur autoritaire en mémoire ;
- synchronisation par Server-Sent Events ;
- tomates, intention dramatique, téléphone, mot interdit, micro-coupure et applaudissements ;
- énergie individuelle et temps de recharge ;
- budget de gêne empêchant le blocage total du texte ;
- score de continuité, récupération, participation du public et finale ;
- options de contraste et de réduction des animations.

## Test recommandé

1. Un joueur lance le serveur sur un PC.
2. Le comédien crée la salle.
3. Deux à cinq personnes rejoignent le public avec leur téléphone.
4. La voix passe par Discord ou dans la même pièce.
5. Jouer au moins trois manches en faisant tourner le comédien manuellement.

## Limites volontaires

- les salles sont perdues au redémarrage du serveur ;
- un seul comédien ;
- pas de compte ;
- pas de WebRTC ni de reconnaissance vocale ;
- pas d'IA générative ;
- le bouton « J'ai sauvé l'incident » repose sur l'honnêteté du groupe ;
- aucune exposition Internet automatique.

## Critères de validation

Le prototype est prometteur si :

- la majorité des joueurs souhaite enchaîner une deuxième manche ;
- le public utilise aussi les réactions positives ;
- les tomates gênent sans bloquer ;
- le comédien comprend comment récupérer un incident ;
- le temps d'attente reste faible ;
- le rôle du public est perçu comme actif.
