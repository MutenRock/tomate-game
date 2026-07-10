# Roadmap

La roadmap sépare la validation du plaisir de jeu de la complexité réseau. Une phase ne doit pas être considérée comme terminée uniquement parce que son code existe : elle doit aussi avoir été testée avec des joueurs.

## Phase 0 — Cadrage

- [x] Définir le pitch.
- [x] Choisir le nom **Tomate !**.
- [x] Lister les modes.
- [x] Définir les rôles.
- [x] Définir les principes du public.
- [x] Créer le dépôt.
- [x] Écrire la spécification du premier MVP.
- [x] Définir une première proposition de score et de verdict.
- [x] Définir les garde-fous d'accessibilité et d'anti-acharnement.
- [x] Préparer un protocole de playtest.
- [ ] Tester le concept avec une maquette papier ou un partage d'écran.
- [ ] Choisir une direction artistique.
- [ ] Choisir le ton éditorial du maître de cérémonie.
- [ ] Décider de la licence avant les contributions externes importantes.

## Phase 1 — Prototype local

**Objectif :** vérifier que lire sous pression est amusant.

### Déjà présent

- [x] Maquette de scène locale.
- [x] Réaction tomate.
- [x] Réactions visuelles simples.
- [x] Quatre variantes de scène.
- [x] Humeur du public.
- [x] Minuteur.
- [x] Ressource de tomates.
- [x] Journal de salle.
- [x] Mise en page responsive initiale.

### À compléter

- [ ] Séparer clairement l'écran comédien de l'écran public.
- [ ] Ajouter au moins six scènes réellement complètes.
- [ ] Ajouter une phase de briefing.
- [ ] Ajouter une phase de préparation.
- [ ] Ajouter une vraie finale.
- [ ] Ajouter un écran de verdict.
- [ ] Ajouter les niveaux de chaos doux, normal et cabaret infernal.
- [ ] Ajouter le mot interdit et le souffleur.
- [ ] Ajouter les options de contraste et de réduction des animations.
- [ ] Permettre une rotation locale du comédien.
- [ ] Tester avec trois groupes différents.
- [ ] Consigner chaque session dans un journal de playtest.

## Prochain sprint — Boucle locale complète

La prochaine version doit permettre de jouer une manche entière sur un même appareil ou par partage d'écran.

Ordre conseillé :

1. machine à états locale ;
2. briefing et préparation ;
3. six scènes au format JSON ;
4. réactions avec coût, durée et catégories de gêne ;
5. finale ;
6. verdict ;
7. options de confort ;
8. instrumentation de playtest.

Critères de sortie :

- une partie possède un début et une fin clairs ;
- les réactions ne peuvent pas bloquer totalement le texte ;
- le verdict s'appuie sur le journal réel de la manche ;
- trois joueurs peuvent comprendre la boucle sans explication détaillée ;
- au moins une session de test est documentée.

## Phase 2 — Vertical slice multijoueur

**Objectif :** jouer à distance dans un navigateur.

- [ ] Créer la structure TypeScript du client et du serveur.
- [ ] Création de salon.
- [ ] Code de connexion court.
- [ ] Rôle d'hôte.
- [ ] Un comédien et plusieurs spectateurs.
- [ ] Ressource individuelle du public.
- [ ] Horloge serveur autoritaire.
- [ ] Synchronisation des réactions.
- [ ] Budget de gêne calculé par le serveur.
- [ ] Rotation automatique du comédien.
- [ ] Reconnexion.
- [ ] Journal de partie.
- [ ] Verdict partagé.
- [ ] Interface public utilisable sur téléphone.
- [ ] Déploiement de test.
- [ ] Trois manches consécutives sans recréer le salon.

## Phase 3 — Contenu et progression légère

- [ ] Packs thématiques.
- [ ] Contraintes secrètes.
- [ ] Personnalités de public automatisé.
- [ ] Résumé de partie.
- [ ] Titres narratifs.
- [ ] Affiche ou souvenir partageable.
- [ ] Récompenses cosmétiques non compétitives.
- [ ] Historique local des représentations.
- [ ] Rotation équitable des rôles.

## Phase 4 — Théâtre asymétrique complet

- [ ] Plusieurs comédiens.
- [ ] Régisseur.
- [ ] Metteur en scène.
- [ ] Souffleur.
- [ ] Accessoiriste.
- [ ] Cues de scène.
- [ ] Entrées et sorties.
- [ ] Effets sonores et lumineux.
- [ ] Public simulé.
- [ ] Objectifs secrets par rôle.
- [ ] Score de récupération multi-rôles.
- [ ] Interface distincte pour chaque métier.

## Phase 5 — Modes étendus

- [ ] Seul en scène.
- [ ] Duo catastrophe.
- [ ] Improvisation publique.
- [ ] Pièce tournante.
- [ ] Mauvais régisseur.
- [ ] Doublage catastrophique.
- [ ] Téléphone théâtral.
- [ ] Répétition contre public.
- [ ] Public contre IA.
- [ ] Streaming participatif.

## Phase 6 — Création et IA

- [ ] Éditeur de pièces.
- [ ] Import et export de packs.
- [ ] Validation automatique des contenus.
- [ ] Génération assistée de thèmes et contraintes.
- [ ] Adaptation d'une pièce au nombre de joueurs.
- [ ] Modération du contenu.
- [ ] Critiques générées à partir du journal réel.
- [ ] Personnages secondaires génératifs.
- [ ] Bibliothèque communautaire.
- [ ] Gestion des droits et licences des créations.

## Phase 7 — Audio intégré et diffusion

Cette phase reste volontairement tardive.

- [ ] WebRTC intégré.
- [ ] Réglages individuels de volume.
- [ ] Consentement explicite à l'enregistrement.
- [ ] Transcription facultative.
- [ ] Détection optionnelle des silences et mots-clés.
- [ ] Overlays de streaming.
- [ ] Modération des réactions externes.
- [ ] Export de replay ou montage, uniquement avec consentement.

## Principes de priorisation

Une fonctionnalité passe avant une autre si elle :

1. permet de tester l'hypothèse principale ;
2. améliore une décision fréquente d'un rôle ;
3. transforme une erreur en opportunité de jeu ;
4. réduit une frustration observée en playtest ;
5. augmente la rejouabilité sans exiger beaucoup de contenu manuel.

Une fonctionnalité reste en attente si elle :

- dépend d'une IA alors qu'une règle simple suffit ;
- nécessite l'audio intégré avant validation de la boucle ;
- ajoute du chaos sans contre-jeu ;
- complexifie le serveur sans bénéfice visible pour les tests ;
- répond à une hypothèse qui n'a pas encore été observée.