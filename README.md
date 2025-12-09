# PadhaiOn - Educational Platform (MERN Stack)

A full-stack educational platform connecting students with schools, colleges, and coaching centers.

## Project Structure

\`\`\`
padhaion/
├── backend/          # Node.js + Express + MongoDB backend
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   ├── scripts/      # Database seeding scripts
│   ├── server.js     # Express server
│   └── package.json
│
└── frontend/         # React + Vite frontend
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── pages/       # Page components
    │   ├── services/    # API service layer
    │   └── App.jsx
    └── package.json
\`\`\`

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
\`\`\`bash
cd backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create `.env` file:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Update `.env` with your MongoDB URI and JWT secret

5. Start MongoDB service

6. Seed the database:
\`\`\`bash
npm run seed
\`\`\`

7. Start the backend server:
\`\`\`bash
npm run dev
\`\`\`

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
\`\`\`bash
cd frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create `.env` file:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

Frontend will run on `http://localhost:5173`

## Features

- 🏫 Browse and search educational institutions
- 📝 Read educational blog articles
- 📚 View available courses
- 👤 User authentication and profiles
- 📅 Book free consultations
- 💬 Send inquiries to institutions
- ✉️ Contact form
- ⭐ Testimonials

## API Endpoints

See `backend/README.md` for complete API documentation.

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

### Frontend
- React 18
- Vite
- React Router v6
- Axios
- Tailwind CSS
- Lucide React Icons

## Development

- Backend runs on port 5000
- Frontend runs on port 5173
- MongoDB runs on port 27017

## Production Build

### Backend
\`\`\`bash
cd backend
npm start
\`\`\`

### Frontend
\`\`\`bash
cd frontend
npm run build
npm run preview
\`\`\`

## License

MIT
