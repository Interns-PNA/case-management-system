# Case Management System

A full‑stack web application for tracking legal cases end‑to‑end: case metadata, hearings, court/judge mappings, remarks, document uploads, and role-based access for internal staff.

## Overview
This system helps legal/administrative teams maintain a single source of truth for litigation/case records.

It is designed for organizations that need:
- Consistent record keeping across many cases
- A searchable operational view (by status, court, subject matter, hearing dates)
- Document handling (orders, notices, briefs, evidence)
- Controlled access (read-only vs read-write)

## Key Features
- **Case lifecycle management**: create, edit, delete, view; track status, revenue, ministry/department, and key contacts.
- **Upcoming hearings & calendar indicators**: dashboard highlights dates with hearings for quick navigation.
- **Master data modules**: courts, locations, judges, benches, departments, designations, statuses, subject matters.
- **File uploads & downloads**: attach a primary case file and optional per-remark attachments; served via `/uploads` and downloadable via an API endpoint.
- **Fast filtering**: backend supports filtering cases by `status` and by `startDate`/`endDate` (date-only supported).
- **User management + permissions**: create/update/delete users with `read-only` or `read-write` permissions.
- **Dashboard summary counts**: counts of cases by status plus totals for master-data entities.

## Tech Stack
Frontend:
- React (Vite)
- React Router
- Tailwind CSS + shadcn/ui-style components (Radix primitives)
- Axios
- Sonner (toast notifications)

Backend:
- Node.js + Express
- MongoDB via Mongoose
- Multer for uploads
- bcryptjs for password hashing

Database:
- MongoDB

Deployment:
- Intended to run on a **virtual machine** or **local network** inside the organization (intranet deployment).

## System Architecture
High-level flow:
1. **User logs in** from the React frontend.
2. Frontend calls the **Express API** (default: `http://localhost:5000`).
3. Express reads/writes data in **MongoDB** through Mongoose models.
4. Uploaded files are stored on disk in `backend/uploads/`.
5. Files are served directly via `GET /uploads/<filename>` and can be downloaded via `GET /api/cases/download/<filename>`.

Suggested deployment topology (intranet):
- Browser → Reverse proxy (Nginx/IIS) →
  - Frontend (static Vite build)
  - Backend API (Node/Express)
- Backend → MongoDB
- Backend → Local disk for uploads

## My Role
Solo implementation (end-to-end):
- Designed MongoDB schemas and relationships (cases, courts, judges, subject matters, etc.).
- Built the Express REST API (CRUD + filtering + file handling).
- Built the React UI (dashboard, lists, forms, modals, protected routes).
- Implemented authentication UX and permission-based UI gating.
- Added a database seeding script for demo/dev datasets.

## Screenshots / Demo
Add screenshots here later:
- Dashboard
- Cases list + filters
- Case details + file attachments
- Master data modules
- User management

## How to Run Locally
### Prerequisites
- Node.js 18+ recommended
- MongoDB (local instance or a reachable server)

### 1) Backend setup
From the project root:

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MongoURI=mongodb://127.0.0.1:27017/case_management
PORT=5000
```

Run the API:

```bash
npm run dev
```

Backend will start on `http://localhost:5000`.

#### Default admin behavior (important)
On server startup, the backend ensures an `admin` user exists and **resets the admin credentials**:
- Username: `admin`
- Password: `admin1`
- Permission: `read-write`

### 2) (Optional) Seed development data
The repo includes a destructive seed script (it purges collections before inserting demo data).

```bash
cd backend
npm run seed
```

Note: the seed script inserts `admin / Admin@123`, but **starting the server will reset admin to `admin / admin1`**.

### 3) Frontend setup
In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will start on `http://localhost:5173`.

### 4) Log in
Use:
- Username: `admin`
- Password: `admin1`

## Future Improvements
- **Configurable API base URL**: remove hardcoded `http://localhost:5000` in the frontend; use `.env` (`VITE_API_BASE_URL`) and an Axios client wrapper.
- **Stronger authentication**: issue signed tokens (JWT) or server sessions; protect sensitive routes and add password policies.
- **Audit logging**: record who changed what and when (case edits, deletions, user changes).
- **Pagination + server-side search**: improve performance for large datasets.
- **Validation and error handling**: consistent request validation (e.g., Zod/Joi) and standardized API errors.
- **Automated tests**: API tests (supertest) and frontend component tests.
- **Deployment hardening**: CORS allowlist, rate limits, backups, upload retention policies, and secrets management.
