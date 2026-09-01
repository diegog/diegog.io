# diegog.io

Personal site — a p5.js hero sketch, a short bio, a project list, and a contact
form that delivers to Discord.

Built with **Next.js 16** (App Router, React 19), **Tailwind v4** + **shadcn/ui**
on Base UI, linted and formatted by **Biome**, tested with **Vitest** and
**Playwright**, deployed on **Vercel**.

## Requirements

- Node **24+** (see `.nvmrc`)
- pnpm **11+** — `corepack enable` will pick up the pinned version from
  `packageManager` in `package.json`

`.npmrc` sets `engine-strict=true`, so an install on the wrong Node major fails
loudly rather than producing a subtly broken tree.

## Getting started

```bash
pnpm install
cp .env.example .env.local   # then fill in DISCORD_WEBHOOK_URL
pnpm dev                     # http://localhost:3000
```

The contact form is the only thing that needs configuration. Without
`DISCORD_WEBHOOK_URL` the rest of the site works fine and submissions surface a
"temporarily unavailable" message instead of failing.

### Environment

| Variable | Scope | Purpose |
| --- | --- | --- |
| `DISCORD_WEBHOOK_URL` | **server only** | Discord incoming webhook that contact submissions are posted to |

It must **not** be prefixed `NEXT_PUBLIC_` — that would ship it to the browser and
let anyone post to the channel.

## Scripts

| Command | Does |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm build` / `pnpm start` | Production build / serve it |
| `pnpm lint` / `pnpm lint:fix` | Biome check (lint + format) |
| `pnpm format` | Format only, no lint |
| `pnpm typecheck` | `next typegen` then `tsc --noEmit` |
| `pnpm test` / `pnpm test:watch` | Vitest unit tests |
| `pnpm test:coverage` | Vitest with V8 coverage |
| `pnpm test:e2e` / `pnpm test:e2e:ui` | Playwright (builds and serves first) |

`typecheck` runs `next typegen` first on purpose: `next-env.d.ts` and
`.next/types/*` are generated, gitignored, and required by `tsc` — without them a
fresh clone fails to typecheck on the image imports.

## Layout

```
src/
├── app/             routes (App Router); contact/ holds its Server Action
├── components/      React components; ui/ is shadcn-generated
├── content/         site copy and the project list, as typed modules
├── images/          image sources — imported, never referenced from public/
└── lib/             framework-free logic (Discord delivery, the p5 sketch)
e2e/                 Playwright specs
```

A few conventions worth knowing:

- **Images live in `src/images/`, not `public/`.** Static imports give
  `next/image` intrinsic dimensions, which prevents layout shift. Keep sources at
  roughly 2× their rendered size.
- **`src/lib/` stays free of Next.js imports** so it can be unit-tested without a
  request context.
- **Everything is a Server Component unless it needs to be otherwise.** Only
  `mobile-nav`, `contact-form` and `sketch` are `"use client"`.
- **p5 is dynamically imported** inside an effect so its ~1.4 MB never lands in
  the initial bundle. A Playwright test enforces this.

## Testing

Vitest covers the pure logic — year arithmetic, content shape, Discord payload
construction, Server Action validation, the sketch's circle lifecycle. Playwright
covers everything that needs a real browser, across desktop and mobile viewports:
navigation, the mobile sheet, form behaviour with and without JavaScript, canvas
lifecycle across client-side navigation, and that the site ships no third-party
requests or cookies.

React Testing Library can't render async Server Components, so those are covered
by Playwright rather than unit tests.

```bash
pnpm test && pnpm test:e2e
```

## Git hooks

Lefthook, installed by `pnpm install`:

- **pre-commit** — Biome formats and re-stages the files you touched
- **pre-push** — typecheck and unit tests

Hooks call binaries in `node_modules/.bin` directly rather than through
`pnpm <script>`, because pnpm runs a dependency-status check before every script,
which makes hooks slow and brittle inside git's environment.

Bypass with `--no-verify` when you need to.

## Deployment

Vercel builds and deploys from GitHub — every PR gets a preview, `main` goes to
production. CI (`.github/workflows/CI.yml`) runs Biome, typecheck, unit tests,
build, then Playwright on every PR.

`DISCORD_WEBHOOK_URL` needs setting in the Vercel project (Production, plus
Preview if previews should deliver), and the project's Node version must match
`.nvmrc` or `engine-strict` will fail the build.

