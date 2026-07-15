# Étude joueurs V2 — multijoueur social et chaotique

Ce dossier contient une étude plus longue destinée à orienter les décisions de conception de **Tomate !** avant d'ajouter de nouveaux rôles ou de nouvelles couches techniques.

## Objectifs

L'étude cherche principalement à mesurer :

- les tailles de groupe et durées de session pertinentes ;
- l'acceptabilité du vocal, de la lecture et de l'improvisation ;
- l'attractivité respective des rôles exposés, de soutien, techniques et de public ;
- la quantité de chaos souhaitée et les limites perçues comme injustes ;
- l'intérêt pour les informations cachées, les objectifs personnels et les PNJ ;
- les attentes concernant le tutoriel, l'interface et la reprise après déconnexion ;
- les facteurs de rejouabilité, le multiplateforme et le modèle commercial.

## Fichiers

- [`questionnaire.md`](questionnaire.md) — version humaine complète, prête à relire ou adapter ;
- [`Code.gs`](Code.gs) — script Google Apps Script créant automatiquement le Google Form et son classeur de réponses ;
- [`analysis-guide.md`](analysis-guide.md) — priorités d'analyse et règles de lecture recommandées.

## Créer le Google Form

1. Ouvrir [Google Apps Script](https://script.google.com/).
2. Créer un projet vide.
3. Remplacer le contenu de `Code.gs` par celui de ce dossier.
4. Exécuter `createPlayerStudyQuestionnaire`.
5. Accepter les autorisations demandées.
6. Consulter le journal d'exécution pour récupérer :
   - le lien d'édition du formulaire ;
   - le lien public ;
   - le classeur de réponses.

Le script crée d'abord les onglets **Guide d'analyse** et **Dictionnaire des questions**, puis relie le formulaire au classeur. Il ne tente jamais de figer, fusionner ou restructurer l'onglet de réponses généré par Google Forms.

## Fonctions disponibles

- `createPlayerStudyQuestionnaire()` — crée un nouveau formulaire et son classeur ;
- `showLastCreatedLinks()` — réaffiche les liens de la dernière création ;
- `validateQuestionnaireDefinition()` — vérifie la structure sans créer de formulaire.

Chaque exécution de la fonction principale crée une nouvelle étude. Les identifiants de la dernière création sont mémorisés dans les propriétés du projet Apps Script.

## Durée cible

Le questionnaire contient **51 questions** réparties en onze sections. La durée estimée est de **10 à 15 minutes**. Les réponses libres sont facultatives.
