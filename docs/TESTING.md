# Testing Guide

## Current testing status

This repository does not currently include a formal automated test suite for backend or frontend coverage. The project is set up as a development/demo application and has no `pytest`, `vitest`, or `jest` configuration in the repo at present.

## Recommended testing strategy

A practical approach for this project would include:

### Backend tests

- Auth flow tests for registration, login, refresh, and logout
- Product API tests for list, create, update, and delete
- Order workflow tests for creation, stock validation, and status updates
- Payment processing validation
- Authorization tests to enforce admin-only access

### Frontend tests

- Login and registration form behavior
- Protected route access for admin users
- Product listing and product purchase flow
- Admin dashboard CRUD actions

## Suggested tools

### Backend

- `pytest`
- `httpx` for API testing
- `pytest-asyncio` if async patterns expand
- `SQLAlchemy` in-memory SQLite for isolated DB tests

### Frontend

- `vitest`
- `@testing-library/react`
- `@testing-library/user-event`

## Minimal validation checklist

Before declaring work complete, validate manually:

1. Backend starts with no import or startup errors.
2. Frontend runs without compile errors.
3. User can register and login.
4. Product catalog loads correctly.
5. Order creation works with stock validation.
6. Admin users can create and delete products.
7. Non-admin users cannot access admin routes.

## Example manual test flow

### API smoke test

```bash
cd backend
source .venv/bin/activate
python main.py
```

Then call the endpoints with curl or Postman:

```bash
curl http://localhost:8000/
curl http://localhost:8000/products/
```

### Auth smoke test

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"tester","email":"tester@example.com","password":"pass123"}'
```

### Admin seed smoke test

```bash
cd backend
python seed.py
```

Then log in as the seeded admin using the UI or an API request.

## Good testing practices for this repo

- Use real database behavior where possible instead of mocking the entire app layer.
- Test the route + service + model interaction together for business-critical flows.
- Keep tests deterministic and reset the SQLite DB between scenarios.
- Validate both success and error states, especially for auth and stock issues.

## Future improvements

Once the project grows, add:

- backend unit tests for each service function
- endpoint integration tests using a test DB
- frontend component tests for screens and forms
- CI pipeline checks with linting and test execution

## Suggested CI commands

```bash
cd backend
source .venv/bin/activate
pytest

cd ../frontend
npm run build
```

## Summary

The app is functional in a local dev environment, but it currently lacks automated test coverage. The next important improvement is to add a real backend test suite and a frontend test layer so feature changes are safer and regressions are caught earlier.
