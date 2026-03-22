# Gaio Polart

Site vitrine pour l'entreprise Gaio Polart — Commerce de volailles et gibier de qualité sur les marchés d'Île-de-France.

## Stack

- **Frontend** : Next.js 16 (App Router) + Tailwind CSS 4
- **BDD** : PostgreSQL 16 (Docker)
- **ORM** : Prisma
- **Conteneurisation** : Docker + Docker Compose

---

## Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (dev local)
- [Node.js 20+](https://nodejs.org/) (pour les commandes Prisma hors container)

---

## Développement local

### 1. Lancer l'environnement de dev

```bash
docker compose -f docker-compose.dev.yml up --build
```

Le site est accessible sur **http://localhost:3000**

### 2. Arrêter l'environnement

```bash
docker compose -f docker-compose.dev.yml down
```

### 3. Arrêter et supprimer les données (reset BDD)

```bash
docker compose -f docker-compose.dev.yml down -v
```

---

## Base de données

### Lancer une migration (après modif du schema.prisma)

```bash
# Depuis le container
docker compose -f docker-compose.dev.yml exec app npx prisma migrate dev --name nom_migration

# Ou en local (si node_modules installé et BDD accessible)
npm run db:migrate
```

### Appliquer les migrations existantes (prod)

```bash
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

### Seeder la BDD (données initiales)

```bash
docker compose -f docker-compose.dev.yml exec app npx prisma db seed
```

### Ouvrir Prisma Studio (interface web pour la BDD)

```bash
# Nécessite que la BDD tourne et que DATABASE_URL soit accessible
npm run db:studio
```

### Regénérer le client Prisma

```bash
npm run db:generate
```

---

## Production (VPS OVH)

### 1. Configurer l'environnement

Copier `.env.example` en `.env.prod` et modifier les valeurs :

```bash
cp .env.example .env.prod
# Éditer .env.prod avec un vrai mot de passe PostgreSQL et le bon domaine
```

### 2. Builder et lancer

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

### 3. Appliquer les migrations

```bash
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

### 4. Seeder (première fois)

```bash
docker compose -f docker-compose.prod.yml exec app npx prisma db seed
```

### 5. Nginx Proxy Manager

Dans l'interface Nginx Proxy Manager (port 81) :
- Ajouter un **Proxy Host**
- **Domain** : `gaio-polart.fr` (ou le domaine choisi)
- **Forward Hostname** : `localhost` (ou `app` si sur le même réseau Docker)
- **Forward Port** : `3000`
- Activer **SSL** via Let's Encrypt

### 6. Voir les logs

```bash
docker compose -f docker-compose.prod.yml logs -f app
```

### 7. Redémarrer

```bash
docker compose -f docker-compose.prod.yml restart
```

### 8. Mettre à jour (nouveau code)

```bash
git pull
docker compose -f docker-compose.prod.yml up --build -d
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

---

## Structure du projet

```
gaio-polart/
├── prisma/
│   ├── schema.prisma      # Schéma BDD
│   └── seed.ts            # Données initiales
├── public/
│   ├── favicon.svg         # Favicon GP
│   └── robots.txt          # SEO
├── src/
│   ├── app/
│   │   ├── globals.css    # Styles globaux + thème
│   │   ├── layout.tsx     # Layout principal (SEO, structured data)
│   │   ├── page.tsx       # Page d'accueil
│   │   ├── marches/       # Page marchés
│   │   └── sitemap.ts     # Sitemap dynamique
│   ├── components/
│   │   ├── Header.tsx     # Navigation (mobile burger inclus)
│   │   ├── Footer.tsx
│   │   ├── HeroMarket.tsx # Prochain marché + carte
│   │   ├── OrderBanner.tsx # Réservation
│   │   ├── ProductsTeaser.tsx # Nuage produits
│   │   ├── About.tsx      # Notre histoire
│   │   ├── MarchesPage.tsx # Page marchés complète
│   │   └── ThemeProvider.tsx # Dark/light mode
│   └── lib/
│       ├── prisma.ts      # Client Prisma singleton
│       ├── markets.ts     # Requêtes marchés
│       └── types.ts       # Types partagés
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── Dockerfile             # Image prod (multi-stage)
├── Dockerfile.dev         # Image dev (hot-reload)
├── .env.dev               # Variables dev (git-ignored)
├── .env.prod              # Variables prod (git-ignored)
└── .env.example           # Template des variables
```

---

## Variables d'environnement

| Variable | Description |
|----------|-------------|
| `POSTGRES_USER` | Utilisateur PostgreSQL |
| `POSTGRES_PASSWORD` | Mot de passe PostgreSQL |
| `POSTGRES_DB` | Nom de la base |
| `DATABASE_URL` | URL de connexion complète |
| `NODE_ENV` | `development` ou `production` |
| `NEXT_PUBLIC_SITE_URL` | URL du site (pour SEO, Open Graph, sitemap) |

---

## Commandes rapides

| Action | Commande |
|--------|----------|
| Dev : lancer | `docker compose -f docker-compose.dev.yml up --build` |
| Dev : stopper | `docker compose -f docker-compose.dev.yml down` |
| Dev : reset BDD | `docker compose -f docker-compose.dev.yml down -v` |
| Dev : seed | `docker compose -f docker-compose.dev.yml exec app npx prisma db seed` |
| Dev : migration | `docker compose -f docker-compose.dev.yml exec app npx prisma migrate dev` |
| Dev : Prisma Studio | `npm run db:studio` |
| Prod : lancer | `docker compose -f docker-compose.prod.yml up --build -d` |
| Prod : migrations | `docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy` |
| Prod : logs | `docker compose -f docker-compose.prod.yml logs -f app` |
| Prod : update | `git pull && docker compose -f docker-compose.prod.yml up --build -d` |

---

## One-liners (PowerShell)

**Reset complet + relance + migration + seed :**

```powershell
docker compose -f docker-compose.dev.yml down -v; docker compose -f docker-compose.dev.yml up --build -d; Start-Sleep -Seconds 5; docker compose -f docker-compose.dev.yml exec app npx prisma migrate dev --name init; docker compose -f docker-compose.dev.yml exec app npx prisma db seed; docker compose -f docker-compose.dev.yml logs -f app
```

**Relance simple (code modifié, BDD intacte) :**

```powershell
docker compose -f docker-compose.dev.yml up --build
```

> Le hot-reload fonctionne pour les fichiers `.tsx` — pas besoin de relancer pour les changements de code frontend. Relancer uniquement si modif Docker, dépendances ou config.

---

## À venir

Les fonctionnalités suivantes sont prévues mais en attente d'informations ou de développement futur :

### En attente d'informations

- **Numéro de téléphone** : à confirmer avec les parents, sera affiché dans le header/footer et le bouton "Nous contacter"
- **Adresse mail de contact** : à confirmer, pour le formulaire de contact
- **Section produits détaillée** : à construire en collaboration avec les parents (descriptions, catégories)
- **Gestion des prix** : à définir comment les parents souhaitent les afficher (fourchettes, prix au kg, etc.)

### Développement futur (v0.2 — après la page de connexion)

- **Page de connexion** : authentification pour les 3 utilisateurs (père, mère, fils)
- **Gestion des absences** : interface admin pour signaler les absences sur un marché
- **Gestion des marchés** : ajout, modification, suppression de marchés depuis l'interface
- **Gestion des horaires** : modification des horaires exceptionnels (jours fériés, été, Noël)
- **Page contact** : formulaire de contact avec mail et téléphone

### Améliorations prévues

- **Photos** : stand, produits, équipe (humanise le site)
- **Avis clients** ou témoignages
- **Réseaux sociaux** : liens vers les comptes si existants
- **Image Open Graph** : visuel personnalisé pour le partage sur WhatsApp, Facebook, etc.
