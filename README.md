# Enterprise Portfolio & Engineering Showcase

[![Enterprise CI Pipeline](https://github.com/ammarmohamed/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/ammarmohamed/portfolio/actions)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript Ready](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An enterprise-grade, highly performant, accessible, and recruiter-focused Software Engineer Portfolio built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **Framer Motion**.

---

## 🚀 Key Architectural Features

- **SEO Enterprise Suite**: Dynamic XML sitemap (`/sitemap.xml`), `robots.txt`, RSS 2.0 (`/feed.xml`), JSON-LD Person & WebSite Schemas, OpenGraph, Twitter Cards, and canonical tags.
- **Enterprise API Layer**: Type-safe Next.js API Routes (`/api/contact`, `/api/health`, `/api/analytics`, `/api/status`) with Zod validation, in-memory IP rate-limiting, and structured JSON responses.
- **Accessibility (WCAG AA)**: Full keyboard navigation support, skip-to-content mechanism, screen reader aria-labels, semantic HTML5, and automated Axe testing.
- **Recruiter & Engineering Experience**: Interactive AI Assistant modal, full interactive CLI Terminal emulator, dual English/Arabic i18n support, and certificate/project showcases.
- **Performance & Security**: Image optimization via `next/image`, security headers (`CSP`, `HSTS`, `X-Frame-Options`), dynamic code splitting, and sub-100ms response times.
- **CI/CD Pipeline**: GitHub Actions workflow verifying ESLint compliance, unit tests (`Vitest`), and production builds on every push/PR.

---

## 📐 Architecture & Directory Structure

```
.
├── app/
│   ├── api/
│   │   ├── analytics/      # Telemetry & Web Vitals API
│   │   ├── contact/        # Zod validated & rate-limited contact endpoint
│   │   ├── health/         # System uptime & health monitor
│   │   └── status/         # Service status monitor
│   ├── blog/               # Dynamic Blog & Article viewer
│   ├── certificates/       # Interactive Certificate verification showcase
│   ├── feed.xml/           # Dynamic RSS 2.0 feed generator
│   ├── projects/           # Deep-dive Project showcases
│   ├── resume/             # Interactive Resume & Timeline
│   ├── error.js            # Branded Error Boundary UI
│   ├── global-error.js     # Root Error Catchment
│   ├── layout.js           # Root Layout with Font & Context Providers
│   ├── not-found.js        # Custom 404 Page
│   ├── page.js             # Master Landing Page
│   ├── robots.js           # Dynamic robots.txt generator
│   └── sitemap.js          # Dynamic XML Sitemap generator
├── components/
│   ├── AIAssistant.jsx     # AI Assistant Chatbot Modal
│   ├── About.jsx           # Technical Biography & Metrics
│   ├── Analytics.jsx       # Vercel Analytics + GA4 Telemetry Wrapper
│   ├── BlogSection.jsx     # Technical Knowledge Hub & RSS Feed
│   ├── ContactSection.jsx  # Zod-validated Contact Form
│   ├── Footer.jsx          # Semantic Footer & Admin Modal trigger
│   ├── Hero.jsx            # Dynamic Hero Section with Recruiter CTAs
│   ├── Navbar.jsx          # Responsive Navigation with Language Toggle & Terminal
│   ├── Projects.jsx        # Filterable Portfolio Projects Showcase
│   ├── SkipToContent.jsx   # Keyboard Skip Navigation
│   ├── StructuredData.jsx  # JSON-LD SEO Schemas
│   └── TerminalModal.jsx   # Interactive CLI Terminal Emulator
├── context/
│   └── LanguageContext.jsx # Arabic / English i18n Context Provider
├── lib/
│   ├── hooks.js            # Custom React Hooks (Debounce, LocalStorage, etc.)
│   ├── translations.js     # Bilingual Translation Dictionaries
│   └── utils.js            # Helper functions & validation routines
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions CI Workflow
└── package.json            # Scripts & Dependencies
```

---

## 🛠️ Installation & Local Development

### Prerequisites
- **Node.js**: v20.x or higher
- **npm**: v10.x or higher

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ammarmohamed/portfolio.git
   cd portfolio
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Code Quality

Execute the test suites and linter:

```bash
# Run unit tests with Vitest
npm run test

# Run test coverage report
npm run test:coverage

# Run ESLint validation
npm run lint

# Run End-to-End Playwright tests
npm run test:e2e

# Run Next.js bundle analyzer
npm run analyze
```

---

## ⚡ Deployment & Production Build

To test a production build locally:

```bash
npm run build
npm run start
```

Deployable natively on **Vercel**, **AWS Amplify**, or **Docker** containers.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
