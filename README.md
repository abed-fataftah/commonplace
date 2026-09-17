# Commonplace

A keyboard-first Markdown notes app. Capture quickly, tag, find instantly.

Work in progress.

## Stack

- **API** — Node, Express 5, TypeScript, MongoDB (Mongoose), Zod
- **Web** — React 19, Vite, TypeScript
- **Shared** — Zod schemas and inferred types used by both

## Running locally

Requires Node 22.12+.

```bash
npm install
cp apps/api/.env.example apps/api/.env
npm run dev
```

- Web — http://localhost:5173
- API — http://localhost:5001

The Vite dev server proxies `/api/*` to the API, so the browser only ever sees one origin.

## Scripts

| Command             | Effect                     |
| ------------------- | -------------------------- |
| `npm run dev`       | Start API and web together |
| `npm run typecheck` | Type-check every workspace |
| `npm run lint`      | ESLint across the repo     |
| `npm run format`    | Format with Prettier       |
