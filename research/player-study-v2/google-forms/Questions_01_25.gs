function getStudySections01_25_() {
  return [
    section('1. Informations générales', [
      text(1, 'Quel pseudo souhaitez-vous utiliser ?', false),
      mc(2, 'Quelle est votre tranche d’âge ?', [
        'Moins de 16 ans', '16–17 ans', '18–24 ans', '25–34 ans', '35–44 ans',
        '45–54 ans', '55 ans ou plus', 'Je préfère ne pas répondre'
      ]),
      mc(3, 'Comment définissez-vous votre genre ?', [
        'Femme', 'Homme', 'Non-binaire', 'Genre fluide', 'Agenre', 'Je préfère ne pas répondre'
      ], false, true),
      mc(4, 'Quelle est votre plateforme de jeu principale ?', [
        'PC', 'PlayStation', 'Xbox', 'Nintendo Switch',
        'Steam Deck ou autre console portable', 'Smartphone ou tablette', 'Autre'
      ]),
      checkbox(5, 'Sur quelles autres plateformes jouez-vous régulièrement ?', [
        'PC', 'PlayStation', 'Xbox', 'Nintendo Switch',
        'Steam Deck ou autre console portable', 'Smartphone ou tablette', 'Aucune autre plateforme'
      ], false)
    ]),

    section('2. Habitudes multijoueurs', [
      mc(6, 'À quelle fréquence jouez-vous à des jeux multijoueurs ?', [
        'Tous les jours ou presque', 'Plusieurs fois par semaine', 'Environ une fois par semaine',
        'Quelques fois par mois', 'Rarement', 'Jamais ou presque'
      ]),
      mc(7, 'Avec qui jouez-vous principalement ?', [
        'Toujours avec le même groupe d’amis', 'Avec plusieurs groupes d’amis',
        'Avec des amis et parfois des inconnus', 'Principalement avec des inconnus',
        'Principalement avec ma famille ou mon/ma partenaire', 'Je joue rarement en multijoueur'
      ]),
      mc(8, 'Combien de joueurs composent habituellement votre groupe ?', [
        '2 joueurs', '3 joueurs', '4 joueurs', '5 à 6 joueurs', '7 à 10 joueurs',
        'Plus de 10 joueurs', 'Cela varie beaucoup'
      ]),
      checkbox(9, 'Quelles tailles de groupe vous paraissent adaptées à un jeu multijoueur fun ?', [
        '2 joueurs', '3 joueurs', '4 joueurs', '5 à 6 joueurs', '7 à 8 joueurs',
        '9 à 12 joueurs', 'Plus de 12 joueurs', 'Le jeu devrait s’adapter automatiquement au groupe'
      ]),
      mc(10, 'Quelle durée préférez-vous pour une partie ou une mission ?', [
        'Moins de 10 minutes', '10 à 20 minutes', '20 à 30 minutes', '30 à 45 minutes',
        '45 à 60 minutes', 'Plus d’une heure', 'Cela dépend du mode de jeu'
      ]),
      mc(11, 'Quelle durée préférez-vous pour une soirée complète sur un même jeu ?', [
        'Moins de 30 minutes', '30 à 60 minutes', '1 à 2 heures', '2 à 3 heures',
        'Plus de 3 heures', 'Je ne regarde pas vraiment la durée'
      ]),
      checkbox(12, 'Parmi ces types de jeux, lesquels appréciez-vous ?', [
        'Jeux coopératifs', 'Jeux compétitifs', 'Party games', 'Jeux d’horreur multijoueurs',
        'Jeux d’exploration', 'Jeux narratifs', 'Jeux d’improvisation ou de rôle',
        'Jeux de gestion ou de coordination', 'Jeux avec des rôles asymétriques',
        'Jeux où les erreurs provoquent des situations amusantes', 'Aucun de ces types'
      ])
    ]),

    section('3. Communication et confort social', [
      mc(13, 'Quelle importance accordez-vous au chat vocal ?', [
        'Indispensable au gameplay', 'Très important', 'Utile, mais pas obligatoire',
        'Je préfère pouvoir jouer sans parler', 'Je n’utilise presque jamais de chat vocal'
      ]),
      mc(14, 'Quelle solution vocale préférez-vous ?', [
        'Chat vocal directement intégré au jeu', 'Discord ou une autre application externe',
        'Les deux possibilités', 'Le vocal ne devrait jamais être obligatoire', 'Je n’ai pas de préférence'
      ]),
      grid(15, 'À quel point êtes-vous à l’aise avec les situations suivantes ?', [
        'Parler devant un groupe d’amis', 'Lire un texte à voix haute', 'Improviser quelques phrases',
        'Jouer un personnage', 'Être observé pendant que je joue',
        'Prendre temporairement la direction du groupe', 'Dépendre fortement des actions des autres',
        'Faire une erreur visible devant les autres', 'Jouer avec des personnes que je ne connais pas',
        'Utiliser ma voix de façon exagérée ou théâtrale'
      ], ['Pas du tout à l’aise', 'Peu à l’aise', 'Moyennement à l’aise', 'À l’aise', 'Très à l’aise']),
      mc(16, 'Dans un jeu multijoueur fun, une erreur devrait principalement…', [
        'Provoquer rapidement une défaite', 'Faire perdre des points sans arrêter la partie',
        'Créer une nouvelle difficulté à résoudre', 'Créer une situation drôle ou imprévue',
        'Dépendre du niveau de difficulté choisi'
      ])
    ]),

    section('4. Organisation du gameplay', [
      mc(17, 'Quel type de multijoueur préférez-vous ?', [
        'Entièrement coopératif', 'Coopératif avec un classement individuel',
        'Coopératif avec de petits objectifs personnels', 'Deux équipes qui s’affrontent',
        'Chacun pour soi', 'Plusieurs modes différents'
      ]),
      mc(18, 'Comment préférez-vous que les joueurs agissent ?', [
        'Tous en même temps', 'Chacun leur tour', 'Certains jouent pendant que les autres les aident',
        'Certains jouent pendant que les autres les perturbent', 'Un mélange de plusieurs systèmes',
        'Je n’ai pas de préférence'
      ]),
      mc(19, 'Comment préférez-vous que les rôles soient organisés ?', [
        'Tous les joueurs ont les mêmes capacités', 'Les joueurs choisissent parmi quelques classes similaires',
        'Chaque joueur possède un rôle très différent', 'Les rôles changent régulièrement',
        'Les rôles sont tirés au hasard', 'Plusieurs options devraient être disponibles'
      ]),
      mc(20, 'Comment préférez-vous obtenir votre rôle ?', [
        'Je choisis toujours mon rôle', 'Je choisis parmi plusieurs rôles proposés',
        'Le groupe attribue les rôles', 'Le jeu attribue automatiquement les rôles',
        'Les rôles sont aléatoires', 'Cela ne me dérange pas tant qu’ils changent régulièrement'
      ]),
      mc(21, 'Que pensez-vous des informations cachées entre joueurs ?', [
        'Je préfère que tout le monde possède les mêmes informations',
        'Quelques informations cachées peuvent être intéressantes',
        'Chaque rôle devrait posséder des informations différentes',
        'J’aime ne jamais savoir complètement ce que préparent les autres', 'Je n’ai pas de préférence'
      ]),
      grid(22, 'À quel point ces mécaniques vous paraissent-elles intéressantes ?', [
        'Chaque joueur possède une responsabilité différente',
        'Certains joueurs ont des informations que les autres ne voient pas',
        'Les rôles tournent entre les manches',
        'Des objectifs personnels secrets existent en plus de l’objectif commun',
        'Un joueur peut temporairement compliquer la tâche du groupe',
        'Un joueur central dépend des informations transmises par les autres',
        'Le groupe doit improviser lorsqu’un plan échoue',
        'Une erreur peut modifier la suite de la partie',
        'Les joueurs éliminés ou en attente peuvent encore participer',
        'Le jeu adapte ses règles au nombre de joueurs'
      ], ['Pas du tout intéressante', 'Peu intéressante', 'Neutre', 'Intéressante', 'Très intéressante'])
    ]),

    section('5. Types de rôles', [
      grid(23, 'À quel point aimeriez-vous jouer chacun de ces types de rôles ?', [
        'Le joueur au centre de l’action', 'Un joueur chargé de lire ou interpréter des informations',
        'Un soutien qui aide les autres à réussir', 'Un joueur qui contrôle des outils ou des effets techniques',
        'Un coordinateur qui donne des indications au groupe', 'Un joueur disposant d’informations secrètes',
        'Un perturbateur qui provoque des incidents', 'Un membre du public pouvant réagir à la partie',
        'Un joueur chargé d’observer et de détecter les erreurs',
        'Un rôle secondaire plus calme et moins exposé'
      ], ['Je ne voudrais pas le jouer', 'Peu attirant', 'Neutre', 'Attirant', 'Très attirant']),
      mc(24, 'Souhaiteriez-vous pouvoir indiquer les rôles que vous ne voulez pas jouer ?', [
        'Oui, absolument', 'Oui, mais uniquement pour certains rôles très exposés',
        'Ce serait utile, mais pas indispensable', 'Non, je préfère accepter le rôle attribué',
        'Je n’ai pas de préférence'
      ]),
      mc(25, 'Combien de temps un joueur devrait-il conserver le même rôle ?', [
        'Une seule manche', 'Deux ou trois manches', 'Toute la session',
        'Jusqu’à ce qu’il demande à changer', 'Cela dépend du rôle', 'Je n’ai pas de préférence'
      ])
    ])
  ];
}
