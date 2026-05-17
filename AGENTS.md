# Agent Guide (Claude Code + Codex)

This file is the shared source of truth for AI coding agents working on this
project. Both **Claude Code** and **OpenAI Codex** read `AGENTS.md` by
convention. Keep project-wide rules here so the two agents stay in sync.

## Project

Trading app (Next.js, deployed via Vercel). Supabase is used for auth and
data persistence.

## Stack

- Next.js (App Router) + TypeScript
- Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- Tailwind (assumed — adjust if different)
- Vercel for hosting

## Setup

```bash
npm install @supabase/supabase-js @supabase/ssr
cp .env.local.example .env.local   # then fill in real values
npm run dev
```

## Environment

- `.env.local` is git-ignored. Never commit it.
- `.env.local.example` documents required keys.
- The Supabase **publishable** key is safe to expose to the browser (RLS
  enforces row access). The **service-role** key, if added later, must
  stay server-side only.

## Supabase client helpers (in `utils/supabase/`)

- `server.ts` — server-side client (Server Components, Route Handlers,
  Server Actions). Pass it the awaited `cookies()` store.
- `client.ts` — browser client (Client Components).
- `middleware.ts` — keeps sessions refreshed across requests.

Wire `middleware.ts` into `middleware.ts` at the project root with a
matcher that skips static assets.

## Working agreements between agents

1. **One branch per task.** Don't push to `main` directly. Open a PR.
2. **Commit early, commit often.** Push before handing off so the other
   agent picks up your latest work.
3. **Read this file at session start.** If you change conventions, update
   `AGENTS.md` in the same PR so the other agent inherits them.
4. **Don't fight each other's style.** If a file has an established
   pattern, follow it. Refactors live in their own PR.
5. **Migrations** (Supabase SQL) go under `supabase/migrations/` with an
   ISO timestamp prefix. Never edit a shipped migration; add a new one.
6. **Secrets stay in `.env.local` / Vercel project env.** Never inline.

## Trading-specific guardrails

- All order-placement code paths must be idempotent (use a client-supplied
  idempotency key). Double-submits cost real money.
- Any code that touches live order routing must be gated by an explicit
  `TRADING_LIVE=true` env var. Default to paper/sandbox.
- Log every order with: timestamp, instrument, side, qty, price, user id,
  idempotency key. Never log API secrets.

## Notes for Claude Code specifically

- `CLAUDE.md` re-exports this file. Edit `AGENTS.md`, not `CLAUDE.md`.
