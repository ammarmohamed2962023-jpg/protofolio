# Performance Optimization Strategy

1. **Format Conversion**: Images served in AVIF and WebP via Next.js image pipeline.
2. **Compression**: Brotli & Gzip enabled in `next.config.mjs`.
3. **Bundle Optimization**: Dead code eliminated; zero unused packages; dynamic imports used for heavy modals.
4. **Target Core Web Vitals**:
   - LCP < 1.2s
   - FID / INP < 50ms
   - CLS = 0.00
