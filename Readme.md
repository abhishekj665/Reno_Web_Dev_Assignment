# Reno Web Development Assignment - Notice Board

A full-stack Notice Board application built as part of the **Reno Platforms Web Development Assignment**. The application allows users to create, view, update, and delete notices with server-side validation, persistent database storage, and a responsive user interface.

## 🚀 Live Demo

**Vercel:** https://reno-web-dev-assignment-git-de-22cca3-abhishek-jevenes-projects.vercel.app/

## 📂 GitHub Repository

https://github.com/abhishekj665/Reno_Web_Dev_Assignment

---

# Features

- Create a new notice
- View all notices
- Update existing notices
- Delete notices with confirmation
- Responsive design for desktop and mobile
- Server-side validation
- Prisma ORM with hosted MySQL database
- Urgent notices displayed before normal notices using Prisma `orderBy`
- Red badge for urgent notices
- Proper HTTP methods and RESTful API design
- Centralized error handling using custom `AppError` and `asyncHandler`

---

# Tech Stack

| Technology | Usage |
|------------|-------|
| Next.js (Pages Router) | Frontend & API Routes |
| Prisma ORM | Database Access |
| MySQL (Hosted) | Database |
| Tailwind CSS | Styling |
| Axios | API Requests |
| Vercel | Deployment |

---

# Project Structure

```
notice-board
│
├── components
│   ├── NoticeCard.js
│   └── NoticeModal.js
│
├── lib
│   └── prisma.js
│
├── pages
│   ├── api
│   │   └── notices
│   │       ├── index.js
│   │       └── [id].js
│   │
│   ├── _app.js
│   └── index.js
│
├── prisma
│   └── schema.prisma
│
├── styles
│   └── globals.css
│
├── utils
│   ├── AppError.js
│   ├── asyncHandler.js
│   └── globalErrorHandler.js
│
├── package.json
└── README.md
```

---

# Notice Fields

| Field | Description |
|--------|-------------|
| Title | Required short text |
| Body | Required description |
| Category | Exam, Event or General |
| Priority | Normal or Urgent |
| Publish Date | Valid date |

---

# REST API

## Get All Notices

```
GET /api/notices
```

Returns all notices with urgent notices displayed first.

---

## Create Notice

```
POST /api/notices
```

Creates a new notice.

---

## Update Notice

```
PUT /api/notices/:id
```

Updates an existing notice.

---

## Delete Notice

```
DELETE /api/notices/:id
```

Deletes a notice after confirmation.

---

# Server-side Validation

The API validates:

- Required fields
- Valid publish date
- Proper HTTP methods
- Invalid requests return appropriate HTTP status codes

Validation is implemented inside the API routes using a custom `AppError` class.

---

# Database

The application uses **Prisma ORM** connected to a hosted **MySQL** database.

Urgent notices are ordered directly in the database query using Prisma:

```javascript
await prisma.notice.findMany({
  orderBy: {
    priority: "desc",
  },
});
```

This ensures urgent notices always appear before normal notices without client-side sorting.

---

# How to Run Locally

## 1. Clone Repository

```bash
git clone https://github.com/abhishekj665/Reno_Web_Dev_Assignment.git
```

## 2. Move into project

```bash
cd notice-board
```

## 3. Install dependencies

```bash
npm install
```

## 4. Create `.env`

```
DATABASE_URL="YOUR_DATABASE_URL"
```

## 5. Generate Prisma Client

```bash
npx prisma generate
```

## 6. Push Prisma Schema

```bash
npx prisma db push
```

## 7. Start Development Server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

# Deployment

The application is deployed on **Vercel** using:

- Next.js Pages Router
- Hosted MySQL database
- Prisma ORM

Environment Variables configured on Vercel:

```
DATABASE_URL
```

---

# Assignment Requirements Covered

- ✅ Full CRUD operations
- ✅ Responsive notice listing
- ✅ Shared Add/Edit form
- ✅ Delete confirmation
- ✅ Server-side validation
- ✅ Prisma ORM
- ✅ Hosted database
- ✅ API Routes using Pages Router
- ✅ Correct HTTP methods
- ✅ Proper HTTP status codes
- ✅ Persistent database storage
- ✅ Urgent-first ordering handled in Prisma
- ✅ Red badge for urgent notices
- ✅ Vercel deployment
- ✅ Public GitHub repository

---

# One Improvement with More Time

If given more time, I would implement:

- Authentication and role-based authorization
- Pagination for large datasets
- Advanced search and filtering
- Notice scheduling and expiry
- Unit and integration tests
- Image attachments for notices

---

# AI Usage

AI tools were used to assist with:

- Understanding the assignment requirements
- Debugging Next.js and Prisma issues
- Improving project structure and component organization
- Discussing API design and server-side validation
- Generating documentation and improving code readability

All application logic, integration, debugging, testing, and final implementation decisions were reviewed and completed manually.

---

# Author

**Abhishek Jevene**

GitHub: https://github.com/abhishekj665

---

## Thank You

This project was developed as part of the **Reno Platforms Web Development Assignment**, following the required technology stack and implementation guidelines.