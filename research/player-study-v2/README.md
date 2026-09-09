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
- [`google-forms/Bootstrap.gs`](google-forms/Bootstrap.gs) — assemblage des sections ;
- [`google-forms/Questions_01_25.gs`](google-forms/Questions_01_25.gs) — questions 1 à 25 ;
- [`google-forms/Questions_26_51.gs`](google-forms/Questions_26_51.gs) — questions 26 à 51.

## Créer le Google Form

**Les quatre fichiers `.gs` sont nécessaires dans le même projet Google Apps Script.**

1. Ouvrir Google Apps Script et créer un projet vide.
2. Conserver le fichier `Code.gs` créé automatiquement et remplacer son contenu par celui de `google-forms/Code.gs`.
3. Ajouter trois nouveaux fichiers de script avec le bouton **+** :
   - `Bootstrap` ;
   - `Questions_01_25` ;
   - `Questions_26_51`.
4. Copier dans chacun le contenu du fichier `.gs` correspondant du dépôt.
5. Vérifier dans la colonne de gauche que les quatre fichiers sont visibles.
6. Enregistrer le projet.
7. Exécuter d'abord `validateQuestionnaireDefinition`.
8. Vérifier que le journal indique **51 questions dans 11 sections**.
9. Exécuter `createPlayerStudyQuestionnaire`.
10. Accepter les autorisations demandées.
11. Consulter le journal d'exécution pour récupérer :
    - le lien d'édition du formulaire ;
    - le lien public ;
    - le classeur de réponses.

Le script crée d'abord les onglets **Guide d'analyse** et **Dictionnaire des questions**, puis relie le formulaire au classeur. Il ne tente jamais de figer, fusionner ou restructurer l'onglet de réponses généré par Google Forms.

## Dépannage

### `ReferenceError: getPlayerStudySections_ is not defined`

Cette erreur a été observée lors d'une installation manuelle.

Elle signifie que `Code.gs` est présent mais que **`Bootstrap.gs` n'a pas été ajouté correctement au projet Apps Script**, ou que son contenu n'a pas été copié / enregistré.

Vérifier que le projet Apps Script contient exactement les quatre scripts suivants :

```text
Code.gs
Bootstrap.gs
Questions_01_25.gs
Questions_26_51.gs
```

Puis exécuter :

```javascript
validateQuestionnaireDefinition()
```

avant de relancer la création du formulaire.

### Erreur sur `getStudySections01_25_` ou `getStudySections26_51_`

Le fichier de questions correspondant manque ou n'a pas été copié correctement.

### Note pour une future amélioration

Le système multi-fichiers est pratique à maintenir dans Git mais augmente le risque d'erreur lors du copier-coller dans Apps Script. Une future évolution utile serait de fournir également une **version autonome mono-fichier** générée à partir de ces sources.

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
