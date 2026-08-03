# Architecture Specification

## Overview

The application follows a modern **Clean Component Architecture** built upon Next.js 16 App Router, React 19, Tailwind CSS v4, and Framer Motion. 

```
┌─────────────────────────────────────────────────────────┐
│                      Client Layer                       │
│    (React Components, Framer Motion, Context Providers) │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                      API Router Layer                   │
│      (App Router handlers: /api/contact, /api/health)   │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    Validation & Security                │
│    (Zod Schemas, Rate Limiter, Security Headers, CSP)   │
└─────────────────────────────────────────────────────────┘
```

## Key Architectural Principles

1. **Type Safety & Schema Validation**: Inputs are validated at server boundaries using `zod`.
2. **Predictable Hydration**: Client state hooks are initialized lazily to avoid hydration mismatch and React cascading render warnings.
3. **Decoupled Business Logic**: API handlers and utility functions remain pure and decoupled from visual UI components.
