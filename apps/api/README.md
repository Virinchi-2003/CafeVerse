# @cafeverse/api — Express REST API & Database

The backend server for **CaféVerse**, built with Node.js, Express, TypeScript, and SQLite (`better-sqlite3`).

## 🚀 Key Features

- **Authentication**: JWT-based login/registration with role authorization (`ADMIN` and `CUSTOMER`).
- **Menu Management**: Categories, menu items, dietary labels, allergens, and inventory availability.
- **Reservation System**: Real-time slot capacity calculations, reference code generation (`CV-XXXXX`), and status workflow (`CONFIRMED`, `PENDING`, `CANCELLED`, `COMPLETED`).
- **Admin Dashboard**: Analytics summary, customer directory, table layout management, and audit logs.

## 💻 Commands

- `npm run dev` — Start development API server at `http://localhost:4000`
- `npm run seed` — Initialize SQLite database with seed data
- `npm run build` — Compile TypeScript to JavaScript
