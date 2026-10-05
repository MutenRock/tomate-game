# Rôles

## Comédien

### Responsabilités

- lire ou improviser ;
- respecter les intentions ;
- réagir aux autres comédiens ;
- intégrer les incidents ;
- préserver la continuité de la scène.

### Interface

- prompteur ;
- nom du personnage ;
- émotion actuelle ;
- objectif public ;
- objectif secret ;
- ordre du metteur en scène ;
- état du micro.

### Contraintes possibles

- utiliser un mot précis ;
- cacher une information ;
- changer d'émotion après un signal ;
- mentir à un autre personnage ;
- finir la scène avec un objet particulier.

## Régisseur

### Responsabilités

- gérer les micros ;
- lancer les lumières ;
- jouer les sons et musiques ;
- ouvrir ou fermer le rideau ;
- déclencher les effets ;
- suivre les cues.

### Sources de tension

- commandes proches ;
- délais d'activation ;
- équipements temporairement indisponibles ;
- instructions ambiguës ;
- surcharge de demandes ;
- objectifs secrets.

## Bruiteur / Foley — rôle expérimental

Piste de rôle distinct du régisseur : un joueur est chargé de **fabriquer lui-même les effets sonores de la scène avec son microphone**.

L'intérêt n'est pas d'obtenir des bruitages professionnels. Au contraire, des sons artisanaux, imparfaits ou légèrement absurdes peuvent devenir une partie importante du spectacle.

### Boucle envisagée

Pendant une courte phase de préparation, le bruiteur reçoit une liste de sons dont la scène aura besoin, par exemple :

- une porte qui claque ;
- des pas inquiétants ;
- un téléphone ;
- un coup de tonnerre ;
- une alarme ;
- un animal ;
- une foule ;
- un objet qui se casse.

Il dispose de quelques secondes pour les enregistrer avec sa voix ou des objets autour de lui.

Pendant la représentation :

- le jeu lui indique les cues à venir ;
- il déclenche les sons enregistrés au bon moment ;
- certains cues peuvent arriver très vite ou être ambigus ;
- un mauvais son n'interrompt pas la scène : les comédiens doivent l'intégrer ;
- certaines perturbations peuvent échanger deux sons, masquer leur nom ou imposer un bruitage improvisé en direct.

### Pourquoi cela peut être drôle

Exemples :

- une explosion enregistrée avec la bouche doit devenir un événement dramatique crédible ;
- le bruit de cheval ressemble clairement à deux noix frappées sur une table ;
- le bruiteur lance accidentellement une sonnette à la place du tonnerre et les comédiens doivent expliquer pourquoi quelqu'un sonne à la porte ;
- un joueur doit enregistrer un monstre sans savoir à quoi il ressemblera dans la scène ;
- le public peut demander une variation : « plus dramatique », « minuscule », « sous l'eau », etc.

Cette mécanique transforme un défaut de production en matière de jeu : **le mauvais bruitage crée une situation à récupérer**.

### Variantes à tester

- **Foley préparé** : 4 à 6 sons enregistrés avant le lever de rideau ;
- **Foley live** : certains sons doivent être produits directement au micro au moment du cue ;
- **Banque mystère** : le bruiteur enregistre les sons sans connaître leur utilisation future ;
- **Mauvaise étiquette** : les boutons sont volontairement mélangés pendant quelques secondes ;
- **Public réalisateur** : le public vote pour le style du prochain son ;
- **Duo régie + bruiteur** : un joueur crée les sons, un autre choisit quand les lancer.

### Intérêt produit

Cette piste pourrait :

- créer un rôle de coulisses très actif sans demander de lire une longue scène ;
- donner une responsabilité forte à un joueur qui ne veut pas être comédien ;
- produire naturellement des moments mémorables et partageables ;
- rendre chaque groupe différent grâce aux sons qu'il fabrique lui-même ;
- enrichir plus tard le rôle complet de régisseur.

### Risques et garde-fous

Cette idée implique un changement important par rapport au prototype actuel, qui n'enregistre aucun audio.

Avant toute implémentation :

- demander explicitement l'autorisation d'utiliser le microphone ;
- indiquer clairement quand l'enregistrement commence et s'arrête ;
- privilégier des clips courts ;
- conserver les enregistrements localement et temporairement par défaut ;
- fournir un bouton de suppression immédiate ;
- ne jamais enregistrer automatiquement toute la conversation vocale ;
- éviter d'envoyer ou conserver les fichiers sur un serveur sans décision produit et information explicite des joueurs ;
- prévoir une alternative sans microphone.

**Statut : backlog expérimental.** À tester après validation de la boucle principale, pas comme prérequis du prototype v0.3.1.

## Metteur en scène

### Avant la représentation

- définir les entrées et sorties ;
- placer les acteurs ;
- choisir le ton ;
- identifier les moments essentiels ;
- répartir les objectifs.

### Pendant la représentation

Il ne contrôle pas directement les joueurs. Il envoie des indications courtes :

- ENTRE ;
- SORS ;
- PLUS TRISTE ;
- GAGNE DU TEMPS ;
- IMPROVISE ;
- VA À GAUCHE ;
- ACCUSE-LE ;
- CONCLUS.

Le nombre d'indications simultanées doit être limité.

## Accessoiriste

- prépare les accessoires ;
- les donne au bon personnage ;
- remplace un objet manquant ;
- déclenche des éléments physiques du décor ;
- improvise avec un inventaire incomplet.

## Souffleur

- surveille la progression ;
- retrouve une réplique perdue ;
- envoie un mot-clé ;
- aide un comédien bloqué ;
- possède un nombre limité d'interventions.

## Maître de cérémonie

- présente le thème ;
- lance les manches ;
- explique les incidents ;
- anime le verdict ;
- peut être humain, automatisé ou incarné par une IA.

## Public

Le public possède :

- une main de réactions ;
- une ressource limitée ;
- des votes ;
- des objectifs individuels éventuels ;
- un pouvoir de récompense ;
- un impact sur le verdict.

Le public ne doit jamais être réduit à un simple chat.
