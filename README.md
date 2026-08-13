# Medicence Supplies

Medical wholesale commerce platform — catalog, carts, fulfillment, supplier replenishment, and support tickets.

<img src="docs/landing.png" alt="Medicence Supplies landing page" width="850"/>

Medicence Supplies is a ground-up rebuild of the legacy Medshop Spring MVC coursework project — same domain (medical inventory and ordering), rewritten as a REST API + SPA instead of a server-rendered JSP app. Three roles sit on the same domain model with server-enforced boundaries: customers browse a searchable, filterable catalog and check out; suppliers manage their own inventory and approve or reject replenishment requests; admins run fulfillment, inventory CRUD, and a support ticket queue from a dedicated dashboard. Every API failure — validation errors, bad credentials, access-denied, not-found, unhandled exceptions — is normalized into the same structured JSON error shape rather than leaking stack traces or inconsistent formats to the client.

**Stack:** React + TypeScript (Vite) · Spring Boot 3 · MySQL (H2 for local) · JWT auth

**Author:** Anish Kuila

**Live demo:** [anish-medicencesupplies.netlify.app](https://anish-medicencesupplies.netlify.app/)

**Status:** Deployed live — final build

## Table of contents
- [What it does](#what-it-does)
- [Architecture](#architecture)
- [Domain model](#domain-model)
- [Scale](#scale)
- [Install](#install)
- [Quickstart](#quickstart)
- [Demo accounts](#demo-accounts)
- [Project structure](#project-structure)
- [API reference](#api-reference)
- [Error handling](#error-handling)
- [Limitations](#limitations)

## What it does

```
Client (React/Vite) ──▶ [JwtAuthenticationFilter] ──▶ [Spring Boot API] ──▶ [MySQL]
                                                              │
        ┌─────────────────────────┬───────────────────────────┼───────────────────────┬───────────────────┐
        ▼                         ▼                           ▼                       ▼                   ▼
   Catalog/Orders            Stock Requests              Support Tickets            Dashboard          Account
  (search, filter,          (supplier approve/           (customer help,           (admin stats)      (profile,
   sort, checkout)            reject replenish)            ticket queue)                                password)
```

Every request carries a JWT validated by a custom `JwtAuthenticationFilter`, which resolves the caller's `Role` (`ADMIN`, `CUSTOMER`, `SUPPLIER`) and scopes what each controller allows — enforced in Spring Security config, not just hidden in the UI. Self-registration is intentionally limited to `CUSTOMER` and `SUPPLIER`; admin accounts are seeded, not signed up.

## Architecture

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, MUI, React Router, TanStack Query, Zustand |
| Backend | Spring Boot 3, Spring Security + JWT (HMAC-signed, configurable expiry), Spring Data JPA / Hibernate |
| Database | MySQL (H2 for local dev profile) |
| API docs | springdoc-openapi (Swagger UI, bearer-auth scheme pre-configured) |
| Error handling | `@RestControllerAdvice` global handler — 5 distinct exception types normalized to one `ApiError` shape |
| Testing | JUnit + Spring Boot Test (backend), Vitest + Testing Library (frontend) |
| CI/CD | GitHub Actions — backend test+package, frontend test+build |
| Ops | Docker, Docker Compose, Spring Actuator health checks |
| Hosting | Netlify (frontend) · Render (backend, via `render.yaml`) |

## Domain model

| Entity | Purpose |
|---|---|
| `User` | Auth identity + profile, tagged with a `Role` |
| `Supplier` | Linked 1:1 to a `SUPPLIER`-role user; owns medications it stocks |
| `Medication` | Catalog item — name, category, price, stock quantity, description, image, featured flag |
| `Order` / `OrderItem` | Customer checkout, line items, status lifecycle (`OrderStatus`) |
| `StockRequest` | Supplier replenishment request with its own lifecycle (`StockRequestStatus`) |
| `SupportTicket` | Customer support queue item (`SupportTicketStatus`) |
| `Role` | `ADMIN` / `CUSTOMER` / `SUPPLIER` enum driving both UI routing and server-side authorization |

## Scale

Counted directly from the codebase:

| Metric | Count |
|---|---|
| REST API endpoints | 26, across 7 controllers |
| Domain entities | 8 (User, Supplier, Medication, Order, OrderItem, StockRequest, SupportTicket, Role) |
| DTO classes | 18 (dedicated request/response DTOs — domain entities are never serialized directly) |
| User roles | 3 (ADMIN, CUSTOMER, SUPPLIER) |
| Frontend pages | 18 (customer, supplier, and admin views) |
| Automated test files | 6 (4 backend/JUnit — including a repository test and an integration test — 2 frontend/Vitest) |
| Seeded demo catalog | 8 medications across 6 categories (Antibiotic, Pain Relief, Allergy, Supplement, Digestive, Devices, PPE, Hygiene) |

## Install

Requires Java 17+, Node 18+, and MySQL (or use the bundled H2 local profile).

```bash
git clone https://github.com/anishneu/MedicenceSupplies-Medical-Store-Platform.git
cd MedicenceSupplies-Medical-Store-Platform
```

## Quickstart

```bash
# Backend (H2, no MySQL required)
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local
# API: http://localhost:8080
# Swagger: http://localhost:8080/swagger-ui.html
# Health: http://localhost:8080/actuator/health

# Frontend
cd frontend
npm install
npm run dev
# Open http://localhost:5173 — set VITE_API_URL if the API isn't on :8080
```

Or run everything via Docker Compose (MySQL + API):

```bash
docker compose up
```

Or skip local setup entirely and try the live deployment: **[anish-medicencesupplies.netlify.app](https://anish-medicencesupplies.netlify.app/)**

On first run with an empty database, `DataSeeder` automatically populates demo accounts, a supplier, and an 8-item catalog — no manual seeding step required.

## Demo accounts

Seeded automatically on first startup (all use password `password123`):

| Username | Role | Notes |
|---|---|---|
| `admin` | ADMIN | Full dashboard, fulfillment, catalog CRUD, support queue |
| `customer` | CUSTOMER | Pre-populated order history for browsing the customer flow |
| `supplier` | SUPPLIER | Linked to the seeded "MediSource Wholesale" supplier record |

## Project structure

```
MedicenceSupplies-Medical-Store-Platform/
├── backend/                Spring Boot API
│   └── src/main/java/com/medicence/supplies/
│       ├── controller/        7 controllers (Auth, Account, Medication, Order,
│       │                      Stock, Support, Dashboard)
│       ├── domain/             8 entities + Role enum
│       ├── dto/                 18 request/response DTOs
│       ├── service/              Business logic per domain area
│       ├── repository/            Spring Data JPA repositories
│       ├── security/               JWT filter, JwtService, UserPrincipal
│       ├── exception/               ApiException + GlobalExceptionHandler
│       └── config/                   Security config, OpenAPI config, DataSeeder
├── frontend/                Vite React app
│   └── src/
│       ├── pages/               18 pages (customer/supplier/admin views)
│       ├── api/                  API client layer
│       └── store/                 Zustand state stores
├── docs/                     Screenshots and docs assets
├── .github/workflows/        CI: backend test+package, frontend test+build
└── medshop/                  Legacy Spring MVC reference (original course project)
```

## API reference

| Controller | Endpoints | Purpose |
|---|---|---|
| MedicationController | 6 | Catalog search, filter, sort, product detail |
| StockController | 6 | Supplier inventory + replenishment approve/reject |
| OrderController | 4 | Cart checkout, order history, fulfillment |
| SupportController | 4 | Support ticket creation and queue management |
| AccountController | 3 | Profile, password/settings |
| AuthController | 2 | JWT login, self-registration (CUSTOMER/SUPPLIER) |
| DashboardController | 1 | Admin dashboard stats |

Full interactive documentation is served via Swagger UI once the backend is running, with the bearer-JWT scheme pre-wired so authenticated endpoints can be tested directly from the docs page.

## Error handling

Every failure mode is caught centrally and returned as the same `ApiError` shape (`message`, `status`, request path):

| Exception | HTTP status | Example trigger |
|---|---|---|
| `ApiException` (custom, thrown by services) | varies | Business-rule violations, e.g. ordering out-of-stock items |
| `MethodArgumentNotValidException` | 400 | Bean-validation failures, with field errors joined into one message |
| `BadCredentialsException` | 401 | Invalid login |
| `AccessDeniedException` | 403 | Role-mismatched access attempt |
| `Exception` (catch-all) | 500 | Anything unhandled — never leaks a raw stack trace to the client |

## Limitations

- Self-registration is restricted to CUSTOMER/SUPPLIER by design — ADMIN accounts must be seeded/created directly, not exposed as a signup path.
- Backend Render deployment uses the free tier, which spins down on inactivity — the first request to the live demo after idle time may be slow while the service cold-starts.
- Test coverage exists but is not comprehensive (6 test files across a 26-endpoint API and 18-page frontend) — a good next step would be expanding coverage on the checkout and stock-approval flows specifically.
