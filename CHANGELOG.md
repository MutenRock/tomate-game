# Changelog

## 0.3.2 — Habillage, partie à distance et personnages

- thème visuel « théâtre » (rideaux, marquise, cartes programme) et assets SVG ;
- icônes de réactions, jauge de tomates, tâches de tomate animées ;
- `npm run remote` : serveur + tunnel Cloudflare, lien public copié et vérifié ;
- variable `PUBLIC_URL` et adresse réseau local dans le bouton « Copier le lien » ;
- partie possible avec les comédiens seuls (verdict ramené sur 100, ligne Public « — ») ;
- garde-robe d'avatars SVG par joueur (commande `SET_AVATAR`, fermée dès le début de la scène) ;
- personnages des comédiens visibles sur scène, bouche pilotée par le niveau du micro (niveau 0–8 uniquement, aucun audio transmis), repli automatique sans micro ;
- correction du smoke test sous Windows et nouveaux scénarios (garde-robe, duo sans public, relais de voix) ;
- guide `docs/PLAYTEST_REMOTE.md`.

## 0.3.1 — Préparation des playtests

- ajout d'une scène tutoriel guidée de deux à trois minutes ;
- état prêt obligatoire avant le lancement ;
- suivi des joueurs connectés et déconnectés ;
- pause automatique lorsqu'un comédien se déconnecte ;
- code de reprise pour récupérer sa place sur un autre appareil ;
- remplacement d'un comédien absent par un membre du public ;
- réactions affichant leur expéditeur, leur cible et leur durée ;
- questionnaire de fin directement intégré au jeu ;
- export d'un rapport JSON anonymisé ;
- smoke test couvrant l'état prêt, la reconnexion, le feedback et le rapport.

## 0.3.0 — Lecture guidée et duo de comédiens

- nouvelle interface centrée sur la lisibilité et le tour de parole ;
- séparation explicite entre didascalie, intention, texte à dire, action suivante et repère de scène ;
- bannière « À toi » / « Attends » synchronisée ;
- aperçu de la réplique précédente et de la prochaine intervention ;
- mode un comédien jouant les deux rôles ;
- mode deux comédiens avec rôle et objectif secret distincts ;
- promotion d'un membre du public en second comédien depuis le salon ;
- six histoires longues structurées en quatre actes ;
- 96 répliques au total, contre 24 dans le prototype précédent ;
- durée cible de six à huit minutes par histoire ;
- score d'équilibre du duo au verdict ;
- smoke tests distincts pour les modes solo et duo.

## 0.2.0 — Premier prototype multijoueur local

- salons à code court ;
- un comédien et jusqu'à onze membres du public ;
- synchronisation temps réel par Server-Sent Events ;
- six scènes et six réactions ;
- phases briefing, préparation, représentation, finale et verdict ;
- énergie, temps de recharge et budget de gêne ;
- score de continuité, récupération, public et finale ;
- interface mobile pour le public ;
- options de contraste et réduction des animations ;
- scripts de démarrage Windows et Linux ;
- smoke test automatisé.

## 0.1.0 — Maquette locale

- première interface de lecture ;
- tomates visuelles ;
- sélection de plusieurs idées de modes.
