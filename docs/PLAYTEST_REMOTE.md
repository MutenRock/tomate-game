# Lancer une partie à distance avec des amis

Objectif : vous lancez le jeu sur votre PC, vos amis rejoignent depuis leur téléphone ou leur navigateur, où qu'ils soient.

## Lancement (hôte, Windows)

1. Double-cliquer sur `start_windows_cloudflare.bat` (ou `npm run remote`).
2. Attendre le bloc « Lien à envoyer à vos amis ». Le lien `https://….trycloudflare.com` est **copié dans le presse-papiers** et ouvert dans votre navigateur.
3. Dans la page ouverte : pseudo → format → **Ouvrir le rideau**.
4. Dans le salon, **Copier le lien** (il contient déjà le code de salle) et l'envoyer aux amis.
5. Ne fermez pas la fenêtre noire : la fermer arrête le jeu pour tout le monde. `Ctrl+C` pour arrêter proprement.

Première fois : le tunnel est téléchargé via `npx` (~30 s). Pour éviter cette attente : `winget install Cloudflare.cloudflared`.

## Message à envoyer

> On teste un jeu ! Ouvre ce lien, mets un pseudo, choisis « Public » (ou « Comédien 2 » si je te le dis), et clique « Je suis prêt » : <LIEN>
> Prévois d'être aussi en vocal (Discord, WhatsApp…) : le jeu ne transmet pas la voix.

## Déroulé conseillé (≈ 25 min)

1. Tout le monde rejoint, vocal ouvert.
2. Lancer le **tutoriel** (2–3 min) en solo ou duo.
3. Jouer une **histoire longue** (6–8 min).
4. Chacun remplit le retour rapide ; l'hôte clique **Exporter le rapport JSON**.
5. Noter à côté ce que le questionnaire ne capture pas (moments de confusion, fous rires, silences).

## Si ça coince

| Problème | Solution |
|---|---|
| « Le tunnel s'est arrêté » | Installer cloudflared (`winget install Cloudflare.cloudflared`) et relancer |
| Un ami voit « Reconnexion… » | Il recharge la page ; sa place est reprise automatiquement, sinon « Reprendre ma place » avec le code de reprise |
| Un comédien décroche | La partie se met en pause ; l'hôte peut le **Remplacer** par quelqu'un du public |
| Le lien copié contient `localhost` | Vous avez ouvert le jeu sans passer par `npm run remote` : relancer via le script |
| Le lien a changé | Normal : une nouvelle URL est créée à chaque lancement |

## Limites

- Les salles sont en mémoire : arrêter le serveur les supprime.
- L'URL `trycloudflare.com` est temporaire, sans garantie de disponibilité : usage playtest uniquement.
- Toute personne qui connaît le lien peut ouvrir une salle ; ne le publiez pas.
