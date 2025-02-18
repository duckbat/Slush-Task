# Slush Blog Assignment Application

## About the Project 💻

This project is a PERN-stack assignment blog application built with TypeScript, React, and Node.js. It features user authentication, CRUD backend and Blogs functionalitites.

The application uses **Express.js** + **TypeScript** for the backend and **React** with **TypeScript** for the frontend.

Application is proudly deployed here:

https://slush-task.netlify.app/

You can also check API Documentation here:

https://slush-backend.onrender.com/api-docs

---

## Features ✨

- **User Authentication**: JWT-based authentication system
- **Post Management**: Create, read, update, and delete blog posts
- **User Profiles**: Create and Login with user profiles
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **API Documentation**: Swagger documentation for backend API
- **Testing**: Unit tests and Insomnia test for backend

---

## Libraries and Tools Used 📚

### Core Libraries

- **Frontend**:
  - React
  - TypeScript
  - TailwindCSS
  - React Router
- **Backend**:
  - Express.js
  - TypeScript
  - PostgreSQL
  - JWT
  
- **Deployment**:
  - [**Netlify**](https://www.netlify.com/) for Front-end
  - [**Render**](https://render.com/) for Back-end and PostgreSQL database

- **DB Diagram**:
  ![DB-Diagram](/db/diagram.png)

### Testing

- Insomnia
- Supertest

---

## Setup & Usage 🚀 (Locally)

### Prerequisites

- Node.js 18+
- PostgreSQL
- npm

### Database Setup (Locally)

1. Create a PostgreSQL database:

```bash
createdb Slush_db
```

2. User Slush-db.sql in /db folder to paste the database and mock data to PostgreSQL

### Backend Setup

1. Navigate to server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=postgres
DB_PASS=password
DB_NAME=Slush-db
DB_PORT=5432

# Application Configuration
NODE_ENV=development
APP_PORT=3000
JWT_SECRET=secret
```

4. Start the server:

```bash
npm run dev
```

### Frontend Setup

1. Navigate to client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
```

4. Start the development server:

```bash
npm run dev
```

Access the application at:

```bash
http://localhost:5173
```

---

## API Documentation 📝

The API documentation is available through Swagger UI when the server is running:

```bash
http://localhost:3000/api-docs
```

---

## Testing 🧪

### Backend Tests

```bash
cd server
npm test
```
- For **Insomnia** tests, you can use exported **Insomia** JSON file located in ```/db``` folder.

---

## Further imporvements ✶
- Use *Zustand* as a state manager
- Create CI/CD pipeline with *GitHub Actions* for the project
- Write unit tests for Front-end using *Vitest*
- Improve UI by adding animation and better styling
- Use React.Memo to optimize re-renders
