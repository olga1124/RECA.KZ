# Caddy (reverse proxy / TLS)

Shared Caddy stack for the reca.kz deployment. Terminates TLS and reverse-proxies:

- `adm.reca.kz` → `directus:8055` (active now)
- `reca.kz` → `app:3000` (added later, at cutover — see `Caddyfile`)

## First-time setup on the server

Prerequisites (already done): Directus + Postgres running on the external
`reca-network`; DNS `adm.reca.kz` → server IP.

```bash
# On the server (194.238.40.146)
mkdir -p /srv/apps/reca/caddy
# copy Caddyfile and docker-compose.yml into /srv/apps/reca/caddy/
cd /srv/apps/reca/caddy
docker compose up -d
docker compose logs -f caddy   # watch it obtain the adm.reca.kz certificate
```

Verify from anywhere:

```bash
curl -I https://adm.reca.kz    # should return HTTP 200/302 from Directus
```

## Cutover (later)

When reca.kz DNS is switched to this server and the `app` container is running,
add to `Caddyfile`:

```
reca.kz {
    reverse_proxy reca-app:3000
}
```

then `docker compose exec caddy caddy reload --config /etc/caddy/Caddyfile`
(or `docker compose restart caddy`).
