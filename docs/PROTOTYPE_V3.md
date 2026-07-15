# Prototype multijoueur V0.3

## Objectif

La V0.3 cherche à valider une boucle plus proche d'une véritable scène : une histoire suffisamment longue pour créer un début, un conflit, une évolution et une conclusion, jouable par un ou deux comédiens devant un public actif.

## Deux formats de distribution

### Un comédien

Le même joueur interprète les deux personnages. L'interface indique clairement le personnage actif à chaque réplique. Ce format permet de tester le jeu avec seulement un comédien et un membre du public.

### Deux comédiens

Chaque joueur reçoit :

- son propre personnage ;
- une mission publique ;
- un objectif secret ;
- uniquement les contrôles correspondant à son tour de parole ;
- un aperçu de sa prochaine intervention pendant le tour de l'autre joueur.

Le serveur décide quel comédien peut valider la réplique. L'hôte conserve un bouton de passage forcé en cas de problème.

## Nouvelle hiérarchie de lecture

L'écran comédien sépare volontairement les informations :

1. **Didascalie — ne pas lire** : action physique ou placement ;
2. **Intention de jeu** : émotion, rythme ou posture ;
3. **Texte à dire à voix haute** : seule zone destinée à être lue ;
4. **Après la réplique** : action à effectuer avant de passer la parole ;
5. **Repère de scène** : moment favorable aux réactions ou indication de rythme.

Une bannière très visible affiche soit **À toi — lis maintenant**, soit **Attends — l'autre comédien parle**.

## Contenu

La V0.3 contient six histoires longues :

- Le procès de la dernière part ;
- Le signal de la laverie orbitale ;
- La dernière assemblée des fantômes ;
- La période d'essai du vampire ;
- Le dîner avant la fin du monde ;
- Le protocole des appareils amoureux.

Chaque histoire comporte quatre actes et entre quinze et dix-sept répliques. La durée cible est de six à huit minutes selon le rythme de lecture et les réactions du public.

## Changements techniques

- `actorSlots` permet de configurer une salle pour un ou deux comédiens ;
- `actorIds` associe les joueurs aux deux personnages ;
- chaque ligne de scénario possède un identifiant de personnage ;
- les perturbations ciblent le comédien actuellement actif ;
- le serveur refuse qu'un joueur valide la réplique de l'autre ;
- le verdict ajoute un score de duo ou d'interprétation solo ;
- le smoke test exécute une partie solo puis une partie duo complète.

## Limites connues

- la voix reste externe au jeu ;
- aucune détection automatique de lecture ;
- les joueurs déconnectés restent présents dans la salle ;
- le second comédien ne peut pas encore être remplacé pendant une représentation ;
- le public cible automatiquement le personnage actif ;
- les histoires sont écrites à l'avance et non générées en direct.
