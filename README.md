# REC-A — reca.kz

Marketing website for **REC-A**, a full-cycle recruitment agency (Kazakhstan).
A headless, multilingual, SSR site: content is authored in **Directus** and
rendered by **Next.js**, self-hosted on a single VPS behind **Caddy**.

- **Live:** https://reca.kz (ru · kz · en)
- **CMS:** https://adm.reca.kz (Directus admin)

---

## Tech stack

| Layer | Technology |
|---|---|
| CMS / API | Directus 11.17.4 (self-hosted) + PostgreSQL 16 |
| Frontend | Next.js 16 (App Router, React 19, TypeScript) |
| Data | Directus GraphQL, read server-side with a scoped static token |
| Styling | CSS Modules (per block) + a small global token layer; `lucide-react` icons |
| i18n | ru (default) · kz · en, prefixed routes `/ru`, `/kz`, `/en` |
| Reverse proxy / TLS | Caddy 2 (automatic Let's Encrypt certs) |
| Runtime | Docker Compose, three stacks on a shared `reca-network` |
| CI/CD | GitHub Actions → SSH deploy of a prebuilt standalone bundle |

Directus is pinned to **v11** on purpose: v12's license caps the free tier at
25 collections, and this i18n page-builder schema needs ~45.

---

## Architecture

```
                    ┌────────────────────────── VPS (194.238.40.146) ──────────────────────────┐
   Browser ──HTTPS──▶  Caddy ──┬─ reca.kz         → reca-app:3000   (Next.js, SSR)              │
                     (TLS,     ├─ www.reca.kz     → 301 → reca.kz                                │
                      301,     └─ adm.reca.kz     → directus:8055   (Directus admin + assets)   │
                      HSTS)                                                                      │
                                   reca-app ──(server-side, service token, GraphQL)──▶ directus │
                                   directus ──▶ postgres                                         │
                    └────────────────────────────────────────────────────────────────────────┘
```

- **All content is read server-side.** Next.js Server Components query Directus
  over the in-network URL (`http://directus:8055`) with a limited "Website
  Service" static token. The browser never talks to Directus directly.
- **Assets are proxied.** `/api/assets/[id]` streams Directus files through the
  Next server, so Directus needs no public access and stays fully locked down.
- **Forms are validated server-side.** `/api/forms/submit` checks a submission
  against its form definition and writes a `leads` / `applicants` record with
  the service token.
- **Maximum SSR.** Every page is `force-dynamic` — edits in Directus appear on
  the next request, no rebuild or revalidation needed.

---

## Content model (Directus)

The site is a **page builder**. A `pages` record is language-agnostic structure
(slug + SEO + an ordered list of blocks); the text lives in the blocks and is
translated per locale.

- `pages` — `seo_url`, `title` (admin), `seo` (M2O), `blocks` (M2A) + `status`.
- Block collections (each with a translations companion): `block_hero`,
  `block_cards`, `block_stages`, `block_reviews`, `block_richtext`,
  `block_founder_profile`, `block_feature_list`, `block_contact`, `block_cta`,
  `block_form`.
- `forms` + `form_fields` — dynamic forms; a `divider` field splits a form into
  wizard steps. `target_collection` routes submissions to `leads`/`applicants`.
- `reviews` — testimonials (not translated). `navbar_links`, `footer_sections`
  + `footer_links` — navigation. `site_settings` (singleton) — logo, contacts,
  socials. `ui_strings` — all interface text (no hardcoded copy in the app).
- `leads`, `applicants` — form submissions (write-only for the service role).
- `languages` — source of truth for locales.

Every content collection has an `<name>_translations` companion wired as a
Directus translations interface (parent ↔ `languages` M2M).

---

## Project structure

```
src/
  proxy.ts                     # locale middleware: "/x" → "/{locale}/x" redirect
  app/
    layout.tsx                 # root pass-through (html/body live in [locale])
    [locale]/
      layout.tsx               # <html lang>, fonts, Navbar/Footer, ModalProvider
      page.tsx                 # locale home  (permalink "/")
      [slug]/page.tsx          # sub-pages    (permalink "/{slug}")
    api/
      assets/[id]/route.ts     # Directus file proxy (service token)
      forms/submit/route.ts    # form submission → leads/applicants
    sitemap.ts  robots.ts      # SEO
  components/
    PageView.tsx               # shared: fetch page + render blocks (home & slug)
    blocks/
      BlockRenderer.tsx        # collection → component registry
      Hero/  Cards/  Stages/  Reviews/  RichText/  FounderProfile/
      FeatureList/  Contact/  Cta/  FormSection/     # <Block>.tsx + <Block>.module.css
      icons.tsx                # icon-key → static SVG / react-icon mapping
    forms/                     # DynamicForm, FormButton, ui strings
    layout/                    # Navbar, Footer, LanguageSwitcher
    modal/ModalProvider.tsx    # app-wide modal host (no backdrop blur)
    SocialLinks/  ContactMap/  Buttons/
  lib/
    directus/
      client.ts                # server-only GraphQL client (lazy env)
      queries.ts               # typed queries; flatten translations to locale
      types.ts  assets.ts
    i18n/config.ts  i18n/href.ts
    seo/metadata.ts  seo/jsonld.tsx

scripts/directus/              # idempotent provisioning (schema, roles, seed)
directus/                      # snapshot.yaml + provisioning README
deploy/
  caddy/                       # Caddyfile + compose (adm.reca.kz, reca.kz, www)
  frontend/                    # runtime Dockerfile + compose (built in CI)
.github/workflows/deploy.yml   # CI: build + ship standalone bundle over SSH
```

Each block is a self-contained `section → .container → .content` CSS Module.
Blocks that need data (forms, reviews) fetch it in their own async Server
Component; React `cache()` dedupes within a request.

---

## Local development

Prerequisites: Node 20+, access to a Directus instance.

```bash
npm install
cp .env.example .env.local     # fill in the values (see below)
npm run dev                    # http://localhost:3000  → redirects to /ru
```

### Environment variables

| Variable | Scope | Purpose |
|---|---|---|
| `DIRECTUS_INTERNAL_URL` | server | Directus URL the app reads from (`http://directus:8055` in prod; the public URL locally) |
| `DIRECTUS_SERVICE_TOKEN` | server | "Website Service" static token (read content, create submissions) |
| `NEXT_PUBLIC_SITE_URL` | build/runtime | canonical origin for SEO (canonical, hreflang, sitemap) |
| `DIRECTUS_URL`, `DIRECTUS_ADMIN_TOKEN` | tooling only | used by the provisioning scripts; keep in `.env.local`, never commit |

`.env.local` is git-ignored. `DIRECTUS_ADMIN_TOKEN` is temporary — revoke it in
Directus after provisioning.

---

## Directus provisioning

Recreate the whole CMS from scratch (idempotent, safe to re-run):

```bash
npm run directus:schema   # collections, fields, relations, translations
npm run directus:role     # limited "Website Service" role + static token
npm run directus:seed     # languages + current content (ru/kz/en)
```

See `directus/README.md` for details and `directus/snapshot.yaml` for the schema
source of truth.

---

## Deployment

Build happens in **CI**, not on the server; only the compiled Next standalone
bundle is shipped. See `DEPLOYMENT.md` for the full runbook.

- **Trigger:** push to the deploy branch → `.github/workflows/deploy.yml`.
- **Flow:** `npm ci && npm run build` on the runner → assemble
  `.next/standalone` + `.next/static` + `public` → `rsync` to
  `/srv/apps/reca/frontend/` → `docker compose up -d --build` (thin runtime
  image, `node server.js`). No source tree and no secrets on the server; runtime
  env comes from the server's `.env`.
- **TLS:** Caddy obtains and auto-renews Let's Encrypt certificates; nothing to
  do manually. Keep ports 80/443 open and the `caddy_data` volume intact.

Server stacks (each on the external `reca-network`):

| Stack | Path | Role |
|---|---|---|
| Directus + Postgres | `/srv/apps/reca/directus/` | CMS + DB |
| Caddy | `/srv/apps/reca/caddy/` | reverse proxy + TLS |
| Frontend | `/srv/apps/reca/frontend/` | Next.js app (prebuilt bundle) |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Next dev server |
| `npm run build` | Production build (webpack, standalone output) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run directus:schema` / `:role` / `:seed` | Directus provisioning |
