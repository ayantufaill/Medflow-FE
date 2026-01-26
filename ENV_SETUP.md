# Environment Setup Guide

## Development Environment

Create a `.env.development` file in the `frontend` directory with the following content:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=MedFlow
VITE_APP_ENV=development
```

## Production Environment

Create a `.env.production` file in the `frontend` directory with the following content:

```env
VITE_API_BASE_URL=/api
VITE_APP_NAME=MedFlow
VITE_APP_ENV=production
```

## Quick Setup

You can manually create these files or copy from `.env.example`:

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env.development
Copy-Item .env.example .env.production
```

**Linux/Mac:**
```bash
cp .env.example .env.development
cp .env.example .env.production
```

Then update the `VITE_API_BASE_URL` in each file according to your environment.

## Notes

- `.env.development` is used when running `npm run dev`
- `.env.production` is used when running `npm run build`
- These files are gitignored and should not be committed to version control
- Update `VITE_API_BASE_URL` to match your backend API URL

