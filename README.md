# Case Management System (MERN)

An intranet-ready MERN application that helps legal/administrative teams track cases end-to-end (metadata, courts/judges, hearings, remarks, and documents) with role-based permissions.

## Overview (What problem this solves)
In many organizations, case information is spread across spreadsheets, inbox threads, and personal notes. That makes it hard to answer basic operational questions quickly:

- What cases are upcoming this month?
- Which matters are pending vs in progress vs closed?
- Who is the focal person / law officer for a matter?
- Where is the latest order / notice / attachment?

This project centralizes case records into a searchable system with consistent master data (courts, judges, subject matters, etc.), enabling teams to manage hearings and documentation with less manual coordination.

## Key Features
- Case CRUD with rich metadata (status, court/location, subject matter, contacts, revenue, tasks)
- Dashboard summary counts + hearing-date calendar highlights
- Filtering by `status` and next-hearing date ranges
- Master data modules: courts, locations, benches, judges, departments, designations, statuses, subject matters
- Document handling: upload a main case file + per-remark attachments; download/open stored files
- User management with permissions (`read-only` vs `read-write`)

## Tech Stack
**Frontend**
- React (Vite)
- React Router
- Tailwind CSS + Radix primitives (shadcn/ui-style components)
- Axios (API calls)
- Sonner (toast notifications)

**Backend**
- Node.js
- Express
- MongoDB + Mongoose
- Multer (multipart uploads)
- bcryptjs (password hashing)

**Database**
- MongoDB

**Deployment**
- Designed for organizational deployment on a **virtual machine** or **local network** (intranet)
- Typical setup: reverse proxy (IIS/Nginx) → static frontend build + Node/Express API → MongoDB

## Architecture (High-level flow)
1. A user authenticates in the React UI.
2. The frontend calls the Express REST API (default: `http://localhost:5000`).
3. The API performs CRUD and aggregation queries via Mongoose models.
4. Uploaded documents are stored on disk in `backend/uploads/`.
5. Files are served at `GET /uploads/<filename>` and can be downloaded via `GET /api/cases/download/<filename>`.

## Repo Structure
```text
Case Management System/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    scripts/
    uploads/
    server.js
    package.json
  frontend/
    src/
    public/
    vite.config.js
    package.json
  README.md
  .gitignore
  package.json
```

## My Role
I built this project end-to-end as a solo developer:

- Designed MongoDB schemas and entity relationships (cases, courts, judges, subject matters, etc.).
- Implemented REST APIs (CRUD, filtering, counts summary) and file upload/download handling.
- Built the React UI (dashboard, lists, forms, modals, navigation, protected routes).
- Implemented permission-aware UX (read-only vs read-write actions).
- Added a seeding script for generating realistic demo/dev data.

## Screenshots / Demo
_(Placeholders — add images later)_

- Dashboard: `./screenshots/dashboard.png`
- Cases list: `./screenshots/cases-list.png`
- Case form + attachments: `./screenshots/case-form.png`
- User management: `./screenshots/users.png`

## How to Run Locally

### Prerequisites
- Node.js (18+ recommended)
- MongoDB running locally or reachable over the network

### 1) Backend (API)
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
MongoURI=mongodb://127.0.0.1:27017/case_management
PORT=5000
```

Run the backend:
```bash
npm run dev
```

API will be available at `http://localhost:5000`.

### 2) (Optional) Seed demo data
This seed command **purges data** in the seeded collections and inserts a fresh demo dataset.

```bash
cd backend
npm run seed
```

### 3) Frontend (UI)
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

### 4) Default admin credentials
Default admin login:

- Username: `admin`
- Password: `admin1`

Important security note:
- The backend creates the `admin` account only if it does not exist yet (password from `ADMIN_INITIAL_PASSWORD`, default `admin1` for local dev). An existing password is never reset on startup.
- For any real deployment, set a strong `ADMIN_INITIAL_PASSWORD` and change the default credentials after first login.

## Future Improvements
- Implement secure authentication (JWT or sessions), password policy, and account lockout
- Add audit trail (who changed what, when) and exportable activity logs
- Add pagination + server-side searching for large datasets
- Standardize validation and error responses (e.g., Zod/Joi + consistent API error shape)
- Add tests (API: supertest; UI: component tests)
- Deployment hardening: rate limiting, backup/restore strategy, upload retention policies

## Deployment

The app is deployed to **Azure Container Apps** (Consumption plan, scales to zero) with **MongoDB Atlas** and images published to **GitHub Container Registry** by **GitHub Actions**.

### Architecture

```
Internet → https://<frontend-fqdn>   cms-frontend (nginx: static UI + reverse proxy)
                └─ /api/*, /uploads/* → http://cms-backend.internal...  cms-backend (Express, internal-only ingress)
                                           └─ MONGO_URI → MongoDB Atlas
```

- The backend is only reachable from inside the Azure Container Apps environment (it has no API auth yet — keep it internal).
- Uploaded case files persist on an **Azure Files** share mounted at `/app/uploads` (survives scale-to-zero).
- Both apps scale `min 0 / max 1` replicas (cold start of a few seconds after idle).

### Environment variables

| Variable | Where | Description |
|----------|-------|-------------|
| `MONGO_URI` | backend (secret) | Atlas SRV string, incl. database name (e.g. `/case_management`) |
| `PORT` | backend | Container listens on `8080` in production |
| `ALLOWED_ORIGINS` | backend | Comma-separated CORS allowlist (empty = allow all, dev only) |
| `ADMIN_INITIAL_PASSWORD` | backend (secret) | Password for the initial `admin` user (created only if missing) |
| `VITE_API_BASE_URL` | frontend **build arg** | Empty in production (same-origin); `http://localhost:5000` in dev |
| `BACKEND_URL` | frontend (runtime) | Internal URL nginx proxies to (set by provisioning) |

Templates: `backend/.env.example`, `frontend/.env.example`, `.env.example` (compose).

### CI/CD (`.github/workflows/ci-cd.yml`)

On every push to `main` (or manual `workflow_dispatch`):
1. **build** — ESLint + Vite build, backend syntax check, then builds & pushes
   `ghcr.io/<owner>/<repo>-backend` and `-frontend` tagged `:{sha}` and `:latest`
2. **deploy** — Azure OIDC login → syncs the `MONGO_URI` secret → updates both
   Container Apps to the new image → waits for revisions → smoke-tests
   `https://<frontend>/health` (full chain: nginx → proxy → API → MongoDB)

Required GitHub Actions secrets:

| Secret | Value |
|--------|-------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `AZURE_CLIENT_ID` | Azure AD app (federated credential) client ID |
| `AZURE_TENANT_ID` | Azure AD tenant ID |
| `AZURE_SUBSCRIPTION_ID` | Azure subscription ID |

> The **deploy** job only works after the Azure resources exist
> (`rg-case-project`, environment `env-case-project`, container apps
> `cms-frontend`/`cms-backend`, Azure Files share). Provisioning is done once
> via `infra/provision.ps1`.

### Local smoke-test with Docker

```bash
cp .env.example .env        # set MONGO_URI
docker compose up --build
# open http://localhost:8080
```
