# CeleBrease

A holiday decoration **rental subscription** service. Customers subscribe to a plan, pick holidays they want decorated, rent curated "kits" (décor bundles), receive/return them, and get their deposit back if items come back in good condition.

---

## Project Structure

Three separate apps, each with its own `package.json` and `pnpm-lock.yaml`:

```
celebrease/
├── frontend/   # Next.js 16 — customer-facing website (port 4000)
├── admin/      # Vite + React — internal admin panel
└── backend/    # NestJS — REST API + PostgreSQL via Prisma
```

---

## Running the Apps

Each app is independent. `cd` into the directory, then:

```bash
# Frontend
cd frontend && pnpm dev        # http://localhost:4000

# Admin
cd admin && pnpm dev           # http://localhost:5173 (default Vite port)

# Backend
cd backend && pnpm start:dev   # http://localhost:3000
```

### Backend env
The backend requires a `.env` file in `backend/`. Key variables (see `backend/src/config/env.config.ts` for the full list):
- `DATABASE_URL` — PostgreSQL connection string
- `BETTER_AUTH_SECRET` — auth secret
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` — Stripe
- `FRONTEND_URL`, `ADMIN_URL` — CORS origins

### Database
```bash
cd backend
pnpm prisma migrate dev     # run migrations
pnpm prisma db seed         # seed data (see prisma/seed/)
pnpm prisma studio          # GUI browser for the DB
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TailwindCSS 4, shadcn/ui, TanStack Query, Zustand, better-auth |
| Admin | Vite 8, React 19, TanStack Router, TanStack Query, shadcn/ui, Recharts, dnd-kit |
| Backend | NestJS 11, Prisma 7, PostgreSQL, better-auth, Stripe, Multer (file uploads), Nodemailer |
| Language | TypeScript throughout |
| Package manager | pnpm (each app has its own lockfile) |

---

## Key Domain Concepts

- **Holiday** — an occasion (e.g. Christmas, Halloween). Has a category (`TRADITIONAL | CULTURAL | EVENT_BASED`).
- **Kit** — a curated decoration bundle tied to a Holiday and a tier (`STARTER | PREMIUM | ULTIMATE`). Has rental prices for 30-day and 60-day durations, plus a refundable deposit.
- **Item** — a physical decoration piece. Tracked in **Inventory** (`availableQty`, `reservedQty`, `shippedQty`, `cleaningQty`, etc.).
- **AddOn** — optional extras a customer can add to a kit rental.
- **Plan** — subscription tier (`STARTER | PREMIUM | ULTIMATE`), billed monthly or yearly. Grants N holiday slots per year and kit/add-on discounts.
- **Subscription** — a user's active plan. Contains **SubscriptionHolidaySlots** (one per holiday they can pick).
- **Cart** → **Order** — a pending rental becomes an Order at checkout. Orders track the full lifecycle: `PENDING → SHIPPED → DELIVERED → RETURN_REQUESTED → ... → COMPLETED`.

---

## Frontend Routes (`frontend/src/app/`)

| Group | Routes |
|---|---|
| `(auth)` | `/signin`, `/signup`, `/forgot-password`, `/reset-password`, `/verification` |
| `(mian)` | `/` (home), `/catalog`, `/catalog/[id]`, `/subscription`, `/about`, `/contact`, `/faqs`, and legal pages |
| `(protected)` | `/account`, `/account/subscription`, `/cart`, `/checkout`, `/wishlist` |

## Admin Routes (`admin/src/routes/`)

Dashboard, holidays, kits, inventory, add-ons, plans, subscriptions, orders, returns, reviews, customers, users.

## Backend Modules (`backend/src/`)

`users` · `addresses` · `plans` · `subscriptions` · `holidays` · `kits` · `inventory` · `addons` · `cart` · `orders` · `reviews` · `stripe` · `upload` · `dashboard` · `common`

All routes are protected by `AuthGuard` (better-auth) globally. Public endpoints must be decorated with `@Public()`.

---

## Auth

Both frontend and admin use **better-auth** (`better-auth` package + `@thallesp/nestjs-better-auth` on the backend). The backend is the auth server; frontend and admin are auth clients pointing to the backend URL.

---

## File Uploads

Images (holiday covers, item photos, add-on images, reviews) are uploaded via the `upload` module using Multer and stored under `backend/uploads/` (served statically at `/uploads`). Categories: `holidays/`, `inventory/`, `addons/`, `reviews/`.

---

## Payments

Stripe handles subscription billing and one-time kit rental payments. The `stripe` module manages webhook processing. Plans have `stripePriceMonthlyId`, `stripePriceYearlyId`, and `stripeProductId` fields. Orders record `stripePaymentIntentId`, `stripeChargeId`, and `stripeRefundId`.

---

## Linting & Building

```bash
# In any app directory:
pnpm lint
pnpm build
```

No test suite is wired up on the backend or frontend yet. The admin has Vitest configured (`pnpm test`).
