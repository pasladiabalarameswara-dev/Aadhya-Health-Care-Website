---
name: Netlify static build defaults
description: Vite artifacts deployed from this workspace need host-independent build defaults.
---

Static hosting builds may not provide Replit's PORT or BASE_PATH variables. Vite configs should default the port to a harmless preview value and the base path to `/`, while retaining Replit overrides for workspace previews.

**Why:** Requiring those environment variables makes a valid Netlify build fail before Vite can compile.

**How to apply:** Use `process.env.PORT ?? '4173'` and `process.env.BASE_PATH ?? '/'` for static Vite artifacts, and include an SPA fallback redirect in the published public directory.