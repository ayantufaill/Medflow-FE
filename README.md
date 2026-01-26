# MedFlow Frontend

A modern React application built with Vite, Material UI, and React Hook Form for the MedFlow healthcare management system.

## Features

- 🔐 Authentication (Login & Registration)
- 🎨 Material UI components
- 📝 Form validation with React Hook Form
- 🔒 Protected routes
- 🔄 Token refresh handling
- 🌍 Environment-based configuration

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (default: http://localhost:5000)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `.env.example` to `.env.development` for development
   - Copy `.env.example` to `.env.production` for production
   - Update the `VITE_API_BASE_URL` if your backend runs on a different port

## Environment Variables

Create `.env.development` and `.env.production` files in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=MedFlow
VITE_APP_ENV=development
```

For production:
```env
VITE_API_BASE_URL=/api
VITE_APP_NAME=MedFlow
VITE_APP_ENV=production
```

## Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port).

## Building for Production

Build the production bundle:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   │   └── shared/       # Shared components (ProtectedRoute, etc.)
│   ├── config/           # Configuration files
│   │   └── api.js        # Axios instance and interceptors
│   ├── contexts/         # React contexts
│   │   └── AuthContext.jsx  # Authentication context
│   ├── pages/            # Page components
│   │   ├── auth/         # Authentication pages
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   └── DashboardPage.jsx
│   ├── services/         # API services
│   │   └── auth.service.js
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── .env.development      # Development environment variables
├── .env.production       # Production environment variables
└── vite.config.js        # Vite configuration
```

## Authentication Flow

1. **Registration**: Users can create an account with email, password, and personal information
2. **Login**: Users authenticate with email and password
3. **Token Management**: Access tokens are stored in localStorage and automatically refreshed when expired
4. **Protected Routes**: Routes requiring authentication are protected by the `ProtectedRoute` component

## API Integration

The app integrates with the following backend endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/profile` - Get current user profile

## Technologies Used

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Material UI (MUI)** - Component library
- **React Router** - Routing
- **React Hook Form** - Form management
- **Axios** - HTTP client

## Linting

Run the linter:
```bash
npm run lint
```
