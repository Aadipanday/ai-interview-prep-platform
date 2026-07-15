# AI Interview Prep Platform

A full-stack application that helps candidates prepare for specific roles. Upload a PDF resume and a job description to receive an AI-generated interview plan, including a match score, skill gaps, technical and behavioral questions, tailored answers, and a preparation roadmap.

## Features

- Secure registration, login, logout, and protected routes
- PDF resume upload and job-description analysis
- AI-generated interview reports with technical and behavioral questions
- Match score, identified skill gaps, and a personalised preparation roadmap
- Interview-report history for each user
- Resume PDF generation and download

## Tech Stack

- Frontend: React, Vite, React Router, Axios, and Sass
- Backend: Node.js, Express, MongoDB/Mongoose, JWT, Multer, and Google GenAI

## Project Structure

```text
GenAiProject/
├── frontend/    # React client
└── backend/     # Express API and AI integration
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- MongoDB connection string
- Google GenAI API key

### Backend

```bash
cd backend
npm install
```

Create `backend/.env` locally (do not commit it):

```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
JWT_SECRET=your_secure_jwt_secret
GOOGLE_GENAI_API_KEY=your_google_genai_api_key
```

Start the API:

```bash
npm run dev
```

### Frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. The backend is configured for this local frontend origin.

## API Overview

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/logout` | Sign out |
| GET | `/api/auth/get-me` | Get the authenticated user |
| POST | `/api/interview` | Create an interview report from a resume and job description |
| GET | `/api/interview` | List the user's reports |
| GET | `/api/interview/report/:interviewId` | Get one report |
| POST | `/api/interview/resume/pdf/:interviewReportId` | Generate a resume PDF |

## Notes

- Keep your API keys and database credentials in `backend/.env`.
- Do not commit `.env` files or `node_modules`; both are already ignored by Git.
- Use `npm install` to restore dependencies from the lock files.
