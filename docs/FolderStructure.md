# Folder Structure Guidelines

```
.
├── .github/              # Actions CI workflows, issue templates, dependabot
├── app/                  # Next.js App Router pages, metadata, and API handlers
│   ├── api/              # Server route endpoints (contact, health, analytics, status)
│   ├── blog/             # Knowledge Hub subpage
│   ├── certificates/     # Certificate credential subpage
│   ├── projects/         # Project showcase subpage
│   └── resume/           # Resume subpage
├── components/           # Modular UI component library
├── context/              # Context providers (LanguageContext i18n)
├── docs/                 # Enterprise documentation suite
├── lib/                  # Custom hooks, utilities, translation dictionaries
├── public/               # Static assets, manifest.json, sw.js
└── tests/                # Vitest unit test suites
```
