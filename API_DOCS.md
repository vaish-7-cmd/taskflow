# TaskFlow API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require: `Authorization: Bearer <token>`

---

## 🔐 Authentication

### POST `/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "Alex Johnson",
  "email": "alex@example.com",
  "password": "mypassword123"
}
```

**Response `201`:**
```json
{
  "token": "eyJhbGci...",
  "user": {
    "_id": "64a...",
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "bio": "",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:** `400` validation error | `409` email already exists

---

### POST `/auth/login`
Login and receive JWT.

**Request Body:**
```json
{
  "email": "alex@example.com",
  "password": "mypassword123"
}
```

**Response `200`:** Same as register response.

**Errors:** `400` validation | `401` invalid credentials

---

### GET `/auth/me` 🔒
Get the currently authenticated user.

**Response `200`:**
```json
{
  "user": { "_id": "...", "name": "...", "email": "...", "bio": "..." }
}
```

---

## 👤 Users

### GET `/users/profile` 🔒
Get the authenticated user's profile.

### PUT `/users/profile` 🔒
Update profile information.

**Request Body:**
```json
{
  "name": "Alex J.",
  "bio": "Developer & designer"
}
```

**Response `200`:**
```json
{
  "user": { "..." },
  "message": "Profile updated successfully."
}
```

---

### PUT `/users/change-password` 🔒
Change user password.

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

**Response `200`:**
```json
{ "message": "Password changed successfully." }
```

---

## 📋 Tasks

### GET `/tasks` 🔒
Get all tasks for the authenticated user.

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `search` | string | Search in title & description |
| `status` | string | Filter: `todo`, `in-progress`, `done` |
| `priority` | string | Filter: `low`, `medium`, `high` |
| `sort` | string | Sort field (default: `-createdAt`) |
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 20) |

**Response `200`:**
```json
{
  "tasks": [
    {
      "_id": "64b...",
      "title": "Build the frontend",
      "description": "Create all React components",
      "status": "in-progress",
      "priority": "high",
      "dueDate": "2024-12-31T00:00:00.000Z",
      "user": "64a...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-02T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "pages": 1
  }
}
```

---

### POST `/tasks` 🔒
Create a new task.

**Request Body:**
```json
{
  "title": "Write unit tests",
  "description": "Cover all API endpoints",
  "status": "todo",
  "priority": "medium",
  "dueDate": "2024-12-25"
}
```

**Response `201`:**
```json
{
  "task": { "..." },
  "message": "Task created."
}
```

---

### PUT `/tasks/:id` 🔒
Update a task. Same body as create.

**Response `200`:**
```json
{
  "task": { "..." },
  "message": "Task updated."
}
```

**Errors:** `404` task not found or doesn't belong to user

---

### DELETE `/tasks/:id` 🔒
Delete a task.

**Response `200`:**
```json
{ "message": "Task deleted." }
```

---

### GET `/tasks/stats` 🔒
Get task count by status.

**Response `200`:**
```json
{
  "stats": {
    "todo": 3,
    "in-progress": 2,
    "done": 10,
    "total": 15
  }
}
```

---

## ❌ Error Format

All error responses follow this format:
```json
{
  "message": "Human-readable error description."
}
```

Common HTTP status codes:
- `400` — Validation error
- `401` — Not authenticated / token invalid
- `404` — Resource not found
- `409` — Conflict (e.g. duplicate email)
- `500` — Internal server error