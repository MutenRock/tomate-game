# Contribuer à Tomate !

## Avant de coder

1. Lire [`AGENTS.md`](AGENTS.md).
2. Lire [`docs/CURRENT_STATE.md`](docs/CURRENT_STATE.md).
3. Vérifier les derniers commits de `main`.
4. Vérifier la [roadmap](docs/07-roadmap.md) et les [décisions produit](docs/15-product-decisions.md).
5. Ouvrir ou choisir une issue si le travail dépasse une petite correction évidente.
6. Décrire le comportement attendu avant l'implémentation.
7. Protéger la boucle principale : préparation, représentation, réactions, récupération, verdict.

En cas de contradiction entre une ancienne documentation et le code actif, vérifier d'abord `package.json`, `server/`, `public/` et `docs/CURRENT_STATE.md`.

Ne pas développer dans `tomate-game-prototype-v1/` : ce dossier est un snapshot historique. Le projet actif se trouve à la racine.

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

## Validation

Avant une fusion :

```bash
npm run check
npm run smoke
```

`npm run smoke` est particulièrement important lorsque `server/`, `public/`, `content/` ou les parcours de session sont modifiés.

## Definition of Done

Une fonctionnalité est terminée lorsqu'elle :

- possède un comportement testable ;
- ne rend pas la représentation illisible sans contre-jeu ;
- fonctionne au clavier et sur écran tactile si elle vise le public ;
- conserve un serveur autoritaire pour les règles critiques ;
- documente ses effets réseau si elle modifie la synchronisation ;
- respecte l'anonymisation des rapports de playtest ;
- met à jour `docs/CURRENT_STATE.md` si l'état fonctionnel change ;
- met à jour la roadmap ou les décisions produit uniquement lorsque cela est réellement nécessaire ;
- passe `npm run check` et `npm run smoke`.
