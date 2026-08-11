# AGENTS.md

## Project purpose

This repo is a small full-stack commerce application. The backend supplies an API for auth, products, orders, and payments; the frontend presents a storefront and admin experience for managing inventory and seeing orders.

## Key responsibilities

### Backend

The backend lives under `backend/` and is organized by feature area:

- `routers/` contains FastAPI route registration.
- `services/` holds business logic and token handling.
- `schemas/` defines request/response model validation.
- `models/` contains SQLAlchemy entity definitions.
- `config/` provides DB and app configuration.
- `utils/` contains shared dependencies and app setup.

### Frontend

The frontend lives under `frontend/` and uses Vite + React:

- `src/App.jsx` defines routes.
- `src/components/` contains storefront and admin UI screens.
- `src/context/AuthContext.jsx` manages login state and token persistence.

## Development rules

- Keep backend and frontend behavior consistent when changing APIs.
- If you add or rename a field in a schema or model, update both the backend and frontend usage sites.
- Prefer using existing route and service patterns instead of creating new ad hoc implementations.
- Preserve the current JWT-based auth flow unless the task explicitly changes it.
- Do not introduce breaking changes to the public API contract without updating docs.

## Working conventions

- Use SQLAlchemy models for DB access, not raw SQL queries.
- Use FastAPI dependency injection for database sessions and auth checks.
- Keep business logic in `services/` and route handlers thin.
- Treat the `uploads/` directory as a runtime artifact, not as a source of business logic.
- Use environment variables from `.env` for secrets and config.

## Commands to run locally

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python main.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Admin seed

Run:

```bash
cd backend
python seed.py
```

This creates the default admin user:

- username: `admin`
- email: `admin@example.com`
- password: `admin123`

## Known repo notes

- The app currently uses SQLite for local development.
- CORS is permissive to simplify frontend-backend integration locally.
- There are some legacy/helper modules that overlap with the main API flow; keep changes aligned with the active router/service structure.
- Automated tests are not yet established in the repository.

## How to document changes

When implementing a feature or fix, update the relevant documentation in the project docs set:

- `README.md`
- `ARCHITECTURE.md`
- `docs/PRODUCT.md`
- `docs/DEVELOPMENT.md`
- `docs/TESTING.md`

## Acceptance checklist

Before considering work complete:

1. Backend starts without error.
2. Frontend builds or runs locally.
3. Auth and product flows still behave correctly.
4. Admin features remain protected by role-based checks.
5. Relevant docs reflect the new behavior.
