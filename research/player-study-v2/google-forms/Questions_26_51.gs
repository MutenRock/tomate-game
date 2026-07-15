function getStudySections26_51_() {
  return [
    section('6. Personnages non-joueurs et intelligence artificielle', [
      grid(26, 'À quel point ces utilisations de personnages non-joueurs vous intéressent-elles ?', [
        'Compléter automatiquement un groupe incomplet', 'Remplacer temporairement un joueur déconnecté',
        'Donner des informations ou des objectifs au groupe', 'Jouer des personnages secondaires',
        'Perturber ou tromper les joueurs', 'Servir d’adversaires',
        'Réagir aux décisions du groupe', 'Adapter la difficulté à la performance des joueurs'
      ], ['Pas du tout', 'Peu', 'Neutre', 'Beaucoup', 'Énormément']),
      mc(27, 'Un personnage contrôlé par le jeu devrait-il pouvoir remplacer un joueur absent ?', [
        'Oui, pour tous les rôles', 'Oui, uniquement pour les rôles secondaires',
        'Oui, mais uniquement temporairement', 'Non, la partie devrait attendre le joueur',
        'Non, le rôle devrait être donné à un autre joueur', 'Je n’ai pas de préférence'
      ]),
      mc(28, 'Quelle place une intelligence artificielle devrait-elle avoir ?', [
        'Aucune : tout doit être écrit et prévu à l’avance',
        'Générer uniquement des variations de texte ou de situation',
        'Adapter la difficulté et les événements', 'Jouer certains personnages secondaires',
        'Remplacer des joueurs absents', 'Générer une grande partie des scénarios',
        'Je ne fais pas spécialement de différence si le résultat est bon'
      ])
    ]),

    section('7. Public, spectateurs et perturbations', [
      checkbox(29, 'Dans un jeu où certains joueurs observent temporairement les autres, que devraient-ils pouvoir faire ?', [
        'Donner des encouragements', 'Donner des indices', 'Déclencher des effets visuels',
        'Déclencher des effets sonores', 'Imposer temporairement une émotion ou une contrainte',
        'Voter pour la suite de la partie', 'Modifier certaines règles',
        'Gagner des ressources en observant', 'Préparer leur prochain rôle',
        'Ne rien faire et simplement regarder', 'Il ne devrait jamais y avoir de spectateurs'
      ]),
      mc(30, 'Comment préférez-vous que les perturbations soient distribuées ?', [
        'Très rares, mais importantes', 'Régulières et faciles à comprendre',
        'Fréquentes, mais peu gênantes', 'Très nombreuses et chaotiques',
        'Adaptées automatiquement au niveau du groupe', 'Réglables par l’hôte'
      ]),
      scale(31, 'Quelle quantité de chaos recherchez-vous ?', 1, 7,
        'Partie très contrôlée et prévisible', 'Accidents fréquents et chaos presque permanent'),
      checkbox(32, 'Quelles perturbations vous paraissent amusantes ?', [
        'Une partie de l’interface est temporairement masquée',
        'Une émotion ou une manière de parler est imposée', 'Un mot devient temporairement interdit',
        'Un effet sonore interrompt la communication',
        'Une information importante apparaît uniquement chez un joueur',
        'Les rôles sont temporairement inversés', 'Le groupe reçoit un nouvel objectif inattendu',
        'Un joueur doit mentir ou cacher une information', 'Un compte à rebours est raccourci',
        'Un spectateur peut aider le joueur ciblé', 'Le groupe doit intégrer l’incident dans son action',
        'Un événement rare transforme complètement la manche'
      ], true, 5, 'Sélectionnez cinq réponses maximum.'),
      checkbox(33, 'Quelles situations vous sembleraient injustes ou frustrantes ?', [
        'Ne plus pouvoir lire ou voir les informations', 'Être ciblé plusieurs fois de suite',
        'Être perturbé sans pouvoir réagir', 'Perdre immédiatement à cause d’un autre joueur',
        'Ne pas comprendre qui a déclenché un effet', 'Ne pas connaître la durée de l’effet',
        'Être obligé de jouer un rôle très exposé', 'Attendre longtemps avant de rejouer',
        'Pouvoir être volontairement harcelé par le groupe',
        'Aucun de ces éléments ne me dérange particulièrement'
      ])
    ]),

    section('8. Histoires, lecture et improvisation', [
      mc(34, 'Quelle quantité de texte seriez-vous prêt à lire à voix haute pendant une partie ?', [
        'Quelques mots ou une phrase courte', 'Deux ou trois phrases', 'Un petit paragraphe',
        'Plusieurs paragraphes répartis dans la partie', 'Une histoire complète de plusieurs minutes',
        'Je préfère ne pas avoir à lire à voix haute'
      ]),
      mc(35, 'Quelle durée vous semblerait adaptée pour une petite histoire jouée par plusieurs personnes ?', [
        'Moins de 2 minutes', '2 à 4 minutes', '4 à 6 minutes', '6 à 10 minutes',
        '10 à 15 minutes', 'Plus de 15 minutes'
      ]),
      mc(36, 'Quel équilibre préférez-vous entre texte écrit et improvisation ?', [
        'Presque uniquement du texte écrit', 'Principalement du texte avec quelques libertés',
        'Un équilibre entre texte et improvisation',
        'Principalement de l’improvisation avec quelques repères',
        'Improvisation presque totale', 'Je n’ai pas de préférence'
      ]),
      checkbox(37, 'Quelles informations devraient être clairement séparées à l’écran ?', [
        'Le texte à lire', 'Les actions à effectuer', 'L’émotion ou l’intention',
        'Le nom du personnage qui parle', 'Le joueur qui doit agir', 'Les informations secrètes',
        'La prochaine action à préparer', 'Le temps restant', 'Les perturbations en cours',
        'La personne ayant déclenché une perturbation'
      ]),
      grid(38, 'À quel point ces aides vous paraissent-elles importantes ?', [
        'Un tutoriel très court avant la première partie', 'Une scène d’entraînement',
        'Une indication très visible du tour de parole',
        'Une explication claire de ce qui doit être lu ou non',
        'Un aperçu de la prochaine intervention', 'Un rappel de la phrase précédente',
        'Une confirmation avant le démarrage', 'Un bouton permettant de mettre la partie en pause',
        'Un système permettant de reprendre sa place après une déconnexion'
      ], ['Inutile', 'Peu importante', 'Moyennement importante', 'Importante', 'Indispensable'])
    ]),

    section('9. Rejouabilité et contenu', [
      checkbox(39, 'Qu’est-ce qui vous donnerait envie de rejouer ?', [
        'Découvrir de nouvelles histoires', 'Changer régulièrement de rôle',
        'Jouer avec des groupes différents', 'Voir des événements aléatoires',
        'Débloquer de nouveaux scénarios', 'Obtenir des récompenses esthétiques',
        'Améliorer un score collectif', 'Comparer les résultats avec d’autres groupes',
        'Créer ses propres histoires', 'Télécharger des histoires créées par la communauté',
        'Rejouer la même histoire avec des contraintes différentes',
        'Découvrir plusieurs conclusions possibles'
      ], true, 5, 'Sélectionnez cinq réponses maximum.'),
      mc(40, 'Comment préférez-vous que les histoires soient proposées ?', [
        'Une sélection entièrement aléatoire', 'Le groupe choisit librement',
        'Plusieurs propositions sont tirées au hasard', 'Les histoires se débloquent progressivement',
        'Une campagne suit un ordre précis', 'Plusieurs de ces systèmes'
      ]),
      mc(41, 'À quel point la création de contenu par les joueurs vous intéresse-t-elle ?', [
        'Pas du tout', 'Peu', 'Moyennement', 'Beaucoup', 'Énormément',
        'Je préfère seulement jouer aux créations des autres'
      ])
    ]),

    section('10. Format technique et commercial', [
      mc(42, 'À quel point le jeu multiplateforme est-il important pour votre groupe ?', [
        'Pas important', 'Peu important', 'Moyennement important', 'Très important', 'Indispensable'
      ]),
      mc(43, 'Seriez-vous prêt à utiliser votre téléphone comme écran ou contrôleur secondaire pendant une partie sur PC ou console ?', [
        'Oui, sans problème', 'Oui, si aucune application ne doit être installée',
        'Oui, uniquement pour certains rôles', 'Peut-être',
        'Non, je préfère tout faire sur la même plateforme'
      ]),
      mc(44, 'Quel modèle commercial vous conviendrait le mieux ?', [
        'Un seul joueur achète le jeu et invite les autres gratuitement',
        'Chaque joueur achète sa propre copie', 'Jeu gratuit avec contenu additionnel payant',
        'Jeu gratuit avec éléments cosmétiques payants',
        'Abonnement donnant accès à de nouvelles histoires',
        'Jeu de base payant avec extensions', 'Je n’ai pas de préférence'
      ]),
      mc(45, 'Quel prix vous semblerait raisonnable si un seul joueur devait acheter le jeu pour tout son groupe ?', [
        'Moins de 5 €', 'Entre 5 € et 10 €', 'Entre 10 € et 15 €',
        'Entre 15 € et 20 €', 'Entre 20 € et 30 €', 'Plus de 30 €', 'Je ne sais pas'
      ])
    ]),

    section('11. Synthèse', [
      checkbox(46, 'Quels éléments vous donnent le plus envie ?', [
        'Coopérer avec des rôles différents', 'Jouer une histoire avec mes amis',
        'Improviser face aux erreurs', 'Perturber les autres joueurs',
        'Être au centre de l’action', 'Aider un joueur depuis un rôle de soutien',
        'Observer et influencer la partie', 'Découvrir des objectifs secrets',
        'Participer à des parties courtes', 'Créer des moments drôles à raconter ensuite',
        'Découvrir de nouvelles histoires', 'Pouvoir jouer avec des groupes de tailles différentes'
      ], true, 5, 'Sélectionnez cinq réponses maximum.'),
      checkbox(47, 'Quels éléments pourraient vous empêcher d’essayer ce type de jeu ?', [
        'Devoir parler dans un micro', 'Devoir lire à voix haute', 'Devoir improviser',
        'Être observé par les autres', 'Dépendre fortement du groupe',
        'Ne pas pouvoir choisir mon rôle', 'Parties trop longues', 'Temps d’attente important',
        'Interface difficile à comprendre', 'Trop de texte', 'Trop de chaos ou de hasard',
        'Risque de sabotage ou de harcèlement', 'Difficulté à réunir suffisamment de joueurs',
        'Utilisation obligatoire d’un téléphone', 'Aucun de ces éléments'
      ]),
      scale(48, 'À quel point auriez-vous envie d’essayer une expérience combinant coopération, rôles asymétriques, histoires et perturbations entre joueurs ?',
        1, 10, 'Aucune envie', 'Très forte envie'),
      mc(49, 'Après une bonne partie, quelle sensation aimeriez-vous principalement ressentir ?', [
        'La satisfaction d’avoir parfaitement réussi', 'La fierté d’avoir bien coopéré',
        'Le plaisir d’avoir improvisé une solution',
        'Le souvenir d’une situation complètement absurde', 'L’envie de rejouer immédiatement',
        'Le sentiment d’avoir vécu une véritable histoire', 'La sensation d’avoir surpris mes amis'
      ]),
      paragraph(50, 'Quelle mécanique multijoueur aimeriez-vous voir davantage dans les jeux de groupe ?', false),
      paragraph(51, 'Avez-vous une remarque, une crainte ou une idée concernant ce type d’expérience ?', false)
    ])
  ];
}
