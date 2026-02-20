# TaskFlow 🗂️

A full-stack task management application with JWT authentication, built with **React.js** + **Node.js/Express** + **MongoDB**.

---

## 📁 Project Structure

```
taskflow/
├── backend/                    # Node.js + Express REST API
│   ├── src/
│   │   ├── config/db.js         # MongoDB connection
│   │   ├── controllers/         # Business logic (auth, user, task)
│   │   ├── middleware/          # JWT auth, error handler
│   │   ├── models/              # Mongoose schemas (User, Task)
│   │   ├── routes/              # Express routers
│   │   ├── app.js               # Express app config
│   │   └── server.js            # Entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/                   # React.js SPA
    ├── public/
    └── src/
        ├── api/                 # Axios instance + service functions
        ├── components/          # Reusable UI components
        │   ├── auth/            # ProtectedRoute
        │   └── dashboard/       # TaskCard, TaskModal, StatsBar, Sidebar
        ├── context/             # AuthContext (global state)
        ├── pages/               # LoginPage, RegisterPage, DashboardPage, ProfilePage
        ├── styles/              # global.css
        ├── App.js               # Routes
        └── index.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

---

### Backend Setup

```bash
cd backend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env: set MONGO_URI and JWT_SECRET

npm run dev   # starts on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
npm start     # starts on http://localhost:3000
```

> The frontend proxies API requests to `http://localhost:5000` (configured in `package.json`).

---

## ✅ Features

| Feature | Details |
|---|---|
| 🔐 Register / Login | JWT-based, bcrypt password hashing |
| 🔒 Protected Routes | `/dashboard` and `/profile` require auth |
| 📋 Task CRUD | Create, read, update, delete tasks |
| 🔍 Search & Filter | Filter by status, priority; search by title/desc |
| 📊 Stats Dashboard | Real-time task completion stats |
| 👤 Profile Management | Update name/bio; change password |
| 📱 Responsive Design | Works on mobile, tablet, and desktop |
| 🔔 Toast Notifications | User-friendly feedback on all actions |

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | API server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/taskflow` |
| `JWT_SECRET` | Secret key for JWT signing (32+ chars) | `my_super_secret_key_...` |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:3000` |

### Frontend (`frontend/.env`) — optional

| Variable | Default |
|---|---|
| `REACT_APP_API_URL` | `http://localhost:5000/api` |

---

## 📮 API Overview

See [`API_DOCS.md`](./API_DOCS.md) for the full reference.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Register a new user |
| POST | `/api/auth/login` | ❌ | Login, receive JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/users/profile` | ✅ | Get user profile |
| PUT | `/api/users/profile` | ✅ | Update profile |
| PUT | `/api/users/change-password` | ✅ | Change password |
| GET | `/api/tasks` | ✅ | List tasks (with filters) |
| POST | `/api/tasks` | ✅ | Create a task |
| PUT | `/api/tasks/:id` | ✅ | Update a task |
| DELETE | `/api/tasks/:id` | ✅ | Delete a task |
| GET | `/api/tasks/stats` | ✅ | Get task statistics |

---

## 🔐 Security Practices

- **Password hashing** — bcrypt with 12 salt rounds
- **JWT middleware** — all protected routes validate token on every request
- **Input validation** — `express-validator` on backend; `react-hook-form` on frontend
- **User isolation** — tasks are always filtered by `user._id`; users can't access others' data
- **CORS** — only the configured `FRONTEND_URL` is allowed
- **Error handling** — global error handler with environment-aware stack traces
- **Body size limit** — JSON payloads capped at 10kb

---

## 📈 Scaling Note

See [`SCALING.md`](./SCALING.md) for the full production scaling strategy.