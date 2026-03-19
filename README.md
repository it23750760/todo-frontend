# Todo Frontend (React + Vite)

## Overview
This is the React front-end for Lab 5. It fetches todo data from the .NET backend and displays it in a simple UI.

Important: the backend currently exposes only `GET /api/todos`. The UI actions (“Mark done/pending”, “Mark all done”, “Reset all”) update React state in the browser only and are **not persisted** to the backend.

## Tech Stack
- React (Vite)
- Frontend API call via `fetch`

## Local Development

### Start the backend
Follow the instructions in `todo-backend/README.md` (or run):
```bash
dotnet run
```
Expected backend URL:
- `http://localhost:5000/api/todos`

### Start the frontend
From inside `todo-frontend/`:

```bash
npm install
npm run dev
```

The dev server runs at:
- `http://localhost:3000/`

## Configuration (`VITE_API_URL`)
The frontend reads the API base URL from `VITE_API_URL`.

Environment example (`.env.example`):
```bash
VITE_API_URL=http://localhost:5000/api/todos
```

If you change your backend port or route, update `.env` accordingly.

## What the UI expects from the API
The backend endpoint must return a JSON array of todo items:

```json
[
  { "id": 1, "title": "Read the lab sheet", "isCompleted": true }
]
```

## Frontend Behavior Details
On load:
- The app calls `fetch(VITE_API_URL)`
- It sets React state with the returned array

When you toggle items:
- It updates the `isCompleted` property in local React state
- It does not send any `PUT/POST` request to the backend

After a browser refresh:
- The UI resets to whatever the backend returns (because backend state is in-memory demo data)

## Azure Deployment (Lab 5 style)
When you deploy:
1. Deploy React to **Azure Static Web Apps**
2. Deploy the .NET backend to **Azure App Service**
3. Update `VITE_API_URL` so the deployed React app calls your deployed backend:
   - `https://<your-api-app-name>.azurewebsites.net/api/todos`

Because `VITE_API_URL` is a build-time environment variable in Vite:
- set the correct value before running `vite build`, or
- configure it via your GitHub Actions workflow/environment settings for Static Web Apps (per your lab instructions).

