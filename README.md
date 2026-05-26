<<<<<<< HEAD
# Student Management System

A full-stack student management system with two-level AES encryption.

## Tech Stack

- **Frontend**: React, TypeScript, React Hook Form, Zod, CryptoJS
- **Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose
- **Auth**: JWT (jsonwebtoken)
- **Encryption**: CryptoJS AES

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB
- npm

### Server
```bash
cd server
npm install
npm run dev
```

Create `.env` from `.env.example`:
```env
PORT=8100
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_SECRET=your_frontend_secret_key
BACKEND_SECRET=your_backend_secret_key
FRONTEND_URL=your_frontend_url
```

### Client
```bash
cd client
npm install
npm run dev
```

Create `.env` from `.env.example`:
```env
VITE_FRONTEND_SECRET=your_frontend_secret_key
```

## API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/register | Public | Register a new student |
| POST | /api/login | Public | Student login |
| GET | /api/students | JWT Required | Fetch all students |
| PUT | /api/student/:id | JWT Required | Update student details |
| DELETE | /api/student/:id | JWT Required | Delete a student |

## How Encryption Works
=======
# student-management-system
>>>>>>> 8218e582e3d38426fbbcc5a673d5af586a9533b7
