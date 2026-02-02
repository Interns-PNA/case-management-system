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
- The backend currently enforces/resets the `admin` account on server startup.
- For any real deployment, change the default credentials and remove the auto-reset behavior.

## Future Improvements
- Replace hardcoded API URLs with `VITE_API_BASE_URL` + a centralized Axios client
- Implement secure authentication (JWT or sessions), password policy, and account lockout
- Add audit trail (who changed what, when) and exportable activity logs
- Add pagination + server-side searching for large datasets
- Standardize validation and error responses (e.g., Zod/Joi + consistent API error shape)
- Add tests (API: supertest; UI: component tests) and a CI pipeline
- Deployment hardening: CORS allowlist, rate limiting, backup/restore strategy, upload retention policies
