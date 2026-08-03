# Security Standards & Policies

1. **HTTP Headers**:
   - `Strict-Transport-Security`: HSTS enabled for 2 years with preloading.
   - `X-Frame-Options`: Set to `SAMEORIGIN` to block clickjacking attacks.
   - `X-Content-Type-Options`: Set to `nosniff` to prevent MIME-sniffing.
   - `Referrer-Policy`: Set to `origin-when-cross-origin`.
   - `Permissions-Policy`: Restricts camera, microphone, and geolocation APIs.
2. **Rate Limiting**: IP rate-limiting applied to form endpoints.
3. **Input Sanitization**: Zod parsing strips unexpected fields and enforces type constraints.
