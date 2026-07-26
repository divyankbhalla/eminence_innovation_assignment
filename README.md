# 🚀 TaskFlow - Task Management System

A modern Full Stack Task Management System built using **Angular**, **Node.js**, **Express**, **MongoDB**, and **Socket.IO**.

The application provides **Role Based Authorization**, **Task Management**, and **Real-time Task Updates** using Socket.IO.

---

# 🌐 Live Demo

### Frontend (Vercel)

https://eminence-innovation-assignment.vercel.app/

### Backend (Render)

https://eminence-innovation-assignment.onrender.com

---

# ✨ Features

## Authentication

- JWT Authentication
- Secure Password Hashing using bcrypt
- Protected APIs
- Login & Registration

---

## Role Based Authorization

Three user roles are supported:

### 👨‍💼 Manager

- View all users
- Change user roles
- Assign Team Lead
- Create Tasks
- Modify Any Task
- Delete Any Task
- Reassign Tasks

---

### 👨‍💻 Team Lead

- Create Tasks
- Assign Tasks to Team Members
- Modify Team Tasks
- View Team Tasks

---

### 👨‍🔧 Employee

- Create Personal Tasks
- Update Own Tasks
- Delete Own Tasks
- View Only Own Tasks
- Newly created tasks are automatically assigned to themselves

---

# 📋 Task Management

- Create Task
- Read Tasks
- Update Task
- Delete Task
- Task Assignment
- Task Status Updates
- Due Dates
- Priority
- Real-time Synchronization
- Search & Filters
- Pagination

---

# ⚡ Real Time Updates

Implemented using **Socket.IO**

Whenever a task is

- Created
- Updated
- Assigned
- Deleted

the respective user receives live updates without refreshing the page.

---

# 🛠 Tech Stack

## Frontend

- Angular 20
- Angular Material
- RxJS
- TypeScript
- Socket.IO Client

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Socket.IO
- bcryptjs
- express-validator

---

## Database

MongoDB Atlas

---

## Deployment

Frontend → Vercel

Backend → Render

Database → MongoDB Atlas

---

# 📁 Project Structure

```
TaskManagement/

├── backend/
│
├── frontend/
│
├── docs/
│
└── README.md
```

---

# 🚀 Running Project Locally

## 1 Clone Repository

```bash
git clone https://github.com/<your-github-username>/eminence_innovation_assignment.git

cd eminence_innovation_assignment
```

---

# Backend Setup

## Move to backend

```bash
cd backend
```

## Install packages

```bash
npm install
```

## Create .env

Create a `.env` file inside the backend folder.

Example:

```env
PORT=5001

MONGO_URL=your_mongodb_connection_string

JWT_SECRET=your_secret

CLIENT_URL=http://localhost:4200
```

## Start Backend

```bash
npm run dev
```

Backend runs on

```
http://localhost:5001
```

---

# Frontend Setup

Move to frontend

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Update

```
src/environments/environment.development.ts
```

```ts
export const environment = {
    production: false,

    apiUrl: 'http://localhost:5001/api',

    socketUrl: 'http://localhost:5001',
};
```

Run

```bash
ng serve
```

Frontend runs on

```
http://localhost:4200
```

---

# 🌍 Production Configuration

```
environment.ts
```

```ts
export const environment = {

    production: true,

    apiUrl: "https://eminence-innovation-assignment.onrender.com/api",

    socketUrl: "https://eminence-innovation-assignment.onrender.com"

};
```

---

# 🔐 Authentication

The project uses

```
Bearer Token Authentication
```

Example Header

```
Authorization: Bearer <JWT_TOKEN>
```

---

# 📚 API Documentation

Base URL

```
https://eminence-innovation-assignment.onrender.com/api
```

---

# Authentication APIs

## Register

```
POST /auth/register
```

Request

```json
{
    "username":"John",
    "email":"john@test.com",
    "password":"123456"
}
```

---

## Login

```
POST /auth/login
```

Request

```json
{
    "email":"john@test.com",
    "password":"123456"
}
```

Returns

```json
{
    "token":"JWT_TOKEN",
    "user":{}
}
```

---

# User APIs

Requires Manager Role

---

## Get Users

```
GET /users
```

---

## Update User Role

```
PATCH /users/:id/role
```

Request

```json
{
    "role":"TEAM_LEAD"
}
```

---

# Task APIs

---

## Get Tasks

```
GET /api/tasks
```

---

## Get Task By Id

```
GET /tasks/:id
```

---

## Create Task

```
POST /tasks
```

Example

```json
{
    "title":"Complete Assignment",

    "description":"Implement CRUD",

    "priority":"HIGH",

    "status":"TODO",

    "assignedTo":"USER_ID"
}
```

---

## Update Task

```
PATCH /tasks/:id
```

---

## Delete Task

```
DELETE /tasks/:id
```

---

# 🔌 Socket.IO Events

Client automatically connects after login.

Events implemented

```
taskCreated

taskUpdated

taskDeleted

taskAssigned
```

The application listens for these events and refreshes task data in real time.

---

# Security

- JWT Authentication
- Password Hashing (bcrypt)
- Protected Routes
- Role Based Authorization
- Request Validation
- MongoDB Validation
- CORS Enabled

---

# Future Possible Improvements

- Email Notifications
- Activity Logs
- File Attachments
- Comments
- Dashboard Analytics
- Unit Testing
- Docker Support
- CI/CD Pipeline

---

# 👨‍💻 Author

**Divyank Bhalla**

GitHub

https://github.com/divyankbhalla

---

# ⭐ If you found this project useful, consider giving it a Star.