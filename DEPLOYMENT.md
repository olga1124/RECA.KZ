# Deployment

Self-hosted on the VPS (`194.238.40.146`). Three Docker stacks share the
external `reca-network`:

| Stack | Location on server | Purpose |
|---|---|---|
| Directus + Postgres | `/srv/apps/reca/directus/` | CMS + DB (Directus 11.17.4) |
| Caddy | `/srv/apps/reca/caddy/` | Reverse proxy + TLS (see `deploy/caddy/`) |
| Frontend | `/srv/apps/reca/frontend/` | Next.js app (this repo) |

## One-time server setup (frontend)

1. Create `/srv/apps/reca/frontend/.env` (NOT in git):

   ```
   DIRECTUS_INTERNAL_URL=http://directus:8055
   DIRECTUS_SERVICE_TOKEN=<the Website Service token>
   NEXT_PUBLIC_SITE_URL=https://reca.kz
   ```

2. First deploy: push to the repo (CI syncs source here) or copy the repo and
   run `docker compose up -d --build`.

## CI/CD (GitHub Actions → server)

`.github/workflows/deploy.yml` on push:
1. rsyncs the repo source to `/srv/apps/reca/frontend/` (keeps the server `.env`).
2. `docker compose up -d --build` — the image is built on the server; no secrets
   are baked in, runtime env comes from `.env`.

Required repo secrets:

| Secret | Value |
|---|---|
| `SSH_HOST` | `194.238.40.146` |
| `SSH_USER` | deploy user (e.g. `ubuntu`) |
| `SSH_KEY` | private key whose public key is in the server's `authorized_keys` |

## Directus provisioning

See `directus/README.md` — schema/role/seed scripts and the schema snapshot.

## Cutover (go live on reca.kz)

Everything above runs while `reca.kz` still points to Vercel. To switch:

1. In the DNS panel (PS.KZ), point `reca.kz` A record and `www` CNAME at
   `194.238.40.146`.
2. Add the production host to `/srv/apps/reca/caddy/Caddyfile`:
   ```
   reca.kz {
       reverse_proxy reca-app:3000
   }
   ```
   then `docker compose restart caddy` in the caddy stack.
3. Disconnect the Vercel Git integration so it no longer deploys on push.
4. Remove `v2-directus` from the deploy workflow's branch list (main-only).
