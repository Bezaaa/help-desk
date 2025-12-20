# HelpDesk Operations Hub

A professional full-stack support ticket management system built with Next.js 15, Prisma, and Auth.js.

## 🚀 Features
- **Role-Based Access**: Admin and User dashboards with distinct permissions.
- **Full CRUD**: Create, read, update, and delete support tickets.
- **Advanced Filtering**: Real-time search and priority filtering via URL state.
- **Security**: Password hashing with Bcrypt and protected server-side routes.
- **Notification System**: In-app notifications for account verification.
- **Seeding**: Automated database seeding for testing Admin and User roles.

## 🛠 Tech Stack
- **Frontend**: Next.js (App Router), Tailwind CSS, ShadCN UI, Lucide Icons.
- **Backend**: Next.js Server Actions, Prisma ORM, PostgreSQL.
- **Auth**: Auth.js (NextAuth v5).
- **Validation**: Zod + React Hook Form.

## 📦 Installation
1. `npm install`
2. Set up your `.env` with `DATABASE_URL` and `AUTH_SECRET`.
3. `npx prisma generate`
4. `npx prisma db push`
5. `npx prisma db seed`
6. `npm run dev`