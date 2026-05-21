<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./frontend/public/logo-white.png">
    <img src="./frontend/public/logo.png" alt="CeleBrease Logo" width="280" />
  </picture>
</p>

<h1 align="center">CeleBrease</h1>

<p align="center">
  <strong>Celebrate beautifully, without the storage.</strong>
  <br />
  A subscription-based holiday &amp; event decoration rental platform.
</p>

<p align="center">
  <a href="https://github.com/Farbods0/celebrease"><img src="https://img.shields.io/badge/GitHub-Farbods0/celebrease-181717?style=flat-square&logo=github" alt="GitHub" /></a>
  <a href="https://celebrease.com/"><img src="https://img.shields.io/badge/Live-celebrease.com-00C853?style=flat-square&logo=google-chrome" alt="Live Site" /></a>
  <a href="https://admin.celebrease.com/"><img src="https://img.shields.io/badge/Admin-admin.celebrease.com-1565C0?style=flat-square&logo=google-chrome" alt="Admin Panel" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.1-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/NestJS-11.0-red?style=flat-square&logo=nestjs" alt="NestJS" />
  <img src="https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-7.7-2D3748?style=flat-square&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?style=flat-square&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Stripe-22.1-008CDD?style=flat-square&logo=stripe" alt="Stripe" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/license-UNLICENSED-red?style=flat-square" alt="License" />
</p>

---

## About

**CeleBrease** is a full-stack web application that lets customers **rent curated decor kits** for holidays and celebrations instead of buying and storing decorations. Choose a kit, get it delivered, decorate your space, and return everything with a prepaid label — sustainable, affordable, and clutter-free.

### Why CeleBrease?

- **No Storage** — Kits come and go; you never keep anything.
- **Curated by Designers** — Every kit is styled with care.
- **Sustainable** — Reuse over single-use; less waste, more joy.
- **Flexible Plans** — Subscribe annually or rent per event.

---

## Architecture

```
celebrease/
├── frontend/          Customer-facing Next.js app (App Router)
├── admin/             Admin dashboard (Vite + TanStack Router)
└── backend/           REST API (NestJS + Prisma + PostgreSQL)
```

| Layer            | Tech                                         | Port   |
| ---------------- | -------------------------------------------- | ------ |
| **Customer App** | Next.js 16 + React 19 + Tailwind CSS v4      | `4000` |
| **Admin Panel**  | Vite + React 19 + TanStack Router + Radix UI | `4001` |
| **API Server**   | NestJS 11 + Prisma 7 + PostgreSQL (Supabase) | `4002` |

---

## Features

### Customer App (`frontend/`)

- **Catalog** — Browse holidays & celebrations with filtering and search
- **Kit Details** — View curated kits by tier (Starter, Premium, Ultimate)
- **Subscription Plans** — Annual plans with 1–3 holiday slots per year
- **Shopping Cart** — Add kits, customize duration, pick add-ons
- **Checkout** — Secure payments via Stripe PaymentIntents
- **User Account** — Active rentals, subscription management, addresses, payment methods
- **Wishlist** — Save your favorite holidays
- **Auth** — Email-based signup/signin with better-auth
- **Responsive** — Fully responsive design with light/dark mode

### Admin Dashboard (`admin/`)

- **Dashboard** — Real-time stats: active rentals, revenue, trends, holiday distribution charts
- **Holidays** — CRUD management for celebration categories
- **Kits** — Manage decor kits with drag-and-drop item ordering, tier toggling, and preview items
- **Inventory** — Track items: total, available, reserved, shipped, cleaning, repair, lost
- **Orders** — Full lifecycle: status tracking, return labels, inspection workflow
- **Subscriptions** — Customer subscription oversight with Stripe sync
- **Plans** — Subscription plan configuration with Stripe product/price sync
- **Add-ons** — Optional extras management
- **Customers** — Customer profiles with order/subscription history
- **Reviews** — Moderation and management
- **Users** — Admin and superadmin management

### Backend API (`backend/`)

- **RESTful API** — Versioned (`/api/v1`) with global validation
- **Prisma ORM** — 23 database models with 32 migrations
- **Auth** — better-auth integration with role-based access (user, admin, superadmin)
- **Payments** — Stripe PaymentIntents for one-time rentals & Stripe subscriptions for plans
- **Email** — Nodemailer via Gmail SMTP (verification, contact, password reset)
- **File Uploads** — Multer-based image uploads for holidays, kits, inventory, reviews
- **Newsletter** — Brevo (Sendinblue) API integration
- **Caching** — Cache-manager for optimized queries
- **Security** — Helmet, CORS, validation pipes

---

## Database Schema

23 models power the platform:

| Model                                                 | Purpose                                  |
| ----------------------------------------------------- | ---------------------------------------- |
| `User`, `Session`, `Account`, `Verification`          | Auth (better-auth)                       |
| `Holiday`, `HolidayLove`                              | Celebration categories & user likes      |
| `Kit`, `KitItem`, `KitPreviewItem`                    | Decor kits with items & preview ordering |
| `Item`, `Inventory`                                   | Physical items & stock tracking          |
| `AddOn`                                               | Optional add-ons                         |
| `Plan`, `PlanFeature`                                 | Subscription plans & features            |
| `Subscription`, `SubscriptionHolidaySlot`             | User subscriptions & allocated slots     |
| `Cart`, `CartItem`, `CartAddOn`                       | Shopping carts                           |
| `Order`, `OrderItem`, `OrderAddOn`, `OrderReturnLine` | Rentals, payments, returns & inspection  |
| `Address`                                             | User addresses                           |
| `Review`                                              | Customer reviews                         |

---

## Tech Stack

### Frontend (Customer)

| Package                                            | Version |
| -------------------------------------------------- | ------- |
| [Next.js](https://nextjs.org/)                     | 16.2.1  |
| [React](https://react.dev/)                        | 19.2.4  |
| [TypeScript](https://www.typescriptlang.org/)      | 5.x     |
| [Tailwind CSS](https://tailwindcss.com/)           | v4      |
| [shadcn/ui](https://ui.shadcn.com/) (BaseUI)       | —       |
| [TanStack React Query](https://tanstack.com/query) | 5.100.9 |
| [TanStack React Form](https://tanstack.com/form)   | 1.28.5  |
| [better-auth](https://www.better-auth.com/)        | 1.6.9   |
| [Zustand](https://zustand-demo.pmnd.rs/)           | 5.0.12  |
| [Zod](https://zod.dev/)                            | 4.3.6   |
| [Embla Carousel](https://www.embla-carousel.com/)  | 8.6.0   |
| [Sonner](https://sonner.emilkowal.ski/)            | 2.0.7   |

### Admin Dashboard

| Package                                            | Version |
| -------------------------------------------------- | ------- |
| [Vite](https://vitejs.dev/)                        | 8.x     |
| [React](https://react.dev/)                        | 19.2.0  |
| [TypeScript](https://www.typescriptlang.org/)      | 5.x     |
| [TanStack Router](https://tanstack.com/router)     | latest  |
| [TanStack React Query](https://tanstack.com/query) | 5.100.8 |
| [Radix UI](https://www.radix-ui.com/)              | 1.4.3   |
| [Recharts](https://recharts.org/)                  | 3.8.0   |
| [dnd-kit](https://dndkit.com/)                     | —       |
| [Lucide React](https://lucide.dev/)                | 0.545.0 |
| [Vitest](https://vitest.dev/)                      | 3.0.5   |

### Backend

| Package                                              | Version |
| ---------------------------------------------------- | ------- |
| [NestJS](https://nestjs.com/)                        | 11.x    |
| [TypeScript](https://www.typescriptlang.org/)        | 5.x     |
| [Prisma](https://www.prisma.io/)                     | 7.7.0   |
| [PostgreSQL](https://www.postgresql.org/) (Supabase) | —       |
| [better-auth](https://www.better-auth.com/)          | 2.6.0   |
| [Stripe](https://stripe.com/)                        | 22.1.0  |
| [Nodemailer](https://nodemailer.com/)                | 8.0.5   |
| [Helmet](https://helmetjs.github.io/)                | 8.1.0   |
| [Multer](https://github.com/expressjs/multer)        | 2.1.1   |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **pnpm** (package manager)
- **PostgreSQL** database (supabase postgresql)
- **Stripe** account (test mode)
- **Gmail** SMTP credentials (or any email service)

### 1. Clone & Install

```bash
git clone https://github.com/Farbods0/celebrease.git
cd celebrease

# Install all packages (uses pnpm workspaces)
cd backend && pnpm install && cd ..
cd frontend && pnpm install && cd ..
cd admin && pnpm install && cd ..
```

### 2. Environment Variables

Each package has its own `.env` file. Copy the template and fill in your values:

**`backend/.env`**

```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:4002
GMAIL_EMAIL=your-email@gmail.com
GMAIL_PASSWORD=your-app-password
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
BREVO_API_KEY=...
```

**`frontend/.env`**

```
NEXT_PUBLIC_SERVER_URL=http://localhost:4002
NEXT_PUBLIC_CLIENT_URL=http://localhost:4000
```

**`admin/.env`**

```
VITE_APP_CLIENT=http://localhost:4000
VITE_APP_SERVER=http://localhost:4002
```

### 3. Database Setup

```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

### 4. Run the App

Start each package in its own terminal:

```bash
# Terminal 1 — Backend API
cd backend && pnpm start:dev

# Terminal 2 — Customer Frontend
cd frontend && pnpm dev

# Terminal 3 — Admin Dashboard
cd admin && pnpm dev
```

| App               | URL                                                          |
| ----------------- | ------------------------------------------------------------ |
| Customer Frontend | [http://localhost:4000](http://localhost:4000)               |
| Admin Dashboard   | [http://localhost:4001](http://localhost:4001)               |
| API Server        | [http://localhost:4002/api/v1](http://localhost:4002/api/v1) |

---

## Scripts

### Backend

| Script            | Description          |
| ----------------- | -------------------- |
| `pnpm start:dev`  | Start in watch mode  |
| `pnpm build`      | Compile to `dist/`   |
| `pnpm start:prod` | Run production build |
| `pnpm lint`       | Lint with ESLint     |
| `pnpm format`     | Format with Prettier |

### Frontend

| Script       | Description                   |
| ------------ | ----------------------------- |
| `pnpm dev`   | Start dev server on port 4000 |
| `pnpm build` | Production build              |
| `pnpm start` | Start production server       |
| `pnpm lint`  | Lint with ESLint              |

### Admin

| Script         | Description                   |
| -------------- | ----------------------------- |
| `pnpm dev`     | Start dev server on port 4001 |
| `pnpm build`   | Production build              |
| `pnpm preview` | Preview production build      |
| `pnpm test`    | Run Vitest tests              |
| `pnpm lint`    | Lint with ESLint              |

---

## Project Structure

```
celebrease/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema (23 models)
│   │   ├── migrations/            # 32 migration files
│   │   └── seed/                  # SQL seed data (6 files)
│   └── src/
│       ├── main.ts                # App bootstrap
│       ├── app.module.ts          # Root module
│       ├── common/                # Shared services (email, prisma, contact, newsletter)
│       ├── config/                # Environment config
│       ├── users/                 # User CRUD + customers
│       ├── holidays/              # Holidays + loves/wishlist
│       ├── kits/                  # Kits + items management
│       ├── inventory/             # Inventory tracking + allocation
│       ├── addons/                # Add-ons CRUD
│       ├── cart/                  # Cart + checkout logic
│       ├── orders/                # Orders + returns + inspection
│       ├── plans/                 # Subscription plans
│       ├── subscriptions/         # Subscriptions + Stripe webhooks
│       ├── stripe/                # Stripe integration
│       ├── reviews/               # Customer reviews
│       ├── upload/                # File uploads
│       ├── addresses/             # Address management
│       └── dashboard/             # Operational stats
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── (auth)/            # Sign in, sign up, verification, password reset
│       │   ├── (mian)/            # Public pages (home, catalog, about, contact, etc.)
│       │   └── (protected)/       # Account, cart, checkout, wishlist
│       ├── components/
│       │   ├── ui/                # 23 shadcn/ui primitives
│       │   ├── main/              # Navbar, footer, section headers
│       │   ├── form/              # Form field wrappers
│       │   ├── account/           # Account page components
│       │   └── icons/             # Custom SVG icons
│       └── lib/
│           ├── api/               # 11 API client modules
│           ├── auth.ts            # better-auth client
│           └── utils.ts           # Utilities
├── admin/
│   └── src/
│       ├── routes/                # 20 pages (TanStack Router, file-based)
│       ├── components/
│       │   ├── ui/                # 27 UI primitives (Radix-based)
│       │   ├── dashboard/         # Stat cards, charts
│       │   ├── kits/              # Kit management (sidebar, content, form)
│       │   ├── orders/            # Order table, detail view
│       │   ├── customers/         # Customer management
│       │   ├── inventory/         # Inventory tracking
│       │   └── ...                # Addons, holidays, plans, returns, reviews, etc.
│       └── lib/
│           ├── api/               # 14 API client modules
│           ├── auth.ts            # better-auth + session validation
│           └── utils.ts           # Utilities
```

---

## Deployment

| Service         | URL                                                            |
| --------------- | -------------------------------------------------------------- |
| Customer App    | [https://celebrease.com/](https://celebrease.com/)             |
| Admin Dashboard | [https://admin.celebrease.com/](https://admin.celebrease.com/) |

## Repository

- **GitHub**: [https://github.com/Farbods0/celebrease](https://github.com/Farbods0/celebrease)

---

## Security

- **Helmet** middleware for HTTP headers
- **CORS** configured per environment
- **Input validation** via Zod + class-validator
- **Role-based access** (user / admin / superadmin)
- **Stripe webhook** signature verification
- **API versioning** (`/api/v1`)

---

## License

**UNLICENSED** — All rights reserved. This is proprietary software.

---

<p align="center">
  Made with ❤️ for beautiful celebrations
</p>
