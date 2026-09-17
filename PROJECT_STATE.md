# PROJECT_STATE

**Project:** Commonplace — a keyboard-first Markdown notes app.
**Current phase:** Phase 2 — backend core (data model, validation, notes API)

## Architecture

npm workspaces monorepo, TypeScript throughout.

    apps/api          Express 5 (+ Mongoose, not yet added)
    apps/web          React 19 + Vite
    packages/shared   Zod schemas and types shared by both

Deployment target: a single Render web service. Express serves the built SPA in
production, so the browser always sees one origin. Vite's dev proxy mirrors that locally.

## Decisions that still bind

- **Single origin everywhere.** No CORS middleware, no `VITE_API_URL`, relative `/api` URLs.
  Split deployment was rejected: `*.onrender.com` subdomains are cross-site, so auth cookies
  would need `SameSite=None` and break in Safari and Firefox strict mode.
- **Shared package ships TypeScript source**, not built output (`exports` → `src/index.ts`).
  No build step, no stale `dist`.
- **TypeScript pinned to 6.0.3.** typescript-eslint 8.x supports `<6.1.0`; TS 7 is unsupported.
  Revisit when typescript-eslint ships TS 7 support.
- **Express 5** forwards async rejections to error middleware natively. Controllers need no
  try/catch and no async wrapper.
- **No daisyUI.** Own design system on Tailwind v4 + Radix primitives (Phase 4).

## Done

Phase 1 complete: monorepo, workspaces, TypeScript, ESLint + Prettier, Express 5 API with
validated env config and `/api/health`, Vite React app, shared types crossing both
boundaries, GitHub repo.

## Not started

Phase 2 onward: Note model, Zod schemas, notes CRUD, auth, design system, notes UI,
search and tags, polish, deployment.

## Known issues

- Vite proxy target `http://localhost:5001` is hardcoded and must match `PORT` in `apps/api/.env`.
- No tests yet. Vitest + Supertest arrive with the notes API in Phase 2.

## Next step

Phase 2: MongoDB Atlas connection, `Note` model, Zod schemas in `packages/shared`, layered
notes API (route → validate → controller → service → model), central error handler.
