# Format du contenu

Le contenu doit être sérialisable en JSON et indépendant du moteur d'affichage.

## Exemple de pièce

```json
{
  "id": "trial-last-pizza",
  "title": "Le procès de la dernière part",
  "theme": "Procès médiéval absurde",
  "durationSeconds": 180,
  "characters": [
    {
      "id": "king",
      "name": "Le Roi",
      "publicGoal": "Découvrir le voleur",
      "secretGoal": "Cacher qu'il est coupable"
    }
  ],
  "scenes": [
    {
      "id": "opening",
      "cues": [
        {
          "type": "line",
          "characterId": "king",
          "text": "Que le coupable se dénonce avant le coucher du soleil."
        },
        {
          "type": "effect",
          "effect": "thunder",
          "windowMs": 2500
        }
      ]
    }
  ]
}
```

## Entités principales

### Pack

Regroupe un univers, des thèmes, des personnages, des décors, des sons et des réactions.

### Pièce

Décrit une structure jouable, des scènes et des objectifs.

### Cue

Événement attendu :

- réplique ;
- entrée ;
- sortie ;
- lumière ;
- son ;
- accessoire ;
- changement d'émotion ;
- vote public.

### Incident

Événement qui perturbe la représentation.

### Réaction

Action du public avec coût, durée, cible et règles de cumul.

### Verdict

Ensemble des mesures et commentaires produits après la partie.

## Génération procédurale

La génération doit combiner des modules compatibles plutôt que demander à une IA d'écrire une pièce entière sans contraintes.

Exemple :

```text
structure + lieu + conflit + personnages + secrets + mots obligatoires
```

Les textes générés doivent ensuite être validés pour :

- longueur ;
- nombre de rôles ;
- langage ;
- lisibilité orale ;
- contenu sensible ;
- cohérence des identifiants ;
- durée estimée.
