# Prototype v0.3.1 — préparation des playtests

## Objectif

Transformer la v0.3 en version directement testable avec un groupe extérieur, sans demander à l'organisateur de surveiller manuellement les connexions ni d'envoyer un questionnaire séparé.

## Tutoriel

La scène **Répétition générale : la couronne disparue** dure environ deux à trois minutes. Chaque réplique contient un conseil destiné au comédien et, lorsque nécessaire, une réaction recommandée au public.

Le tutoriel apprend :

- la différence entre didascalie, intention et texte à dire ;
- le passage de parole en duo ;
- les réactions positives ;
- la tomate ;
- la récupération d'un incident ;
- la construction d'une conclusion ;
- le questionnaire de fin.

## Salon et état prêt

Chaque joueur doit confirmer qu'il est prêt. Le lancement reste bloqué tant que :

- un comédien manque ;
- un comédien est déconnecté ;
- un comédien n'est pas prêt ;
- aucun membre du public n'est présent ;
- un joueur connecté n'est pas prêt.

## Reconnexion et remplacement

Chaque participant reçoit un code de reprise à six caractères. Avec le code de salle, le pseudo exact et ce code, il peut reprendre sa place depuis un autre onglet ou appareil.

Une déconnexion de comédien met automatiquement les phases chronométrées en pause. La partie reprend lorsqu'il se reconnecte. L'hôte peut aussi promouvoir un membre du public connecté pour remplacer le comédien absent.

## Feedback intégré

Après le verdict, chaque participant répond à cinq questions fermées :

- compréhension du rôle ;
- compréhension de l'action à effectuer ;
- adéquation de la durée ;
- amusement produit par les perturbations ;
- envie de rejouer.

Une question libre facultative collecte le moment mémorable de la partie.

## Rapport de playtest

L'hôte peut exporter un JSON contenant :

- version et histoire ;
- format solo ou duo ;
- nombre de participants ;
- durée ;
- progression ;
- réactions jouées ;
- récupérations ;
- passages forcés ;
- déconnexions ;
- score final ;
- moyennes des réponses ;
- réponses anonymisées.

Le rapport ne contient pas les pseudos et aucun audio n'est enregistré.
