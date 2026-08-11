# Development Guide

## Local setup

### 1. Clone and open the repo

```bash
cd /home/htetagg/Final_Project_Python
```

### 2. Set up the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 3. Configure environment

The backend reads variables from `backend/.env`. Make sure the file exists and contains valid values before starting the API.

Example:

```env
SECRET_KEY = "fiaief9093fjaiJIEIFiwIE29"
ALGORITHM = HS256
ACCESS_TOKEN_EXPIRE_MINUTES = 30
DATABASE_URI="sqlite:///./sql_app.db"
```

### 4. Start the backend

```bash
python main.py
```

This starts the FastAPI app via Uvicorn on port `8000`.

### 5. Start the frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend is served by Vite and usually runs on port `5173`.

## Project structure by development concern

### Backend

- `main.py` bootstraps the app and runs Uvicorn
- `utils/app.py` creates the FastAPI app and router registrations
- `config/database.py` sets up SQLAlchemy connection and database session
- `models/user_model.py` defines the domain model
- `services/` contains application logic
- `schemas/` validates request/response payloads
- `routers/` exposes HTTP endpoints

### Frontend

- `src/App.jsx` sets up routing
- `src/context/AuthContext.jsx` handles user state and JWT handling
- `src/components/` contains page-level UI components
- `src/index.css` contains shared app styling and Tailwind setup

## Common workflows

### Seed default admin

```bash
cd backend
python seed.py
```

### Run API manually

```bash
cd backend
source .venv/bin/activate
uvicorn utils.app:app --reload --host 0.0.0.0 --port 8000
```

### Build frontend

```bash
cd frontend
npm run build
```

## Authentication development notes

- Tokens are stored in browser local storage.
- Axios authorization headers are set from the stored token in `AuthContext`.
- The backend uses `OAuth2PasswordBearer` with `tokenUrl="auth/login"`.
- Logout is implemented by adding the token to a runtime blacklist.

## Database notes

- The project uses SQLite by default.
- Database tables are created automatically at startup with `Base.metadata.create_all(bind=engine)`.
- The database file is `backend/sql_app.db`.

## Static file handling

Product image uploads are saved under `backend/uploads/` and mounted via:

```python
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
```

## Debugging and issue handling

- If the backend cannot connect to the database, confirm `DATABASE_URI` in `.env`.
- If auth requests fail, verify that the token is set in local storage and that the backend route is protected by the correct dependency.
- If product images fail to upload, confirm the file type is an image and that the `uploads/` directory exists.
- If the frontend cannot communicate with the backend, check that both services are running and that CORS is enabled.

## Recommended standards

- Keep service logic separate from route logic.
- Preserve schema consistency between frontend payloads and backend models.
- Validate env config before running the app.
- Avoid leaving debug-only content or incomplete API stubs in production routes.
- Prefer updating docs whenever public behavior changes.

## Known implementation caveats

- Some auth-related code is duplicated across modules.
- There are helper files that appear to be leftovers from earlier project iterations.
- No migration framework is configured yet.
