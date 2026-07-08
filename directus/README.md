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

## Telegram notifications

New `leads` (заявки) and `applicants` (резюме) submissions are announced in a
private Telegram group via two Directus **Flows** (one per collection). Flows
live in the Directus app, not in this repo — this section is the setup runbook.

The bot (`@Recakzbot`) is publicly discoverable, but it only ever *sends* to the
one hard-coded group `chat_id`; it has no message handler, so anyone who DMs it
gets nothing. Keep privacy mode ON in @BotFather.

### 1. Secrets (Directus container env)

Never hard-code the token in a flow — flow JSON is exported in snapshots/backups.
Flows read env vars via `{{$env.…}}`, which requires the allow-list. Add to the
`directus` service env and restart the container:

```
TELEGRAM_BOT_TOKEN=<from @BotFather>
TELEGRAM_CHAT_ID=-5353823118            # group "Recakz (лиды)"
FLOWS_ENV_ALLOW_LIST=TELEGRAM_BOT_TOKEN,TELEGRAM_CHAT_ID
```

> The group is a basic `group`, so its id is the short `-53…` form. If it is ever
> upgraded to a **supergroup** (enabling topics, a public link, etc.) the id
> switches to the `-100…` form and notifications stop until `TELEGRAM_CHAT_ID` is
> updated. Re-fetch it via `getUpdates` if messages ever go silent.

To (re)obtain the id: mention the bot in the group (`@Recakzbot test`) — privacy
mode blocks plain messages — then open
`https://api.telegram.org/bot<TOKEN>/getUpdates` and read `chat.id`.

Smoke-test the Telegram side independently of Directus:
`https://api.telegram.org/bot<TOKEN>/sendMessage?chat_id=-5353823118&text=test`

### 2. Flow shape (both flows)

Each flow is **Trigger → Run Script → Webhook**, one per collection:

- **Trigger**: Event Hook → *Action (Non-Blocking)* → `items.create` → collection
  `leads` (resp. `applicants`).
- **Run Script** (key `message`): builds the message text and returns
  `{ text, textJson }` where `textJson = JSON.stringify(text)`.
- **Webhook / Request URL** (key `send_message`):
  - Method `POST`
  - URL `https://api.telegram.org/bot{{$env.TELEGRAM_BOT_TOKEN}}/sendMessage`
  - Body — inject the **pre-stringified** value (note: no quotes around the token):
    ```
    {"chat_id":"{{$env.TELEGRAM_CHAT_ID}}","text":{{message.textJson}}}
    ```

Why a Run Script instead of a plain body template:

- **`leads` has 4 source forms** (contact / hire / subscription / callback, see
  `scripts/directus/content.mjs`). Only 7 fields are real columns; everything else
  each form collects lands in the `details` JSON column. A fixed `{{payload.x}}`
  template would drop those and print empty lines. The script skips empty fields
  and expands `details` with human labels.
- **Escaping**: message text contains newlines, and user input can contain `"`,
  `&`, `<`. Interpolating that straight into a JSON body string produces invalid
  JSON — Telegram then rejects it with `400 "message text is empty"`. Passing
  `JSON.stringify(text)` (which escapes everything) as the whole `text` value is
  the fix.

> **Gotcha:** in the script, produce the newline with `String.fromCharCode(10)`,
> not a `\n` literal — a `\n` typed in the API/round-trip can decay into a real
> newline and break the script with a `SyntaxError` in the isolated-vm sandbox.
> `$trigger.key` holds the new record id; `$env` is also readable inside the
> script.

Lead script joins: name, phone, email, company, position, `selections` (array →
comma list), subject, then each `details` entry (`service`, `positions_count`,
`city`, `vacancies_monthly`, `call_time`), source language, and the admin link
`…/admin/content/leads/<key>`. The applicant script: name + last_name, phone,
email, a "загрузил резюме" line, optional `details.cover_letter`, and the admin
link. The CV file lives in the private `CV` folder (not served publicly), so the
message links to the admin record where it can be downloaded.

### 3. Networking caveat (DNS)

The Directus container must resolve `api.telegram.org`. An intermittent
`getaddrinfo EAI_AGAIN api.telegram.org` was seen once — a transient resolver
failure. If notifications start failing with that error in the flow logs, pin
DNS on the `directus` service in its compose (`dns: [1.1.1.1, 8.8.8.8]`) and
recreate the container.

### 4. Verifying / debugging

Flow runs are stored as revisions. To read the last run's per-step status and the
Telegram response (`ok:true` or the error), query as admin:

```
GET /revisions?filter[_and][0][collection][_eq]=directus_flows
  &filter[_and][1][item][_eq]=<flow-id>
  &filter[_and][2][activity][action][_eq]=run&sort=-id&limit=1&fields[]=data
```

`data.steps[].status` shows where it stopped; `data.data.send_message.data` holds
Telegram's reply.

## Security model

- **Public role**: no access (images are proxied through the Next.js server,
  which uses the service token — the browser never hits Directus directly).
- **Website Service role**: read on content + `directus_files`, create on
  `leads` / `applicants` / `directus_files`. No delete, no admin, no read on
  submissions. Its static token is the only credential the frontend holds.
- The **admin token** is only for provisioning; revoke it afterwards.
