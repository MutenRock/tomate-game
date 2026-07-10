# Contribuer à Tomate !

## Avant de coder

1. Vérifier la [roadmap](docs/07-roadmap.md).
2. Ouvrir ou choisir une issue.
3. Décrire le comportement attendu avant l'implémentation.
4. Protéger la boucle principale : préparation, représentation, réactions, verdict.

## Branches

- `main` : état stable du projet ;
- `feat/<sujet>` : nouvelle fonctionnalité ;
- `fix/<sujet>` : correction ;
- `docs/<sujet>` : documentation ;
- `experiment/<sujet>` : prototype jetable.

## Commits

Format conseillé :

```text
type(scope): description
```

Exemples :

```text
feat(audience): add tomato readability penalty
docs(modes): describe asynchronous relay mode
fix(stage): preserve current cue after reconnect
```

## Definition of Done

Une fonctionnalité est terminée lorsqu'elle :

- possède un comportement testable ;
- ne rend pas la représentation illisible sans contre-jeu ;
- fonctionne au clavier et sur écran tactile si elle vise le public ;
- décrit ses événements réseau si elle est multijoueur ;
- met à jour la documentation concernée.
