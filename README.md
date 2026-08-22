# Nexa Store 🛍️

> A high-performance, production-ready Next.js 16 E-Commerce Storefront

![Next.js 16](https://img.shields.io/badge/Next.js-16.3.0-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)
![Vitest](https://img.shields.io/badge/Vitest-4.1.10-6E9F18?logo=vitest)
![Playwright](https://img.shields.io/badge/Playwright-Tested-2EAD33?logo=playwright)
![WCAG 2.1 AA](https://img.shields.io/badge/WCAG_2.1-AA_Compliant-005A9C?logo=w3c)
![License](https://img.shields.io/badge/License-Private-red)

## Executive Summary / Architecture Overview

Nexa Store is a modern, responsive e-commerce storefront built entirely on the **Next.js 16 App Router**. It embraces React Server Components (RSC) to ship zero-JS payloads for static content and relies on thin Client Components strictly for interactive boundaries.

The application is completely decoupled from the backend database, operating as a robust frontend consumption layer communicating via a verified upstream REST API (`ecommerce.routemisr.com`). All API interactions traverse rigorous `Zod` runtime validation layers and domain adapters, guaranteeing that the UI never renders unverified or malformed upstream payloads.

## Key Engineering & Security Highlights

- **Stateless Session Security:** Implements a strict server-only AES-256-GCM encrypted session codec stored in sealed, `HttpOnly` cookies. Tokens never enter client bundles, serialized props, URLs, or browser local storage. Mitigates IDOR by restricting sensitive mutations to authenticated session identities.
- **Strict Content Security Policy (CSP):** Employs robust CSP headers (`script-src`, `connect-src`, `img-src`) to strictly allowlist execution boundaries and upstream media origins (`ecommerce.routemisr.com`).
- **Client Bundle Secret Scanning:** Integrated `scan:bundle` pre-build pipeline automatically verifies that `SESSION_ENCRYPTION_KEY` and private `.env` values do not leak into compiled JS chunks.
- **Resilient UI Architecture:** Next.js `Suspense` and Error Boundaries orchestrate graceful fallback states (`loading`, `error`, `empty`) ensuring partial upstream failures never crash the entire route tree.
- **Optimistic Interactions & Micro-animations:** Implements smooth CSS transitions and deferred actions (e.g., Wishlist "Move to Bag" 2-second confirmation delay with 300ms exit fade) to create a premium, tactile user experience.
- **100% Mobile & Desktop Navigation Parity:** Responsive design prioritizing mobile ergonomics. Features WCAG-compliant touch targets (min 44x44px), scrollable pill navigation for complex menus, and unified canonical URLs across breakpoints.

## Feature Showcase

- **Catalog & Discovery:** Paginated grid listing, detailed product views (galleries, prices, descriptions), and organized directory browsing (Categories & Brands).
- **Dynamic Filtering:** URL-driven state management for Search, Sort (Price), and exact Category/Brand combinations without relying on client-side React context.
- **Shopping Cart & Checkout:** Persistent cart state, optimistic quantity adjustments, and streamlined checkout routing (integration with Stripe Checkout sessions via the backend API).
- **Authentication & Security:** Robust Sign-In, Sign-Up, and multi-step Password Recovery flows with precise validation.
- **Account Management:** User profile atomic updates, secure password changes, address book management, and wishlist curation.

## Testing & Quality Assurance Matrix

The repository enforces strict quality gates before any deployment:

- **Unit & Integration Tests:** Powered by `vitest`, covering over **690+ tests across 140+ suites** (API adapters, schemas, server actions, and component rendering logic).
- **Accessibility Testing:** `axe-core/playwright` asserts zero critical WCAG 2.1 AA violations on semantic HTML, ARIA landmarks, focus management, and touch targets.
- **Responsive Layout Verification:** Verified against 36 distinct viewport configurations across 4 breakpoints (390px, 639px, 768px, 1024px, 1440px) to ensure no horizontal document overflow.
- **Smoke Suites:** Dedicated `Preview` and `Production` Playwright smoke suites validate final bundle integrity, security headers, and non-destructive customer flows.

## Tech Stack & Tooling

| Capability | Technology |
|---|---|
| **Framework** | Next.js 16.3.0 (App Router) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS 4 |
| **Testing** | Vitest, React Testing Library, Playwright |
| **Validation** | Zod `^4.4.3` |
| **Encryption** | Node.js native `crypto` (AES-256-GCM) |
| **CI/CD** | Vercel (Ready), `npm run scan:bundle` |

## Environment Variables

The application requires specific environment variables for local development and production. See `.env.example` for safe default templates.

| Variable | Requirement | Description |
|---|---|---|
| `ECOMMERCE_API_BASE_URL` | Required | The verified upstream API host (e.g., `https://ecommerce.routemisr.com/api/v1`). |
| `APP_ORIGIN` | Required | The current domain of the application (e.g., `http://localhost:3000`). Used for constructing absolute redirect URLs (e.g. Stripe checkout). |
| `SESSION_ENCRYPTION_KEY` | Required | A 32-byte unpadded base64url string. Strictly server-only. Used for AES-256-GCM session cookie encryption. |
| `NEXT_PUBLIC_*` | Banned | No variables use this prefix to prevent accidental exposure in client bundles. |

## Getting Started & Local Development

### Prerequisites
- Node.js (v20+ recommended)
- npm or pnpm

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Copy the example environment file and generate a secure session key:
   ```bash
   cp .env.example .env.local
   # Populate SESSION_ENCRYPTION_KEY with a secure 32-byte base64 string
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   *Available at `http://localhost:3000`*

### Verification Commands

- **Type Check:** `npm exec tsc -- --noEmit`
- **Linting:** `npm run lint`
- **Unit/Component Tests:** `npx vitest run`
- **Bundle Secret Scan:** `npm run scan:bundle`

### Production Build

```bash
npm run build
npm run start
```

## Project Structure

```text
/
├── app/                  # Next.js App Router (Routes, Layouts, Pages)
│   ├── (auth)/           # Route group: Sign-in, sign-up, recovery
│   ├── (checkout)/       # Route group: Checkout and payment return
│   ├── (shop)/           # Route group: Catalog, Cart, Account, Wishlist
│   └── api/              # Route handlers
├── components/           # Shared UI architecture
│   ├── layout/           # App shells, headers, footers, navigation
│   └── commerce/         # Reusable e-commerce primitives (Product Card)
├── features/             # Domain-specific compositions and server actions
│   ├── auth/             # Session, encryption, sign-in forms
│   ├── catalog/          # Products, categories, brands, filters
│   └── cart/             # Cart state, actions, buttons
├── lib/                  # Server-side infrastructure
│   ├── api/              # Endpoints, schemas, transport adapters
│   └── env/              # Server-only environment validation
├── tests/                # Vitest and Playwright test suites
└── docs/                 # Project documentation (TASKS, DECISIONS, PRD)
```

## Deployment & Rollback Guide

### Vercel Deployment

1. Connect the repository to a Vercel project.
2. Configure the **Environment Variables** in the Vercel dashboard matching `.env.example`.
3. The build command `npm run build` (which includes `prebuild` bundle scanning) will automatically run.
4. Vercel Edge caching and Next.js ISR behaviors are governed by `cache: "no-store"` directives applied to authenticated routes.

### Rollback Protocol

Nexa Store employs a stateless frontend architecture, meaning deployments are not coupled to database migrations.

**Zero-Downtime Rollback:**
If a critical incident occurs post-deployment (refer to `docs/ROLLBACK_CHECKLIST.md` for the smoke suite), rollback is achieved instantly by:
1. Identifying the previous stable deployment ID.
2. Clicking **"Redeploy" / "Rollback"** in the hosting dashboard.
3. Traffic is instantly routed to the previous immutable build artifact.
