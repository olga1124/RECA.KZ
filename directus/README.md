# Directus provisioning

Directus **11.17.4** (self-hosted). We pin to v11 because Directus 12's MSCL
license caps the free Core tier at 25 user collections, and this i18n +
page-builder schema needs ~43.

## Schema

`snapshot.yaml` is an exported schema snapshot (source of truth for structure).
The schema is built idempotently by the scripts in `../scripts/directus/`.

## Reprovision from scratch

Set credentials in `.env.local` at the repo root:

```
DIRECTUS_URL=https://adm.reca.kz
DIRECTUS_ADMIN_TOKEN=<temporary admin token>
```

Then run, in order:

```bash
# 1. Structure — all collections, fields, relations, translations
node --env-file=.env.local scripts/directus/schema.mjs

# 2. Limited "Website Service" role + static token (prints DIRECTUS_SERVICE_TOKEN)
node --env-file=.env.local scripts/directus/role.mjs

# 3. Content — languages (ru/kz/en) + current site content
node --env-file=.env.local scripts/directus/seed.mjs
```

All scripts are idempotent — safe to re-run.

## Applying the snapshot instead

To recreate structure on a fresh instance without the scripts:

```bash
# copy snapshot.yaml onto the server, then inside the directus container:
npx directus schema apply ./snapshot.yaml
```

## Security model

- **Public role**: no access (images are proxied through the Next.js server,
  which uses the service token — the browser never hits Directus directly).
- **Website Service role**: read on content + `directus_files`, create on
  `leads` / `applicants` / `directus_files`. No delete, no admin, no read on
  submissions. Its static token is the only credential the frontend holds.
- The **admin token** is only for provisioning; revoke it afterwards.
