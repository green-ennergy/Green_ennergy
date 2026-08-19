# Green Energy

Local development runs entirely in Docker. You do **not** need PHP, Composer, Node, or PostgreSQL installed on your machine.

| Service | URL |
| --- | --- |
| Backend (Laravel) | http://localhost:8000 |
| Frontend (Vue + Vite) | http://localhost:5173 |
| PostgreSQL | `localhost:5432` |

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Git

Make sure Docker Desktop is **running** before you start.

---

## First-time setup

Do these steps once after cloning the repo.

### 1. Clone the project

```bash
git clone https://github.com/SimO137/Green_Energy.git
cd green_energy
```

### 2. Create the root `.env` file


**Windows (PowerShell)**

```powershell
Copy-Item .env.development .env
```

**macOS / Linux**

```bash
cp .env.development .env
```


### 3. Create the Laravel `.env` file


**Windows (PowerShell)**

```powershell
Copy-Item backend\.env.development backend\.env
```

**macOS / Linux**

```bash
cp backend/.env.development backend/.env
```

### 4. Start all services

From the repo root:

```bash
docker compose up --build
```

First start takes a few minutes. The containers will:

- install PHP dependencies (`composer install`)
- install frontend dependencies (`npm install`)
- start PostgreSQL, Nginx, PHP-FPM, and Vite

Leave this terminal open, or add `-d` to run in the background:

```bash
docker compose up --build -d
```

### 5. Generate the app key and run migrations

Open a **second terminal** in the repo root and run:

```bash
docker compose exec backend php artisan key:generate
docker compose exec backend php artisan migrate
```

Optional — seed a demo user (`test@example.com`):

```bash
docker compose exec backend php artisan db:seed
```

### 6. Verify everything works

Open in your browser:

- http://localhost:8000 → Laravel welcome page
- http://localhost:8000/test → should show `BACKEND TEST 123`
- http://localhost:5173 → Vue app

If all three load, your environment is ready.

---

## Daily workflow

### Start

```bash
docker compose up
```

Or in the background:

```bash
docker compose up -d
```

### Stop

```bash
docker compose down
```

### View logs

```bash
docker compose logs -f
docker compose logs -f backend
docker compose logs -f frontend
```

### Restart one service

```bash
docker compose restart backend
docker compose restart frontend
```

---

## Common commands

Run from the repo root while containers are up.

### Backend (Laravel)

```bash
docker compose exec backend php artisan migrate
docker compose exec backend php artisan migrate:fresh --seed
docker compose exec backend php artisan config:clear
docker compose exec backend php artisan tinker
docker compose exec backend php artisan test
```

### Frontend (Vue)

```bash
docker compose exec frontend npm run test:unit
docker compose exec frontend npm run format
docker compose exec frontend npm run build
```

### Database

```bash
docker compose exec postgres psql -U root -d green_energies
```

---

## Project structure

```
green_energy/
├── backend/          Laravel API / backend
├── frontend/         Vue 3 + Vite frontend
├── docker/
│   ├── nginx/        Nginx config
│   └── php/          PHP-FPM Dockerfile
├── docker-compose.yml
├── .env.development  Docker Compose template (copy to `.env`)
└── .env              Your local Docker config (do not commit)
```

### Docker services

| Service | Role |
| --- | --- |
| `backend` | PHP 8.4 FPM + Laravel |
| `nginx` | Serves Laravel on port 8000 |
| `frontend` | Vite dev server on port 5173 |
| `postgres` | PostgreSQL 17 database |

---

## Tech stack

| Layer | Version |
| --- | --- |
| PHP | 8.4 |
| Laravel | 13 |
| Vue | 3 |
| Vite | 8 |
| Node | 22 |
| PostgreSQL | 17 |

---

## Notes for the team

- Two env files are used (each has a committed `.env.development` template):
  - **Root `.env`** → Docker Compose (ports, Postgres container credentials). Copy from `.env.development`.
  - **`backend/.env`** → Laravel app config. Copy from `backend/.env.development`.
- Do **not** commit `.env` files.
