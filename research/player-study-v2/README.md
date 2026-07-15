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
- [`analysis-guide.md`](analysis-guide.md) — priorités d'analyse et règles de lecture recommandées ;
- [`google-forms/Code.gs`](google-forms/Code.gs) — moteur de création du formulaire et du classeur ;
- [`google-forms/Bootstrap.gs`](google-forms/Bootstrap.gs) — assemblage sûr des sections ;
- [`google-forms/Questions_01_25.gs`](google-forms/Questions_01_25.gs) — questions 1 à 25 ;
- [`google-forms/Questions_26_51.gs`](google-forms/Questions_26_51.gs) — questions 26 à 51.

## Créer le Google Form

1. Ouvrir Google Apps Script et créer un projet vide.
2. Conserver le fichier `Code.gs` créé automatiquement et remplacer son contenu par celui de `google-forms/Code.gs`.
3. Ajouter trois nouveaux fichiers de script avec le bouton **+** :
   - `Bootstrap` ;
   - `Questions_01_25` ;
   - `Questions_26_51`.
4. Copier dans chacun le contenu du fichier `.gs` correspondant du dépôt.
5. Exécuter d'abord `validateQuestionnaireDefinition`.
6. Vérifier que le journal indique **51 questions dans 11 sections**.
7. Exécuter `createPlayerStudyQuestionnaire`.
8. Accepter les autorisations demandées.
9. Consulter le journal d'exécution pour récupérer :
   - le lien d'édition du formulaire ;
   - le lien public ;
   - le classeur de réponses.

Le script crée d'abord les onglets **Guide d'analyse** et **Dictionnaire des questions**, puis relie le formulaire au classeur. Il ne tente jamais de figer, fusionner ou restructurer l'onglet de réponses généré par Google Forms.

## Fonctions disponibles

- `createPlayerStudyQuestionnaire()` — crée un nouveau formulaire et son classeur ;
- `showLastCreatedLinks()` — réaffiche les liens de la dernière création ;
- `validateQuestionnaireDefinition()` — vérifie la structure sans créer de formulaire.

Chaque exécution de la fonction principale crée une nouvelle étude. Les identifiants de la dernière création sont mémorisés dans les propriétés du projet Apps Script.

## Résultat créé automatiquement

- un Google Form en onze sections avec barre de progression ;
- 51 questions principalement fermées ;
- des limites de cinq choix sur les sélections prioritaires ;
- aucune collecte automatique d'adresse e-mail ;
- un Google Sheets lié aux réponses ;
- un onglet de guide d'analyse ;
- un dictionnaire des questions indiquant les éléments prioritaires.

## Durée cible

La durée estimée est de **10 à 15 minutes**. Les questions libres et les informations personnelles facultatives peuvent être laissées vides.
