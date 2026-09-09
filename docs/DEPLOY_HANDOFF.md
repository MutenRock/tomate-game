# Déploiement de tomate-game — dossier de reprise

Écrit le 2026-09-09 à partir d'une session d'audit. Résume les décisions,
contraintes et options explorées pour exposer tomate-game en ligne, notamment
dans l'écosystème Nitro / skill-arena.

---

## 1. Ce qu'est tomate-game

Jeu multijoueur en temps réel : un animateur et une salle de joueurs votent
sur des questions, l'animateur voit les résultats en direct.

- Dépôt : `MutenRock/tomate-game`, branche `main`
- Serveur : `server/server.mjs` — **processus Node.js persistant** (SSE + HTTP)
- Client : fichiers HTML/CSS/JS servis statiquement par ce même serveur
- Port par défaut : `4173`
- Aucune base de données — état en mémoire, rooms éphémères

**Contrainte fondamentale** : tomate-game exige un processus Node.js vivant
en permanence. Il n'est pas déployable sur un hébergement purement statique.

---

## 2. Contexte réseau — ce qui existe

### OVH (`nitro.sterenna.fr`)

`nitro.sterenna.fr` héberge **skill-arena** (`Sterenna-studio/skill-arena`) :
un Next.js compilé en export statique, rsynckés via GitHub Actions vers
`~/nitro/arena/` sur le serveur OVH.

```
workflow : .github/workflows/deploy-ovh.yml
secrets requis : OVH_SSH_KEY, OVH_HOST, OVH_USER,
                 GHSTAR_SUPABASE_URL, GHSTAR_SUPABASE_ANON
next.config.ts : output='export', basePath='/arena', trailingSlash=true
```

Routes Next.js existantes :
- `/arena/` — hub
- `/arena/room/` — rooms multijoueur
- `/arena/games/` — catalogue
- `/arena/arcade/` — arcade
- `/arena/leaderboard/` — classement

**⚠️ Si l'OVH est mutualisé** (probable — le déploiement est un simple rsync
de fichiers statiques), il est **impossible** d'y faire tourner Node.js.
Vérification : `ssh user@ovh_host node --version` — si ça répond, c'est un
VPS et Node.js est disponible.

### Mesh local Clavicula (`MutenRock/clavicula`)

Quatre machines domestiques :

| Machine | OS | IP LAN | Rôle |
|---|---|---|---|
| Salomon | Windows 11 Home | `192.168.1.33` | Cœur mesh, broker MQTT, tableau de bord `:8765` |
| ZyraPop | Pop!_OS 24.04 | `192.168.1.24 / .83` | **Héberge déjà Korigan** (serveur Node.js) |
| Aspire | Windows 10 | variable | satellite léger |
| Switch Tegra | Ubuntu L4T | mobile | terminal mobile |

ZyraPop est la machine naturelle pour héberger tomate-game : Linux, Node.js
déjà en place, pattern de service déjà connu via Korigan.

---

## 3. Options de déploiement explorées

### Option A — `/arena/tomate/` sur OVH via nginx reverse proxy

Requiert que l'OVH soit un VPS avec accès root. Si c'est le cas :
- Tomate tourne sur un port dédié (ex. `4173`) avec pm2
- nginx route `location /arena/tomate/` vers `proxy_pass http://127.0.0.1:4173/`
- **Problème** : tous les `fetch('/api/...')` dans le client supposent un
  chemin racine. Il faut ajouter un `BASE_PATH` au serveur et préfixer les
  routes, ce qui représente un vrai chantier.

### Option B — Sous-domaine `tomate.sterenna.fr` (recommandée si VPS)

- Tomate tourne sur un port dédié
- nginx crée un nouveau `server {}` avec `server_name tomate.sterenna.fr`
- Zéro modification du code de tomate-game
- DNS : enregistrement A `tomate.sterenna.fr` → IP OVH

### Option C — ZyraPop + Cloudflare Tunnel (recommandée si mutualisé)

Tomate-game tourne sur ZyraPop, exposé via un tunnel Cloudflare :

```bash
# Sur ZyraPop
git clone https://github.com/MutenRock/tomate-game
cd tomate-game
node server/server.mjs
# ou avec pm2 : pm2 start server/server.mjs --name tomate-game

# Tunnel permanent vers tomate.sterenna.fr
cloudflared tunnel run tomate
```

Pour une URL stable `tomate.sterenna.fr`, créer un tunnel nommé dans
Cloudflare (compte gratuit requis) et ajouter un CNAME dans le DNS Sterenna.
Tailscale est aussi disponible sur le mesh (déjà configuré sur Salomon).

### Option D — Page d'entrée dans skill-arena, jeu séparé

Créer `src/app/tomate/page.tsx` dans skill-arena : une carte de présentation
qui pointe vers l'URL réelle de tomate-game. Zéro conflit d'infrastructure,
intégration visuelle partielle.

---

## 4. Décision à prendre

**La question bloquante** : quel type d'hébergement est l'OVH ?

```bash
ssh $OVH_USER@$OVH_HOST node --version
```

- Répond → VPS → Option B faisable sans toucher au code
- Échoue → mutualisé → Option C (ZyraPop + Cloudflare Tunnel)

---

## 5. Ce qui n'a PAS encore été fait

- [ ] Vérifier le type d'hébergement OVH (mutualisé vs VPS)
- [ ] Choisir entre Option B et C
- [ ] Écrire le service systemd pour ZyraPop (si Option C retenue)
- [ ] Configurer le tunnel Cloudflare `tomate.sterenna.fr` (si Option C)
- [ ] Adapter les paths API si Option A retenue (chantier non trivial)

---

## 6. Liens utiles

- Repo tomate-game : <https://github.com/MutenRock/tomate-game>
- Repo skill-arena : <https://github.com/Sterenna-studio/skill-arena>
- Repo clavicula (mesh) : <https://github.com/MutenRock/clavicula>
- Jeu en ligne skill-arena : <https://nitro.sterenna.fr/arena/>
- Workflow deploy OVH : `.github/workflows/deploy-ovh.yml` dans skill-arena
- AGENTS.md clavicula : topologie réseau complète + pièges connus
