# API Architecture

| Route | Method | Purpose | Response |
|---|---|---|---|
| `/api/contact` | POST | Validates & processes user messages | `{ success, message, data/details }` |
| `/api/health` | GET | System health & uptime metric | `{ status, uptime, environment }` |
| `/api/analytics` | POST | Event tracking telemetry | `{ success }` |
| `/api/status` | GET | Operational service check | `{ service, status, systems }` |
| `/feed.xml` | GET | RSS 2.0 XML feed | `application/xml` |

All API inputs undergo strict Zod parsing before downstream execution.
