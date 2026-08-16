# LUXE E-Commerce

This repository contains a full-stack e-commerce demo built with a FastAPI backend and a React + Vite frontend. The application allows users to browse products, sign up or log in, place orders, and lets admin users manage the catalog and view order data.

## Project overview

- Backend: FastAPI API with SQLAlchemy + SQLite
- Frontend: React app powered by Vite and React Router
- Authentication: JWT-based login and refresh flow
- Database: SQLite file at `backend/sql_app.db`
- Static uploads: served from the backend `uploads/` directory

## Repository structure

```text
.
├── backend/
│   ├── config/
│   ├── models/
│   ├── routers/
│   ├── schemas/
│   ├── services/
│   ├── uploads/
│   ├── utils/
│   ├── .env
│   ├── main.py
│   ├── requirements.txt
│   ├── seed.py
│   └── sql_app.db
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── postcss.config.js
│   └── tailwind.config.js
├── docs/
│   ├── PRODUCT.md
│   ├── DEVELOPMENT.md
│   └── TESTING.md
├── AGENTS.md
├── ARCHITECTURE.md
└── README.md
```

## Tech stack

### Backend

- FastAPI
- SQLAlchemy ORM
- SQLite database
- Pydantic validation
- JWT authentication via `PyJWT`
- Passlib for password hashing

### Frontend

- React 18
- Vite
- React Router
- Axios for API calls
- Tailwind CSS

## Core features

- User registration and login
- JWT access/refresh token support
- Product catalog browsing
- Product create/update/delete via admin role
- Order placement and status tracking
- Payment simulation for pending orders
- Admin dashboard to view orders and inventory

## Default admin account

The app includes a seeding script for an admin account:

- Email: `admin@example.com`
- Username: `admin`
- Password: `admin123`

Run the seed script from the backend folder:

```bash
python seed.py
```

## Getting started

### 1. Backend setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python main.py
```

The API will run on:

```text
http://localhost:8000
```

### 2. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server will run on the Vite default port, usually:

```text
http://localhost:5173
```

## Environment configuration

The backend loads values from `backend/.env`. The current project configuration uses SQLite:

```env
SECRET_KEY = "fiaief9093fjaiJIEIFiwIE29"
ALGORITHM = HS256
ACCESS_TOKEN_EXPIRE_MINUTES = 30
DATABASE_URI="sqlite:///./sql_app.db"
```

The frontend reads its API base URL from `VITE_API_URL`. It defaults to
`https://backend-final-3ouo.onrender.com`; set the variable in `frontend/.env`
to use another backend during a build or local development:

```env
VITE_API_URL=http://localhost:8000
```

## Notes

- The project is a demo and some legacy/helper files remain, especially around auth and service duplication.
- The app uses a permissive CORS configuration for local development.
- Uploaded product images are stored under `backend/uploads/` and are exposed via `/uploads`.

## Documentation

- [AGENTS.md](AGENTS.md)
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [docs/PRODUCT.md](docs/PRODUCT.md)
- [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
- [docs/TESTING.md](docs/TESTING.md)

## Summary

This project demonstrates a lightweight commerce workflow: product discovery, authentication, order creation, and admin catalog management in a single monorepo setup.
