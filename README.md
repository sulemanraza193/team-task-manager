# 🗂 Team Task Manager

A full-stack web application that allows teams to manage tasks collaboratively. Built with React, Node.js, Express, and PostgreSQL.

## 🌐 Live Demo
- **Frontend:** [your-deployed-url]
- **Backend API:** [your-api-url]

## 📁 Project Structure

## ✨ Features

- 🔐 **Authentication** — Register and login securely with sessions and HTTP-only cookies
- 👥 **Team Management** — Create teams and add members via email
- ✅ **Task Management** — Create, assign, update, and delete tasks within teams
- 🔍 **Filter Tasks** — Filter tasks by team or assigned member
- 🛡 **Protected Routes** — All non-auth routes require authentication
- 🔒 **Security** — Passwords hashed with bcrypt, input validated with Joi

## 🛠 Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- Passport.js (Local Strategy)
- Express Session
- Bcrypt
- Joi Validation

### Database
- PostgreSQL (Neon Cloud)
- connect-pg-simple (session store)

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Git
- A [Neon](https://neon.tech) account (free PostgreSQL)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/team-task-manager.git
cd team-task-manager
```

### 2. Database Setup
1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project
3. Open the SQL Editor and run the following:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  creator_id INT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE team_members (
  team_id INT REFERENCES teams(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (team_id, user_id)
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  due_date DATE,
  team_id INT REFERENCES teams(id) ON DELETE CASCADE,
  assigned_to INT REFERENCES users(id) ON DELETE SET NULL,
  created_by INT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE session (
  sid VARCHAR NOT NULL COLLATE "default",
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL,
  CONSTRAINT session_pkey PRIMARY KEY (sid)
);
```

### 3. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder:
```env
PORT=5000
DATABASE_URL=your_neon_connection_string_here
SESSION_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
```

You should see:

### 4. Frontend Setup
```bash
cd client
npm install
```

Start the frontend:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login |
| POST | `/auth/logout` | Logout |
| GET | `/auth/me` | Get current user |

### Teams
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/teams` | Get all teams for user |
| POST | `/teams` | Create a new team |
| POST | `/teams/:id/members` | Add member to team |
| DELETE | `/teams/:id` | Delete a team (creator only) |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get tasks (filter by team or assignee) |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |
| GET | `/tasks/members/:teamId` | Get team members |

## 🔐 Security Practices
- Passwords hashed using **bcrypt** (salt rounds: 10)
- Sessions stored with **HTTP-only cookies**
- All routes protected with **auth middleware**
- Input validated and sanitized with **Joi**
- No sensitive data exposed in API responses

## 🌿 Git Branching Strategy
- `main` — production ready code
- `dev` — development branch
- `feature/auth` — authentication feature
- `feature/teams` — teams feature
- `feature/tasks` — tasks feature

## 👨‍💻 Author
- **Your Name**
- GitHub: [@yourusername](https://github.com/sulemanraza193)
