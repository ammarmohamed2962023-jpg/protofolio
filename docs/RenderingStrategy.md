# Rendering Strategy

- **Static Generation (SSG)**: Static routes (`/`, `/projects`, `/blog`, `/certificates`, `/resume`) are pre-rendered at build time for instant TTFB and sub-100ms response times.
- **Dynamic API Routes**: API endpoints (`/api/contact`, `/api/health`, `/api/analytics`, `/api/status`, `/feed.xml`) evaluate dynamically per request.
- **Hybrid i18n Hydration**: Local storage language & theme settings are read lazily during client mounting to preserve static SSR pre-rendering without hydration mismatch errors.
