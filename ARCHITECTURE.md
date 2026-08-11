# Architecture

## System overview

This project is a classic client-server web application with a React frontend and a FastAPI API backend. The backend persists application data in SQLite and exposes endpoints for catalog, order, payment, and auth operations.

## High-level layers

### 1. Presentation layer

The frontend is a Vite React app in `frontend/`. It renders two main flows:

- storefront for browsing products and placing orders
- admin dashboard for inventory and order visibility

The app routes are defined in `frontend/src/App.jsx` and use React Router.

### 2. API layer

The backend is organized under `backend/routers/` and exposes the following modules:

- `auth.py`: registration, login, token refresh, profile retrieval, logout
- `products.py`: product listing, detail lookup, image upload, create/update/delete
- `orders.py`: placing orders, fetching user orders, fetching all orders, status updates
- `payments.py`: payment confirmation endpoint

Each router depends on database session injection and auth dependencies.

### 3. Business logic layer

The `backend/services/` package contains the domain logic:

- `product_service.py` handles catalog queries and inventory modification
- `order_service.py` computes totals, validates stock, and creates orders
- `payment_service.py` validates payment amount and marks order as paid
- `jwt_ser.py` creates and validates JWTs and token blacklist handling
- `setting.py` loads environment-based configuration

### 4. Data layer

Data is defined in `backend/models/user_model.py` using SQLAlchemy models:

- `User`
- `Product`
- `Order`
- `Payment`

The database is created via `Base.metadata.create_all(bind=engine)` in `backend/utils/app.py` using the SQLite connection defined in `backend/config/database.py`.

## Core domain model

### User

A user has:

- username
- email
- hashed password
- admin status
- created and updated timestamps
- relationship to orders

### Product

A product has:

- name
- description
- price
- stock
- category_id
- created and updated timestamps

### Order

An order belongs to a user and contains a collection of products. The order total is computed from product quantities and stock is decremented during creation.

### Payment

A payment record is associated with an order and stores:

- amount
- payment method
- status
- transaction id

## Authentication flow

The authentication system is JWT-based:

1. User submits credentials to `/auth/login` or `/auth/register`.
2. Backend validates credentials and returns access + refresh tokens.
3. The frontend stores the access token in local storage and sets Axios auth headers.
4. Protected routes depend on `get_current_user` and optional admin checks via `get_admin_user`.
5. Logout adds the token to an in-memory blacklist for the current runtime.

## Authorization model

- Regular users can browse products, place orders, and view their own orders.
- Admin users can access product management actions and the full order list.
- Access checks are enforced via FastAPI dependencies.

## Data flow examples

### Product browsing

```text
React storefront -> GET /products/ -> FastAPI router -> product_service.get_products() -> SQLAlchemy query -> SQLite
```

### Order placement

```text
User clicks Buy -> frontend posts order -> /orders/ -> order_service.create_order() -> validates stock -> updates product.stock -> creates Order -> persists to SQLite
```

### Admin create product

```text
Admin form -> POST /products/create -> product_service.create() -> Product model -> database commit -> API returns product JSON
```

## Runtime assumptions

- SQLite database file is created automatically if absent.
- file uploads are stored in the `backend/uploads/` directory and served from `/uploads`.
- Local development is designed around `localhost` origins and permissive CORS.

## Architectural strengths

- Clear separation between routes, services, models, and schemas
- Simple deployment model for learning and local demos
- Easy path for feature extension by router and service modules

## Architectural limitations

- Uses a single SQLite database instead of a production-grade relational or distributed setup
- In-memory token blacklist is ephemeral and resets after server restart
- Some auth and service helper code appears duplicated and may be legacy
- No automated test suite is present in the current repository

## Suggested future evolution

- Add database migrations with Alembic
- Move sensitive config into environment secrets or deployment config
- Introduce stronger input validation and error-handling patterns
- Add unit and integration tests for auth, products, and orders
- Split frontend state into a more robust API layer and store management pattern
