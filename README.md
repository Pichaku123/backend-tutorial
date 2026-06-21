# backend-tutorial

A follow-along project from [PedroTech's Backend Complete Course](https://www.youtube.com/watch?v=g09PoiCob4Y), built to understand how modern backend applications are structured and how all the pieces connect.

Built for learning purposes — not an original project.

## Stack
- Node.js + Express
- PostgreSQL + Prisma
- JWT Authentication + bcrypt

## Features
- REST API with Express
- CRUD operations
- PostgreSQL database integration via Prisma
- User authentication (register + login)
- Protected routes via JWT middleware

## What I Learned
- How to structure a backend with routes, controllers, and middleware
- Prisma schema design and migrations
- Implementing JWT-based authentication and protecting routes
- Connecting a Node server to a hosted PostgreSQL database

## Running Locally

```bash
npm install
npx prisma migrate dev
node prisma/seed.js
npm run dev
```

Create a `.env` file:
```
PORT=3000
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_secret"
```

## Notes
This project is based on a tutorial and was built primarily for learning purposes. It does not include custom features beyond the tutorial scope and is not intended to be production-ready.