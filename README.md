# Enterprise Portfolio & Engineering Showcase

[![Enterprise CI Pipeline](https://github.com/ammarmohamed/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/ammarmohamed/portfolio/actions)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript Ready](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An enterprise-grade, highly performant, accessible, and recruiter-focused Software Engineer Portfolio and **Enterprise Admin Dashboard & CMS (Phase 1.5)** built with **Next.js 16 (App Router)**, **React 19**, **Prisma ORM**, **PostgreSQL**, **Tailwind CSS v4**, and **Framer Motion**.

---

## 🚀 Key Architectural Features

- **Enterprise Admin CMS (Phase 1.5)**:
  - **Prisma ORM & PostgreSQL**: Normalized domain models (`User`, `Permission`, `Setting`, `AuditLog`, `ActivityLog`, `Project`, `Skill`, `Certificate`, `BlogPost`, `Message`, `Media`).
  - **Repository & Service Pattern**: Encapsulated database operations (`server/repositories/`, `server/services/`).
  - **Authentication & RBAC**: JWT session engine (`jose` + `bcryptjs`), Middleware route guards (`middleware.js`), and strict `ADMIN` / `EDITOR` roles.
  - **Storage Abstraction Layer**: Unified storage interface (`server/storage/`) supporting Cloudinary, Supabase, and Local storage providers.
  - **API Response Standardization**: All endpoints return unified `{ success, message, data, meta }` or `{ success: false, error: { code, message } }`.
  - **Database Seeding & Backups**: Automated seeding (`npm run seed`) and backup/restore scripts (`scripts/backup.js`, `scripts/restore.js`).
- **SEO Enterprise Suite**: Dynamic XML sitemap (`/sitemap.xml`), `robots.txt`, RSS 2.0 (`/feed.xml`), JSON-LD Person & WebSite Schemas, OpenGraph, Twitter Cards.
- **Dual Email Gateway**: Concurrent delivery via Resend API and Gmail SMTP (Nodemailer).
- **Accessibility (WCAG AA)**: Full keyboard navigation, skip-to-content mechanism, screen reader aria-labels, and automated Axe testing.
- **Performance & Security**: Security headers (`CSP`, `HSTS`, `X-Frame-Options`), `.env.local` secret isolation, sub-100ms response times.

---

## 🔐 Environment Variables & Secret Setup

Copy `.env.example` to `.env.local` and configure your credentials:

```env
# Database Connection (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/portfolio_cms?schema=public"

# Authentication Secrets
JWT_SECRET="replace_with_jwt_secret_min_32_chars"

# Email Gateway Secrets
RESEND_API_KEY="re_your_resend_api_key"
GMAIL_USER="ammar.mohamed2962023@gmail.com"
GMAIL_APP_PASSWORD="nkjtxkzyftpzarqo"
CONTACT_EMAIL="ammar.mohamed2962023@gmail.com"

# Storage Provider Configuration (local | cloudinary | supabase)
STORAGE_PROVIDER="local"
```

---

## 🛠️ CLI Commands & Utilities

```bash
# Development Server
npm run dev

# Database Validation & Seeding
npx prisma validate
npx prisma generate
npx prisma db seed

# Backup & Restore Scripts
node scripts/backup.js
node scripts/restore.js <path-to-backup.json>

# Linting & Testing
npm run lint
npm run test

# Production Build
npm run build
```

---

## 📐 Directory Structure

```
.
├── app/
│   ├── admin/              # Enterprise Admin CMS Dashboard & Login
│   ├── api/                # Standardized API Endpoints
│   ├── blog/               # Dynamic Blog & Article viewer
│   ├── certificates/       # Certificate verification showcase
│   ├── projects/           # Deep-dive Project showcases
│   └── resume/             # Interactive Resume & Timeline
├── components/             # UI Components (Admin & Portfolio)
├── lib/
│   ├── api/                # Response standardization (apiSuccess, apiError)
│   ├── auth/               # JWT Session Engine & Password Hashing
│   └── prisma.js           # Prisma Client Singleton
├── prisma/
│   ├── schema.prisma       # Normalized PostgreSQL Schema
│   └── seed.js             # Automated Database Seed Script
├── server/
│   ├── repositories/       # Data Access Repository Layer
│   ├── services/           # Business Logic Services
│   └── storage/            # Unified Storage Provider Abstraction
├── scripts/
│   ├── backup.js           # Database Backup Utility
│   └── restore.js          # Database Restore Utility
└── middleware.js           # Route Guard & RBAC Middleware
```

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
