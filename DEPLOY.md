# Procédure de déploiement — VPS OVH + Docker + Nginx Proxy Manager

## Infra

- **VPS** : OVH (Debian/Ubuntu)
- **Docker** + **Docker Compose** installés
- **Nginx Proxy Manager** en container Docker (port 81 pour l'interface admin)
- **Pas de Node/npm sur le VPS**, tout passe par Docker
- Les projets sont clonés à la racine (`/root/`)

---

## Premier déploiement

### 1. Cloner le projet

```bash
cd ~
git clone https://url-du-repo.git nom-du-projet
cd nom-du-projet
```

### 2. Créer le fichier .env.prod

Le `.env.prod` n'est pas dans Git (et ne doit jamais l'être).

```bash
cp .env.example .env.prod
nano .env.prod
```

Remplir avec les vraies valeurs (mot de passe BDD fort, URL du site, etc.).

### 3. Builder et lancer

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

### 4. Appliquer les migrations

```bash
docker compose -f docker-compose.prod.yml exec app npx prisma@6.5.0 migrate deploy
```

> **Important** : toujours spécifier la version de Prisma (`prisma@6.5.0`) pour éviter que npx télécharge une version majeure incompatible. Utiliser la même version que dans le `package.json` du projet.

### 5. Seeder la BDD (données initiales)

```bash
docker compose -f docker-compose.prod.yml exec app node prisma/dist/seed.js
```

> Le seed est compilé en JS pendant le build Docker (pas de `ts-node` en prod). Le fichier compilé est dans `prisma/dist/seed.js`.

### 6. Vérifier que tout tourne

```bash
docker compose -f docker-compose.prod.yml logs -f app
```

Tester en local sur le VPS :

```bash
curl http://localhost:PORT
```

### 7. Configurer Nginx Proxy Manager

Aller sur `http://IP-VPS:81` (interface admin Nginx Proxy Manager).

**Proxy Hosts** → **Add Proxy Host** :

| Champ | Valeur |
|-------|--------|
| Domain Names | `sous-domaine.domaine.fr` |
| Scheme | `http` |
| Forward Hostname / IP | `172.17.0.1` |
| Forward Port | Port exposé dans `docker-compose.prod.yml` |
| Block Common Exploits | Oui |

> **Attention** : ne pas mettre `localhost` dans Forward Hostname. `localhost` dans un container Docker pointe vers le container lui-même, pas vers le VPS. Utiliser `172.17.0.1` (IP du bridge Docker) pour atteindre les ports exposés sur le VPS.
>
> Pour retrouver cette IP : `ip addr show docker0 | grep inet`

**Onglet SSL** :
- Request a new SSL Certificate (Let's Encrypt)
- Cocher **Force SSL**
- Cocher **HTTP/2 Support**
- Entrer un email valide
- Save

### 8. Configurer le DNS

Chez le registrar (Ionos, OVH, etc.) :
- Ajouter un enregistrement **A** ou **CNAME** pointant `sous-domaine.domaine.fr` vers l'IP du VPS

---

## Mettre à jour (déployer une nouvelle version)

### Sur le PC de dev

```bash
git add -A
git commit -m "description des changements"
git push
```

### Sur le VPS

```bash
cd ~/nom-du-projet
git pull
docker compose -f docker-compose.prod.yml up --build -d
```

Si des migrations Prisma ont été ajoutées :

```bash
docker compose -f docker-compose.prod.yml exec app npx prisma@6.5.0 migrate deploy
```

Si le seed a changé (nouvelles données initiales) :

```bash
docker compose -f docker-compose.prod.yml exec app node prisma/dist/seed.js
```

### Vérifier

```bash
docker compose -f docker-compose.prod.yml logs -f app
```

---

## Commandes utiles sur le VPS

| Action | Commande |
|--------|----------|
| Voir les logs | `docker compose -f docker-compose.prod.yml logs -f app` |
| Redémarrer | `docker compose -f docker-compose.prod.yml restart` |
| Stopper | `docker compose -f docker-compose.prod.yml down` |
| Stopper + supprimer les données | `docker compose -f docker-compose.prod.yml down -v` |
| Voir les containers | `docker compose -f docker-compose.prod.yml ps` |
| Shell dans le container app | `docker compose -f docker-compose.prod.yml exec app sh` |
| Shell dans le container BDD | `docker compose -f docker-compose.prod.yml exec db psql -U USER -d DB` |

---

## Pièges à éviter

1. **Ne jamais utiliser `npx prisma` sans version** : npx télécharge la dernière version qui peut être incompatible (ex: Prisma 7 casse la syntaxe du schema). Toujours `npx prisma@X.Y.Z`.

2. **`localhost` dans Nginx Proxy Manager** : dans un container Docker, `localhost` = le container lui-même. Utiliser `172.17.0.1` pour atteindre les ports du VPS.

3. **`ts-node` n'existe pas en prod** : le Dockerfile compile le seed en JS pendant le build. Utiliser `node prisma/dist/seed.js` au lieu de `prisma db seed`.

4. **`package-lock.json` doit être à jour** : si on ajoute une dépendance dans `package.json`, toujours lancer `npm install` en local pour mettre à jour le lock file avant de pousser. Sinon `npm ci` échoue dans le Docker build.

5. **`.env.prod` n'est pas dans Git** : le créer manuellement sur chaque VPS avec `cp .env.example .env.prod`.
