# DealFlow360

DealFlow360 is an Intelligent, Self-Governing B2B Sales Operations Platform.

## Project Purpose
To provide a foundational architecture for managing B2B sales operations such as quotations, discounts, risks, and approvals.

## Tech Stack
**Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, Recharts.  
**Backend:** Node.js, Express, TypeScript, REST API, Zod.  
**Database:** PostgreSQL, node-postgres (`pg`). NO ORM.

## Architecture
- **API Flow:** Route -> Controller -> Service -> Repository -> pg -> PostgreSQL.
- **SQL Logic:** Contained only within repositories using parameterized queries.
- **Business Logic:** Resides in services.

## Project Structure
```
DealFlow360/
├── frontend/    # Vite React TS application
├── backend/     # Express TS application
├── database/    # Database scripts and schemas
├── docs/        # Documentation
├── README.md
└── .gitignore
```

## Local Setup
1. Clone the repository and switch to your branch: `git checkout <branch-name>`
2. Create `.env` files in both `frontend` and `backend` based on `.env.example`.

### Database Setup
We intentionally use direct PostgreSQL access via `pg` (NO Prisma/ORM) to maintain full control over SQL and leverage native Postgres constraints.
1. Create a local PostgreSQL database (e.g., `dealflow360`).
2. Set your `DATABASE_URL` in `backend/.env` (e.g., `postgres://user:pass@localhost:5432/dealflow360`).
3. Run the migrations and seed data:
```bash
cd backend
npm run db:setup
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## Git Branch Workflow
- Work on your dedicated development branch (e.g., `nishka-dev`).
- Do not commit to `main` directly.
