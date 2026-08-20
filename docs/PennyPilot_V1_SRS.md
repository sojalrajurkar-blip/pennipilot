# Software Requirements Specification (SRS)

## PennyPilot — Version 1: Core Expense Tracker

| Field | Value |
|---|---|
| Document Type | Software Requirements Specification |
| Product | PennyPilot |
| Version | V1.0 — Core Expense Tracker |
| Status | Draft for Implementation |
| Backend | Java 21, Spring Boot 3.x |
| ORM | Spring Data JPA (Hibernate) |
| Database | PostgreSQL 16 |
| Migration Tool | Flyway |
| Frontend | React 18 (Vite) |
| Build Tool (Backend) | Maven |
| Target IDE / Agent | Google Antigravity |

---

## 1. Introduction

### 1.1 Purpose

This document specifies the functional and non-functional requirements, architecture, database schema, and API contract for **PennyPilot V1**, the first production release of the PennyPilot personal finance platform. V1 delivers a single-user, production-ready **expense tracker**. It intentionally excludes authentication, income, accounts, analytics, and budgeting — these are scoped for later versions per the product roadmap.

### 1.2 Scope

PennyPilot V1 allows a user to:

- Create, view, update, and delete expenses
- View all expenses with basic filtering by category and date
- View a basic summary (total amount spent, number of expenses)
- Use a responsive web dashboard to perform all the above

V1 is single-tenant (no login/authentication). All expenses belong to the same implicit workspace. Multi-user support, RBAC, and authentication are explicitly deferred to V5.

### 1.3 Out of Scope for V1 (deferred to later versions)

| Capability | Target Version |
|---|---|
| Search, sorting, pagination | V2 |
| Analytics & budgets | V3 |
| Income, accounts, payment methods | V4 |
| Authentication, multi-user, RBAC | V5 |
| Advanced web UX, dark mode, etc. | V6 |
| Mobile app | V7 |
| Recurring transactions, file uploads, notifications | V8 |
| Caching, async processing, load testing | V9 |
| VAPT / advanced security hardening | V10 |
| AI features | V11+ |

### 1.4 Definitions & Acronyms

| Term | Meaning |
|---|---|
| DTO | Data Transfer Object |
| CRUD | Create, Read, Update, Delete |
| SRS | Software Requirements Specification |
| ORM | Object Relational Mapping |
| API | Application Programming Interface |

---

## 2. Overall Description

### 2.1 Product Perspective

PennyPilot V1 is a standalone two-tier web application:

```text
┌────────────────────┐        HTTPS/REST/JSON        ┌──────────────────────┐        JDBC        ┌──────────────┐
│   React Frontend    │ ─────────────────────────────▶ │  Spring Boot Backend │ ──────────────────▶ │  PostgreSQL   │
│  (Vite, SPA, CSR)    │ ◀───────────────────────────── │   REST API (v1)      │ ◀────────────────── │   Database    │
└────────────────────┘                                 └──────────────────────┘                     └──────────────┘
```

### 2.2 User Class

Single implicit user (no login). Referred to as "the user" throughout this document.

### 2.3 Assumptions & Constraints

- No authentication in V1; the API is open (to be secured behind auth starting V5).
- Single currency assumed (INR by default, but stored as a plain numeric amount — currency symbol is a frontend display concern in V1).
- Deployed as two independently deployable artifacts: a Spring Boot JAR and a static React build.
- All timestamps stored in UTC.

---

## 3. Technology Stack

| Layer | Technology | Notes |
|---|---|---|
| Language (Backend) | Java 21 | LTS |
| Framework | Spring Boot 3.3.x | `spring-boot-starter-web`, `spring-boot-starter-validation` |
| ORM | Spring Data JPA (Hibernate 6) | `spring-boot-starter-data-jpa` |
| Database | PostgreSQL 16 | `org.postgresql:postgresql` driver |
| Migration | Flyway (`flyway-core`, `flyway-database-postgresql`) | Versioned SQL migrations |
| Build Tool | Maven | `pom.xml` |
| API Docs | springdoc-openapi (Swagger UI) | `/swagger-ui.html` |
| Mapping | MapStruct (or manual mappers) | Entity ↔ DTO |
| Validation | Jakarta Bean Validation | `@Valid`, `@NotNull`, etc. |
| Testing (Backend) | JUnit 5, Mockito, Testcontainers (Postgres) | Unit + integration tests |
| Frontend | React 18 + Vite | SPA |
| Frontend HTTP client | Axios | |
| Frontend Routing | React Router v6 | |
| Frontend Styling | Tailwind CSS (or CSS Modules) | Responsive layout |
| Frontend State | React Query (TanStack Query) + local component state | Server-state caching |
| Frontend Testing | Vitest + React Testing Library | |
| Containerization | Docker, Docker Compose | Local dev: app + Postgres |
| CI | GitHub Actions | Build, test, lint on PR |

---

## 4. System Architecture (Backend)

Layered architecture, standard Spring Boot conventions:

```text
Controller Layer   → REST endpoints, request/response DTOs
Service Layer      → Business logic, validation orchestration
Repository Layer   → Spring Data JPA repositories
Entity Layer        → JPA entities mapped to DB tables
DTO Layer           → Request/response contracts (never expose entities directly)
Mapper Layer        → Entity <-> DTO conversion
Exception Layer      → Global exception handling (@ControllerAdvice)
Config Layer         → CORS, OpenAPI, Jackson, etc.
```

### 4.1 Design Principles Applied

- Controllers never accept or return JPA entities — only DTOs.
- All business validation occurs in the service layer; input shape validation occurs via Bean Validation annotations on DTOs.
- Global exception handler translates exceptions into a consistent JSON error format with correct HTTP status codes.
- Repository layer uses Spring Data JPA derived queries and `@Query` (JPQL) where needed — no native SQL in V1 unless required for filtering performance.

---

## 5. Backend Folder Structure

```text
pennypilot-backend/
├── pom.xml
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── src/
│   ├── main/
│   │   ├── java/com/pennypilot/
│   │   │   ├── PennyPilotApplication.java
│   │   │   │
│   │   │   ├── config/
│   │   │   │   ├── CorsConfig.java
│   │   │   │   ├── OpenApiConfig.java
│   │   │   │   └── JacksonConfig.java
│   │   │   │
│   │   │   ├── expense/
│   │   │   │   ├── Expense.java                  # JPA entity
│   │   │   │   ├── ExpenseCategory.java           # Enum
│   │   │   │   ├── ExpenseRepository.java         # Spring Data JPA repo
│   │   │   │   ├── ExpenseService.java            # Interface
│   │   │   │   ├── ExpenseServiceImpl.java
│   │   │   │   ├── ExpenseController.java
│   │   │   │   ├── ExpenseMapper.java             # MapStruct mapper
│   │   │   │   └── dto/
│   │   │   │       ├── ExpenseRequest.java
│   │   │   │       ├── ExpenseResponse.java
│   │   │   │       └── ExpenseSummaryResponse.java
│   │   │   │
│   │   │   ├── common/
│   │   │   │   ├── ApiErrorResponse.java
│   │   │   │   ├── ApiSuccessWrapper.java         # optional generic wrapper
│   │   │   │   └── PageResponse.java              # reserved for V2 pagination
│   │   │   │
│   │   │   └── exception/
│   │   │       ├── ResourceNotFoundException.java
│   │   │       ├── InvalidRequestException.java
│   │   │       └── GlobalExceptionHandler.java
│   │   │
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       ├── application-prod.yml
│   │       └── db/migration/
│   │           ├── V1__create_expenses_table.sql
│   │           └── V2__seed_expense_categories_reference.sql   (optional)
│   │
│   └── test/
│       └── java/com/pennypilot/
│           ├── expense/
│           │   ├── ExpenseServiceTest.java        # unit tests (Mockito)
│           │   ├── ExpenseControllerTest.java      # MockMvc slice tests
│           │   └── ExpenseRepositoryIT.java        # Testcontainers integration test
│           └── PennyPilotApplicationTests.java
```

---

## 6. Frontend Folder Structure

```text
pennypilot-frontend/
├── package.json
├── vite.config.js
├── .env.example
├── index.html
├── public/
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── api/
    │   ├── axiosClient.js
    │   └── expenseApi.js
    ├── components/
    │   ├── layout/
    │   │   ├── Header.jsx
    │   │   └── Sidebar.jsx
    │   ├── expense/
    │   │   ├── ExpenseList.jsx
    │   │   ├── ExpenseListItem.jsx
    │   │   ├── ExpenseForm.jsx
    │   │   ├── ExpenseFilterBar.jsx
    │   │   └── DeleteConfirmModal.jsx
    │   ├── dashboard/
    │   │   └── SummaryCard.jsx
    │   └── common/
    │       ├── Button.jsx
    │       ├── Input.jsx
    │       ├── Select.jsx
    │       ├── Loader.jsx
    │       └── ErrorBanner.jsx
    ├── pages/
    │   ├── DashboardPage.jsx
    │   ├── ExpenseListPage.jsx
    │   ├── AddExpensePage.jsx
    │   └── EditExpensePage.jsx
    ├── hooks/
    │   ├── useExpenses.js
    │   ├── useExpense.js
    │   ├── useCreateExpense.js
    │   ├── useUpdateExpense.js
    │   ├── useDeleteExpense.js
    │   └── useExpenseSummary.js
    ├── constants/
    │   └── categories.js
    ├── utils/
    │   ├── formatCurrency.js
    │   └── formatDate.js
    ├── router/
    │   └── AppRouter.jsx
    └── styles/
        └── index.css
```

---

## 7. Functional Requirements

| ID | Requirement |
|---|---|
| FR-1 | The system shall allow a user to create an expense with title, amount, category, expense date, and optional description. |
| FR-2 | The system shall allow a user to view a list of all expenses. |
| FR-3 | The system shall allow a user to view a single expense by its ID. |
| FR-4 | The system shall allow a user to update an existing expense. |
| FR-5 | The system shall allow a user to delete an existing expense. |
| FR-6 | The system shall restrict category to one of a fixed set of values: FOOD, TRANSPORT, SHOPPING, BILLS, HEALTH, ENTERTAINMENT, OTHER. |
| FR-7 | The system shall allow filtering the expense list by category. |
| FR-8 | The system shall allow filtering the expense list by a date or date range. |
| FR-9 | The system shall provide a summary showing total expense amount and total number of expenses (optionally scoped to the active filters). |
| FR-10 | The system shall validate that amount is a positive, non-zero number. |
| FR-11 | The system shall validate that title is non-blank and within a defined max length. |
| FR-12 | The system shall automatically record `createdAt` and `updatedAt` timestamps for every expense. |
| FR-13 | The system shall return a structured, consistent error response for all failure cases (validation errors, not-found, server errors). |
| FR-14 | The frontend shall present a dashboard, an expense list, add/edit forms, and delete confirmation. |
| FR-15 | The frontend shall be responsive across desktop, tablet, and mobile viewport widths. |

---

## 8. Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-1 | Performance | List endpoint shall respond within 300ms for up to 10,000 rows under normal local/staging load. |
| NFR-2 | Reliability | All database schema changes shall be applied exclusively through Flyway migrations — no manual DDL against production. |
| NFR-3 | Maintainability | Controllers shall not reference JPA entities directly; only DTOs cross the API boundary. |
| NFR-4 | Consistency | All API responses shall follow a single, consistent JSON envelope and error format. |
| NFR-5 | Portability | The backend shall run identically via `mvn spring-boot:run`, a packaged JAR, or a Docker container. |
| NFR-6 | Observability | The backend shall log all unhandled exceptions with a correlation-friendly format (timestamp, path, message). |
| NFR-7 | Testability | Core service logic shall have automated unit test coverage; repository layer shall have integration tests against a real PostgreSQL instance (Testcontainers). |
| NFR-8 | Usability | The frontend shall show loading and empty states, and human-readable error messages on failure. |
| NFR-9 | Documentation | The API shall be self-documented via OpenAPI/Swagger, available at `/swagger-ui.html`. |
| NFR-10 | Data Integrity | Deleting an expense shall be a hard delete in V1 (soft delete may be introduced in a later version if audit needs arise). |

---

## 9. Database Design

### 9.1 Entity Overview (V1)

V1 has a single core table: `expenses`. Category is modeled as a constrained `VARCHAR` (not a separate lookup table) to keep V1 simple; this may be normalized into a `categories` table in a later version if categories become user-defined.

### 9.2 ERD (textual)

```text
┌────────────────────────────┐
│          expenses           │
├────────────────────────────┤
│ id            BIGSERIAL PK  │
│ title         VARCHAR(150)  │
│ amount        NUMERIC(12,2) │
│ category      VARCHAR(30)   │
│ expense_date  DATE          │
│ description   VARCHAR(500)  │
│ created_at    TIMESTAMPTZ   │
│ updated_at    TIMESTAMPTZ   │
└────────────────────────────┘
```

### 9.3 DDL — Flyway Migration `V1__create_expenses_table.sql`

```sql
CREATE TABLE expenses (
    id             BIGSERIAL PRIMARY KEY,
    title          VARCHAR(150)     NOT NULL,
    amount         NUMERIC(12, 2)   NOT NULL CHECK (amount > 0),
    category       VARCHAR(30)      NOT NULL,
    expense_date   DATE             NOT NULL,
    description    VARCHAR(500),
    created_at     TIMESTAMPTZ      NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ      NOT NULL DEFAULT now(),

    CONSTRAINT chk_expense_category CHECK (
        category IN ('FOOD', 'TRANSPORT', 'SHOPPING', 'BILLS', 'HEALTH', 'ENTERTAINMENT', 'OTHER')
    )
);

CREATE INDEX idx_expenses_category ON expenses (category);
CREATE INDEX idx_expenses_expense_date ON expenses (expense_date);
```

> Note: Broader indexing/query optimization work (composite indexes, pagination-friendly indexes) is explicitly scoped to V2 per the roadmap. V1 includes only the minimal indexes needed for the basic filters it exposes.

### 9.4 JPA Entity Mapping Notes

- `Expense` entity maps 1:1 to the `expenses` table.
- `category` is mapped as a Java `enum ExpenseCategory` using `@Enumerated(EnumType.STRING)`.
- `createdAt`/`updatedAt` are populated via `@PrePersist` / `@PreUpdate` lifecycle callbacks (or `@CreationTimestamp` / `@UpdateTimestamp` from Hibernate).
- `amount` is mapped as `java.math.BigDecimal` (never `double`/`float`, to avoid rounding errors with money).

---

## 10. API Design

### 10.1 Conventions

- Base path: `/api/v1`
- Content type: `application/json`
- All list/collection responses in V1 return a plain JSON array (pagination envelope introduced in V2).
- Dates: `YYYY-MM-DD` (ISO-8601 date, no time component for `expenseDate`).
- Timestamps: ISO-8601 with offset, e.g. `2026-08-20T10:15:30Z`.
- Money: JSON number with up to 2 decimal places, serialized from `BigDecimal`.

### 10.2 Standard Error Envelope

```json
{
  "timestamp": "2026-08-20T10:15:30Z",
  "status": 404,
  "error": "NOT_FOUND",
  "message": "Expense not found with id: 42",
  "path": "/api/v1/expenses/42"
}
```

Validation errors additionally include a `fieldErrors` array:

```json
{
  "timestamp": "2026-08-20T10:15:30Z",
  "status": 400,
  "error": "VALIDATION_ERROR",
  "message": "Validation failed",
  "path": "/api/v1/expenses",
  "fieldErrors": [
    { "field": "amount", "message": "amount must be greater than 0" },
    { "field": "title", "message": "title must not be blank" }
  ]
}
```

### 10.3 Endpoints

#### 1. Create Expense

```
POST /api/v1/expenses
```

Request body:

```json
{
  "title": "Grocery shopping",
  "amount": 1450.50,
  "category": "FOOD",
  "expenseDate": "2026-08-18",
  "description": "Weekly groceries at BigBasket"
}
```

Success response — `201 Created`:

```json
{
  "id": 101,
  "title": "Grocery shopping",
  "amount": 1450.50,
  "category": "FOOD",
  "expenseDate": "2026-08-18",
  "description": "Weekly groceries at BigBasket",
  "createdAt": "2026-08-20T10:15:30Z",
  "updatedAt": "2026-08-20T10:15:30Z"
}
```

Failure: `400 Bad Request` (validation error envelope above).

#### 2. Get All Expenses (with basic filters)

```
GET /api/v1/expenses
GET /api/v1/expenses?category=FOOD
GET /api/v1/expenses?date=2026-08-18
GET /api/v1/expenses?fromDate=2026-08-01&toDate=2026-08-31
```

| Query Param | Type | Required | Description |
|---|---|---|---|
| `category` | string (enum) | No | Filter by exact category |
| `date` | date | No | Filter by exact expense date |
| `fromDate` | date | No | Start of date range (inclusive) |
| `toDate` | date | No | End of date range (inclusive) |

Success response — `200 OK`:

```json
[
  {
    "id": 101,
    "title": "Grocery shopping",
    "amount": 1450.50,
    "category": "FOOD",
    "expenseDate": "2026-08-18",
    "description": "Weekly groceries at BigBasket",
    "createdAt": "2026-08-20T10:15:30Z",
    "updatedAt": "2026-08-20T10:15:30Z"
  }
]
```

#### 3. Get Expense by ID

```
GET /api/v1/expenses/{id}
```

Success: `200 OK` (same shape as above, single object)
Failure: `404 Not Found` if the ID does not exist.

#### 4. Update Expense

```
PUT /api/v1/expenses/{id}
```

Request body: same shape as Create.
Success: `200 OK` with the updated expense.
Failure: `404 Not Found` if missing; `400 Bad Request` for invalid input.

#### 5. Delete Expense

```
DELETE /api/v1/expenses/{id}
```

Success: `204 No Content`
Failure: `404 Not Found` if missing.

#### 6. Get Summary

```
GET /api/v1/expenses/summary
GET /api/v1/expenses/summary?category=FOOD
GET /api/v1/expenses/summary?fromDate=2026-08-01&toDate=2026-08-31
```

Success — `200 OK`:

```json
{
  "totalAmount": 24500.75,
  "totalCount": 18
}
```

#### 7. Get Available Categories

```
GET /api/v1/categories
```

Success — `200 OK`:

```json
["FOOD", "TRANSPORT", "SHOPPING", "BILLS", "HEALTH", "ENTERTAINMENT", "OTHER"]
```

### 10.4 HTTP Status Code Standards

| Status | Meaning | Used For |
|---|---|---|
| 200 | OK | Successful GET/PUT |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation failure, malformed input |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Reserved for future use (e.g. duplicate constraints) |
| 500 | Internal Server Error | Unhandled server-side exception |

---

## 11. DTO Definitions

### 11.1 `ExpenseRequest` (used for create & update)

| Field | Type | Validation |
|---|---|---|
| `title` | String | `@NotBlank`, `@Size(max = 150)` |
| `amount` | BigDecimal | `@NotNull`, `@DecimalMin(value = "0.01")` |
| `category` | ExpenseCategory (enum) | `@NotNull` |
| `expenseDate` | LocalDate | `@NotNull`, must not be in the future (V1 rule) |
| `description` | String | `@Size(max = 500)`, optional |

### 11.2 `ExpenseResponse`

| Field | Type |
|---|---|
| `id` | Long |
| `title` | String |
| `amount` | BigDecimal |
| `category` | String |
| `expenseDate` | LocalDate |
| `description` | String |
| `createdAt` | Instant |
| `updatedAt` | Instant |

### 11.3 `ExpenseSummaryResponse`

| Field | Type |
|---|---|
| `totalAmount` | BigDecimal |
| `totalCount` | Long |

---

## 12. Exception Handling Strategy

`GlobalExceptionHandler` (`@RestControllerAdvice`) shall handle:

| Exception | HTTP Status | Error Code |
|---|---|---|
| `MethodArgumentNotValidException` | 400 | `VALIDATION_ERROR` |
| `ResourceNotFoundException` (custom) | 404 | `NOT_FOUND` |
| `InvalidRequestException` (custom) | 400 | `BAD_REQUEST` |
| `HttpMessageNotReadableException` | 400 | `MALFORMED_REQUEST` |
| `Exception` (fallback) | 500 | `INTERNAL_SERVER_ERROR` |

All responses follow the standard error envelope defined in §10.2.

---

## 13. Frontend Requirements Detail

### 13.1 Pages

| Page | Route | Description |
|---|---|---|
| Dashboard | `/` | Summary cards (total spent, total count) + recent expenses |
| Expense List | `/expenses` | Full list with category/date filter controls |
| Add Expense | `/expenses/new` | Form to create a new expense |
| Edit Expense | `/expenses/:id/edit` | Form pre-filled with existing expense data |

### 13.2 UI/UX Requirements

- Responsive layout: mobile-first, breakpoints for tablet and desktop.
- Loading states while API calls are in flight.
- Empty state when there are no expenses ("No expenses yet — add your first one").
- Inline field-level validation errors mapped from the API's `fieldErrors`.
- Delete requires a confirmation modal.
- Currency displayed with the ₹ symbol and thousands separators (display-only formatting; backend remains currency-agnostic in V1).

---

## 14. Configuration

### 14.1 `application.yml` (backend, key properties)

```yaml
spring:
  application:
    name: pennypilot-backend
  datasource:
    url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:pennypilot}
    username: ${DB_USERNAME:pennypilot}
    password: ${DB_PASSWORD:pennypilot}
  jpa:
    hibernate:
      ddl-auto: validate   # schema is owned by Flyway, not Hibernate
    open-in-view: false
    properties:
      hibernate:
        format_sql: true
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true

server:
  port: ${SERVER_PORT:8080}

springdoc:
  swagger-ui:
    path: /swagger-ui.html
```

> `ddl-auto: validate` ensures Hibernate never silently mutates the schema — Flyway migrations are the single source of truth for schema changes (NFR-2).

### 14.2 Frontend `.env.example`

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

---

## 15. Testing Scope (V1)

| Layer | Type | Tooling |
|---|---|---|
| Service layer | Unit tests (mocked repository) | JUnit 5 + Mockito |
| Repository layer | Integration tests against real Postgres | Testcontainers |
| Controller layer | Web-slice tests | `@WebMvcTest` + MockMvc |
| Migrations | Verified by app startup + Testcontainers integration tests | Flyway |
| Frontend components | Component tests | Vitest + React Testing Library |
| API contract (manual) | Exploratory + smoke testing | Swagger UI / Postman collection |

Minimum acceptance bar for V1 release: all CRUD paths and validation edge cases (missing title, non-positive amount, invalid category, future date) have automated test coverage.

---

## 16. Deployment Scope (V1)

- `Dockerfile` for the Spring Boot backend (multi-stage build: Maven build → slim JRE runtime image).
- `docker-compose.yml` for local development: `backend` + `postgres` services.
- GitHub Actions CI: build → run tests → (optional) build Docker image on push/PR to `main`.
- Frontend deployed as a static build (e.g., to any static hosting/CDN); backend deployed as a container to the chosen cloud target.
- Environment-specific configuration via environment variables (`application-prod.yml` + env vars, never hardcoded secrets).

---

## 17. Acceptance Criteria for V1 Release

V1 is considered **released** only when all of the following are true (per the roadmap's Production Release Criteria):

- [ ] All functional requirements (FR-1 to FR-15) implemented
- [ ] Flyway migration applies cleanly to a fresh PostgreSQL instance
- [ ] All API endpoints in §10.3 function correctly and match the documented contract
- [ ] Global exception handling returns the standard error envelope for all failure paths
- [ ] Automated backend tests (unit + integration) pass in CI
- [ ] Frontend renders dashboard, list, add, edit, and delete flows correctly against the live API
- [ ] Responsive layout verified on mobile, tablet, and desktop viewports
- [ ] Swagger/OpenAPI documentation is available and accurate
- [ ] CI pipeline (build, test) passes on the main branch
- [ ] Application is deployed to a real environment and a smoke test (create → list → update → delete an expense) succeeds against the deployed instance

---

*End of PennyPilot V1 SRS.*
