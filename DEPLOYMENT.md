# PennyPilot Deployment Guide (Supabase + Render + Vercel)

Architecture:
- **Database**: [Supabase PostgreSQL](https://supabase.com)
- **Backend**: [Render Web Service (Spring Boot Docker)](https://render.com)
- **Frontend**: [Vercel (React + Vite SPA)](https://vercel.com)

---

## 1. Supabase Database Setup

1. Log in to [Supabase Dashboard](https://supabase.com/dashboard) and create a new project.
2. Go to **Project Settings** -> **Database**.
3. Under **Connection string** (URI / JDBC), get your credentials:
   - **Host**: `db.<project-ref>.supabase.co`
   - **Port**: `5432`
   - **Database name**: `postgres`
   - **User**: `postgres`
   - **Password**: `<your-db-password>`
4. Construct your JDBC connection string:
   `jdbc:postgresql://db.<project-ref>.supabase.co:5432/postgres?sslmode=require`

---

## 2. Backend Deployment on Render

1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** -> **Web Service** (or **Blueprint** with `render.yaml`).
3. Connect your GitHub repository `pennypilot`.
4. Configure Web Service:
   - **Root Directory**: `pennypilot-backend`
   - **Environment**: Docker
5. Set the **Environment Variables**:
   - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://db.<project-ref>.supabase.co:5432/postgres?sslmode=require`
   - `DB_USERNAME`: `postgres`
   - `DB_PASSWORD`: `<your-supabase-password>`
   - `CORS_ALLOWED_ORIGINS`: `https://*.vercel.app` (or your specific Vercel URL)
   - `PORT`: `8080`
6. Click **Deploy Web Service**. Flyway will automatically create all tables in Supabase on startup.
7. Copy your deployed Render backend URL (e.g. `https://pennypilot-backend.onrender.com`).

---

## 3. Frontend Deployment on Vercel

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** -> **Project** and import your GitHub repository.
3. Select **Root Directory**: `pennypilot-frontend`.
4. Add **Environment Variables**:
   - `VITE_API_BASE_URL`: `https://<your-render-backend-url>/api/v1`
5. Click **Deploy**.

---

## Technical Notes
- **CORS**: `CorsConfig.java` in backend supports `CORS_ALLOWED_ORIGINS` dynamically.
- **Routing**: `pennypilot-frontend/vercel.json` provides client-side SPA route rewrites.
