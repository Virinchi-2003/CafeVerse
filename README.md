# ☕ CAFÉVERSE — Premium Specialty Café Management Platform

**CaféVerse** is a full-stack, production-grade specialty café management platform featuring an immersive 2.5D animated React web application, a native-feeling Expo/React Native mobile application, a Node.js Express REST API, and SQLite database storage.

---

## ✨ 2.5D Animated Visual Design System

CaféVerse features a custom 2.5D visual rendering and physics engine:

- **2.5D Dark Chocolate & Coffee Beans Background**:
  - **Dark Chocolate Pieces**: Custom 3D-rendered SVG components including beveled **Dark Chocolate Squares** (`DarkChocolateSquareSVG`), crystalline **Dark Chocolate Shards** (`DarkChocolateShardSVG`), and **Dark Chocolate Cubes** (`DarkChocolateCubeSVG`).
  - **Coffee Beans**: Realistic 3D-shaded coffee bean SVG vector graphics (`CoffeeBeanSVG`).
  - **Interactive 2.5D Parallax Physics**: Real-time cursor tracking (`mouseX`, `mouseY`) using Framer Motion springs (`useSpring`, `useMotionValue`), shifting foreground pieces faster than background pieces to create rich 2.5D depth perception.
  - **Ambient Depth & Motion**: Continuous floating Y animations, staggered Z-rotations, and depth-of-field blurs (`blur-[1.5px]`).
- **Interactive Drink Showcase**: 2.5D coffee cup showcase with rising steam particle physics and interactive drink carousel (Mocha, Cappuccino, Latte, Espresso, Cold Brew).
- **Table Reservation Wizard**: 3-step wizard with live date/time availability checking, guest counter controls (Adults & Children), step summary pill bar, contact details form, and instant reference code generation (`CV-XXXXX`).

---

## 🏗️ Monorepo Architecture & Project Structure

```
c:\CafeDemo
├── apps
│   ├── api          # Node.js + Express REST API & SQLite DB (better-sqlite3)
│   ├── web          # React 18 + Vite + TypeScript + Tailwind CSS + Framer Motion + 2.5D Engine
│   └── mobile       # React Native / Expo application
├── packages
│   └── shared       # Shared TypeScript domain models & Zod validation schemas
├── .gitignore       # Monorepo gitignore configuration
├── package.json     # Workspace configuration
└── README.md        # Documentation
```

---

## ⚡ Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Database
Initializes admin (`admin@cafeverse.com` / `admin123`), test customer (`customer@cafeverse.com` / `customer123`), categories, menu items, café settings, and sample reservations:
```bash
npm run seed
```

### 3. Launch Development Servers

- **Backend REST API** (Port 4000):
  ```bash
  npm run dev:api
  ```
- **Web Application** (Port 3000):
  ```bash
  npm run dev:web
  ```
- **Mobile Application** (Port 5174):
  ```bash
  npm run dev:mobile
  ```

### 4. Build Web App for Production
```bash
npm run build:web
```

---

## 🔐 Accounts & Credentials

| Role | Email | Password | Privileges & Features |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@cafeverse.com` | `admin123` | Full Menu CRUD, Live Reservation Approval/Rejection, Table Management, Café Settings, Audit Logs |
| **Customer** | `customer@cafeverse.com` | `customer123` | Table Reservation, View/Cancel Bookings in Customer Portal, Submit Reviews |

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Authenticate customer or admin user |
| `POST` | `/api/v1/auth/register` | Register new customer account |
| `GET` | `/api/v1/cafe/settings` | Get café opening hours and store information |
| `GET` | `/api/v1/menu/items` | Fetch menu items (supports `categoryId`, `search`, `featuredOnly`) |
| `POST` | `/api/v1/menu/items` | (Admin) Create new menu item |
| `PATCH` | `/api/v1/menu/items/:id` | (Admin) Update menu item or toggle availability |
| `GET` | `/api/v1/reservations/availability` | Real-time date slot availability check |
| `POST` | `/api/v1/reservations` | Submit table booking |
| `GET` | `/api/v1/reservations/mine` | Customer personal reservation history |
| `PATCH` | `/api/v1/reservations/mine/:id/cancel` | Cancel customer reservation |
| `GET` | `/api/v1/admin/dashboard` | Admin analytics, seating status, and audit logs |
| `PATCH` | `/api/v1/reservations/:id/status` | (Admin) Approve, reject, or mark seating status |

---

## 📱 Mobile Build Instructions (Expo / APK)

To build the native mobile bundle or generate an Android APK:
1. Navigate to `apps/mobile`.
2. Login to Expo CLI: `npx expo login`.
3. Build Android package: `npx eas build --platform android --profile preview`.

---

## 🛡️ License
Copyright © 2026 CaféVerse. All rights reserved.
