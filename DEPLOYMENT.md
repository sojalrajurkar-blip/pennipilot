# PennyPilot Deployment Guide (Render & Vercel)

This repository contains setup for deploying:
- **Backend (Spring Boot + PostgreSQL)** to [Render](https://render.com)
- **Frontend (React + Vite)** to [Vercel](https://vercel.com)

---

## 1. Backend Deployment on Render

### Method A: Using Render Blueprint (Recommended)
1. Push this repository to GitHub.
2. Log in to [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** -> **Blueprint**.
4. Connect your `pennypilot` GitHub repository.
5. Render will automatically detect `render.yaml` and set up:
   - **PostgreSQL Database** (`pennypilot-db`)
   - **Web Service** (`pennypilot-backend` using Docker)
6. Once deployed, copy your backend URL (e.g. `https://pennypilot-backend.onrender.com`).

### Method B: Manual Web Service Setup
1. **Create PostgreSQL Database**:
   - Go to Render -> **New +** -> **PostgreSQL**.
   - Set Name: `pennypilot-db`, Database: `pennypilot`, User: `pennypilot`.
   - Copy the **Internal Database URL** or connection credentials.
2. **Create Web Service**:
   - Render -> **New +** -> **Web Service**.
   - Connect repository.
   - **Root Directory**: `pennypilot-backend`
   - **Environment**: Docker (uses `Dockerfile`)
   - **Environment Variables**:
     - `CORS_ALLOWED_ORIGINS`: `https://your-vercel-app.vercel.app` (or `*`)
     - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://<db-host>:5432/pennypilot`
     - `DB_USERNAME`: `<db-user>`
     - `DB_PASSWORD`: `<db-password>`

---

## 2. Frontend Deployment on Vercel

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository (`pennypilot`).
4. Configure project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: Select `pennypilot-frontend`
5. Expand **Environment Variables**:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://<your-render-backend-url>/api/v1` (e.g., `https://pennypilot-backend.onrender.com/api/v1`)
6. Click **Deploy**.

---

## Notes & SPA Routing
- The frontend includes `pennypilot-frontend/vercel.json` to handle client-side routing (SPA fallback to `index.html`).
- Backend CORS configuration dynamically reads `CORS_ALLOWED_ORIGINS` to allow communication from Vercel.
