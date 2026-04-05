# Finance Dashboard Backend

Production-style backend for a Finance Dashboard with JWT authentication, strict role-based access control, financial records CRUD, and analytics aggregation APIs.

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT auth (`jsonwebtoken`)
- Validation with `express-validator`
- Logging with `morgan`
- API rate limiting with `express-rate-limit`

## Project Structure

```text
Finance_Management/
├─ scripts/
│  └─ seed.js
├─ src/
│  ├─ app.js
│  ├─ server.js
│  ├─ config/
│  │  ├─ db.js
│  │  └─ env.js
│  ├─ constants/
│  │  └─ roles.js
│  ├─ controllers/
│  │  ├─ authController.js
│  │  ├─ userController.js
│  │  ├─ recordController.js
│  │  └─ dashboardController.js
│  ├─ services/
│  │  ├─ authService.js
│  │  ├─ userService.js
│  │  ├─ recordService.js
│  │  └─ dashboardService.js
│  ├─ middlewares/
│  │  ├─ authMiddleware.js
│  │  ├─ validate.js
│  │  ├─ rateLimiter.js
│  │  ├─ notFound.js
│  │  └─ errorHandler.js
│  ├─ models/
│  │  ├─ User.js
│  │  └─ FinancialRecord.js
│  ├─ routes/
│  │  ├─ authRoutes.js
│  │  ├─ userRoutes.js
│  │  ├─ recordRoutes.js
│  │  └─ dashboardRoutes.js
│  ├─ validators/
│  │  ├─ authValidator.js
│  │  ├─ userValidator.js
│  │  └─ recordValidator.js
│  ├─ utils/
│  │  ├─ apiError.js
│  │  ├─ apiResponse.js
│  │  ├─ asyncHandler.js
│  │  └─ token.js
│  └─ docs/
│     └─ Finance-Dashboard.postman_collection.json
├─ .env.example
├─ .gitignore
├─ package.json
└─ README.md
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example`.

3. Start MongoDB locally (or use Atlas URI).

4. Run server:

```bash
npm run dev
```

## Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/finance_dashboard
JWT_SECRET=replace_with_strong_secret
JWT_EXPIRES_IN=1d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

## Authentication

- Register: `POST /api/v1/auth/register`
- Login: `POST /api/v1/auth/login`
- Send token in header:
  - `Authorization: Bearer <token>`

## Roles & Permission Matrix

| Capability | Viewer | Analyst | Admin |
|---|---|---|---|
| View records | Yes | Yes | Yes |
| View dashboard summary | Yes | Yes | Yes |
| Create/update/delete records | No | No | Yes |
| Update user role/status | No | No | Yes |

## API Endpoints

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

### Users (Admin only)

- `PATCH /api/v1/users/:id/role`
- `PATCH /api/v1/users/:id/status`

### Records

- `POST /api/v1/records` (Admin only)
- `GET /api/v1/records` (Viewer/Analyst/Admin)
- `GET /api/v1/records/:id` (Viewer/Analyst/Admin)
- `PATCH /api/v1/records/:id` (Admin only)
- `DELETE /api/v1/records/:id` (Admin only, soft delete)

#### Records Query Params

- `page`, `limit`
- `type` (`income|expense`)
- `category`
- `created_by`
- `startDate`, `endDate`
- `search` (matches category/notes)

### Dashboard

- `GET /api/v1/dashboard/summary`
  - returns:
    - total income
    - total expenses
    - net balance
    - category-wise totals
    - monthly trends
    - recent transactions (last 10)

## Example Requests

### Register

`POST /api/v1/auth/register`

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123"
}
```

Notes:
- Public registration always creates a `viewer`
- Privileged roles must be assigned by an `admin`

### Login

`POST /api/v1/auth/login`

```json
{
  "email": "admin@example.com",
  "password": "Password123"
}
```

### Create Record (Admin)

`POST /api/v1/records`

```json
{
  "amount": 1800,
  "type": "income",
  "category": "Salary",
  "date": "2026-04-01",
  "notes": "April payout"
}
```

## Response Shape

### Success

```json
{
  "success": true,
  "message": "Record created successfully",
  "data": {},
  "meta": null
}
```

### Error

```json
{
  "success": false,
  "message": "Validation failed",
  "details": []
}
```

## Validation & Error Handling

- Uses `express-validator` with reusable validator modules.
- Returns meaningful HTTP codes:
  - `200`, `201`, `400`, `401`, `403`, `404`, `422`, `500`
- Consistent error payload for validation/auth/business errors.

## Seed Script

Populate sample users and records:

```bash
npm run seed
```

Seed users:
- `admin@finance.local / Password123`
- `analyst@finance.local / Password123`
- `viewer@finance.local / Password123`

## Postman Collection

Import:

- `src/docs/Finance-Dashboard.postman_collection.json`

Set variables:
- `baseUrl`
- `token`
- `userId`
- `recordId`

## Testing Instructions

Automated test suite:

```bash
npm test
```

The test suite uses:
- `jest`
- `supertest`
- `mongodb-memory-server`

Optional:
- set `TEST_MONGO_URI` to run tests against an existing MongoDB instance instead of the in-memory server

Covered scenarios:
- authentication success and failure flows
- public registration cannot self-assign `admin`
- inactive users cannot log in
- viewer cannot create a record
- admin can create a record
- invalid record input returns `422`
- records filtering and pagination work correctly
- soft-deleted records no longer appear in reads
- dashboard analytics return correct totals
- invalid dashboard date ranges return `422`

Manual API verification:

1. `npm run seed`
2. Login as admin and store JWT token.
3. Test role-based restrictions:
   - viewer/analyst should get `403` on record mutation and user admin endpoints.
4. Verify record filters, search, and pagination.
5. Verify dashboard summary calculations and recent transactions.

## Design Decisions

- Layered architecture (controllers/services/models/middleware) for clear responsibilities.
- Aggregations use MongoDB pipeline to avoid app-level loops for analytics.
- Soft delete preserves financial history while hiding deleted records in queries.
- Centralized error handling keeps response shape stable and predictable.

## Assumptions

- Viewer and Analyst are read-only by policy.
- Admin may assign `created_by` at creation time, else defaults to authenticated admin.
- Dashboard endpoint can be filtered by optional date range and creator.

## Tradeoffs

- Simple JWT auth without refresh tokens for assessment scope.
- Jest + Supertest were added to satisfy the required backend test coverage.
- No Swagger integration; README + Postman collection provide API docs.

## Additional Notes

### Security Decisions

- Public signup is intentionally restricted to `viewer` so unauthenticated users cannot create privileged accounts.
- Inactive users are blocked both during login and while accessing protected APIs with a previously issued token.
- Role checks are centralized in `authorizeRoles(...)` middleware to keep access rules explicit and reusable.

### Data Modeling

- `User` stores `name`, `email`, hashed `password`, `role`, and `status`, with timestamps.
- `FinancialRecord` stores `amount`, `type`, `category`, `date`, `notes`, `created_by`, and soft-delete metadata.
- Indexes are defined for frequently queried fields such as `email`, `role`, `status`, `type`, `category`, `date`, and `created_by`.

### Dashboard Response Contents

`GET /api/v1/dashboard/summary` returns:
- `totalIncome`
- `totalExpenses`
- `netBalance`
- `categoryTotals`
- `monthlyTrends`
- `recentTransactions`

### Example Error Response

```json
{
  "success": false,
  "message": "Forbidden: insufficient permissions",
  "details": null
}
```

### Example Pagination Metadata

```json
{
  "page": 1,
  "limit": 10,
  "total": 42,
  "totalPages": 5
}
```
