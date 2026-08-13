# Medicence Supplies

Medical wholesale commerce platform — catalog, carts, fulfillment, supplier replenishment, and support tickets. Modern rebuild of the legacy MedShop Spring MVC course project.

![Medicence Supplies landing page](docs/landing.png)

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite, MUI, React Router, TanStack Query, Zustand |
| Backend | Spring Boot 3, Spring Security + JWT, Spring Data JPA / Hibernate |
| Database | MySQL (H2 for local profile) |
| Docs | OpenAPI / Swagger |
| Ops | Docker, GitHub Actions, Actuator health |

## Features

- **Public catalog** — search, category filter, in-stock filter, sort (featured, most ordered, name, price), pagination, product detail pages
- **Customer** — cart, checkout, order history
- **Admin** — dashboard stats, inventory CRUD, order fulfillment, stock requests, support ticket queue
- **Supplier** — dashboard, linked inventory, approve/reject replenishment requests
- **Account** — profile, password/settings, help & support tickets
- **Auth** — JWT login; self-register as CUSTOMER or SUPPLIER (not ADMIN)

## Project layout

```text
backend/     Spring Boot API
frontend/    Vite React app
docs/        Screenshots and docs assets
medshop/     Legacy Spring MVC reference (course project)
```

## Quick start (local)

### Backend (H2, no MySQL required)

```bash
cd backend
# Java 17+
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

- API: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui.html
- Health: http://localhost:8080/actuator/health

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Set `VITE_API_URL` if the API is not on `http://localhost:8080`.

### Docker Compose (MySQL + API)

```bash
docker compose up --build
```

## Demo users

Seeded on first boot:

| Username | Password | Role |
| --- | --- | --- |
| admin | password123 | ADMIN |
| customer | password123 | CUSTOMER |
| supplier | password123 | SUPPLIER |

Self-registration allows **CUSTOMER** or **SUPPLIER** only (not ADMIN).

## Architecture

```text
React (Netlify)
  → REST / JWT
Spring Boot Controllers
  → Services
  → Spring Data Repositories
  → JPA / Hibernate
  → MySQL (Render)
```

## Deploy

### Render (backend)

Free demo path (no paid MySQL): set `SPRING_PROFILES_ACTIVE=local` so the API uses in-memory H2 + seeded demo users. Data resets when the service sleeps/restarts.

For a real MySQL (external or paid Render private service), leave that profile unset and set `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, and `DB_SSL`.

Also set:
- `JWT_SECRET` — any long secret
- `CORS_ORIGINS` — your Netlify URL
- `PORT` — `8080` (or let Render inject it)

See `render.yaml` for the Blueprint defaults.

### Netlify (frontend)

1. Base directory: `frontend`
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Env: `VITE_API_URL` = your Render API URL

`frontend/netlify.toml` includes SPA redirects.

## Tests

```bash
cd backend && mvn test
cd frontend && npm test
```

## Brand

Product name: **Medicence Supplies**
