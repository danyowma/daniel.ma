# daniel.ma

Personal static site. No build step — plain HTML/CSS/JS.

## Vietnamese flashcards

Lives in [`vietnamese/`](vietnamese/) and is served at `/vietnamese/`.

- **Picture on one side, word + English + audio on the other.** Tap/click or press
  Space to flip; flipping to reveal the word always speaks it.
- **Controls:** Category and Order (In order / Shuffle / Random endless), behind
  a "Show filters" toggle.
- **Keyboard:** Space = flip, ← → = move, `S` = speak, `R` = reshuffle.
  On touch: swipe left/right to move.
- Audio uses the browser's built-in speech synthesis. Quality depends on whether
  a Vietnamese voice is installed (macOS/iOS: Settings → Accessibility → Spoken
  Content → Voices → add Vietnamese).

### Adding words

Edit [`vietnamese/cards.js`](vietnamese/cards.js). Each card:

```js
{ category: "Food", vi: "trứng", en: "egg",
  image: "https://…", note: "optional hint" }
```

Then:

```sh
git add vietnamese/cards.js
git commit -m "New vocab"
git push
```

Cloudflare Pages redeploys automatically. If an image URL ever breaks, the card
falls back to showing the English word.

## Budget

Lives in [`budget/`](budget/) (UI + pure calculation modules) and
[`functions/budget/`](functions/budget/) (the API), served at `/budget/`. A
YNAB-style envelope budgeting app for two people, backed by Cloudflare D1.

- **Money is always integer cents.** Every calculation that decides what a
  number on screen means — rollover, Ready to Assign, split totals — lives
  in [`budget/lib/`](budget/lib/) as small pure functions with no I/O, and
  is exercised by [`budget/lib/*.test.js`](budget/lib/) (Node's built-in
  test runner, no dependency added). Run them with:
  ```sh
  cd budget && node --test
  ```
  `ci` runs the same command on every PR — a change to the budgeting math
  that isn't covered by a test, or that breaks an existing one, fails the
  build.
- **QFX/OFX import** (`budget/lib/qfx-parser.js`) handles both the old
  SGML dialect (unclosed leaf tags) and the newer XML dialect banks export
  under "Download to Quicken". Transactions are deduped by their OFX
  `FITID`, so re-importing an overlapping date range never creates
  duplicates.
- **Access control**: Cloudflare Access gates the whole `/budget/*` path —
  see below. The API trusts the `Cf-Access-Authenticated-User-Email` header
  Access injects and does no auth of its own.

### Setting up Cloudflare Access

One-time setup in the [Zero Trust dashboard](https://one.dash.cloudflare.com/):

1. **Access → Applications → Add an application → Self-hosted.**
2. Domain: `daniel.ma`, path: `/budget`.
3. Add a policy — Action: Allow, Include: emails equal to your two Google
   accounts (comma-separated, or one rule per email).
4. Login method: Google OAuth (add one-time PIN as a fallback if desired).

No code or config in this repo drives this — it's Cloudflare's edge sitting
in front of the whole `/budget/*` path, so nothing under it (including the
API) is reachable without passing that check.

### D1 database

```sh
wrangler d1 create daniel-ma-budget
# paste the returned database_id into wrangler.toml
wrangler d1 execute daniel-ma-budget --remote --file=budget/schema.sql
```

The `[[d1_databases]]` binding in [`wrangler.toml`](wrangler.toml) (name
`BUDGET_DB`) needs to also be added under the Pages project's **Settings →
Functions → D1 database bindings** in the dashboard, since Pages Functions
bindings are configured there rather than picked up from `wrangler.toml`
automatically.

### Local dev

```sh
wrangler pages dev budget --d1=BUDGET_DB
```

Cloudflare Access doesn't run locally, so `Cf-Access-Authenticated-User-Email`
won't be set — requests to the API will 401 unless you add the header
yourself, e.g. via a browser extension or `curl -H`.

## Deploy

- Repo: `github.com/danyowma/daniel.ma` (private), production branch `main`.
- **Cloudflare Pages** is connected to the repo via Git integration. Every push
  to `main` deploys production; every PR gets a preview URL. Build settings:
  framework preset **None**, no build command, output directory `/`.
- Live at `https://daniel-ma.pages.dev` (custom domain `daniel.ma` via the Pages
  project's **Custom domains**).
- **`ci`** (GitHub Actions, [`.github/workflows/ci.yml`](.github/workflows/ci.yml))
  runs on every PR: JS syntax check + HTML sanity check.
- [`_headers`](_headers) sets `Cache-Control: no-cache` on assets (JS/CSS) so
  browsers always revalidate with the server instead of serving a stale
  cached copy after a deploy, and `no-store` on the HTML pages themselves —
  `no-cache` alone doesn't stop mobile Safari from restoring an entire old
  page (HTML and all) from its back-forward cache without hitting the
  network at all; `no-store` opts the page out of that.

## Editing from a phone

1. Open [claude.ai/code](https://claude.ai/code) → pick `daniel.ma`.
2. Describe the change ("add a flashcard for …", "fix the flip animation").
3. Claude works in a cloud sandbox, opens a PR, and enables auto-merge
   (see [`CLAUDE.md`](CLAUDE.md)).
4. Once `ci` passes, the PR squash-merges itself and Cloudflare deploys `main`.
   (The Cloudflare PR preview build also runs, but only `ci` gates the merge.)

Auto-merge relies on a branch protection rule on `main` that requires the `ci`
check. It does **not** require a review (a solo owner can't approve their own PR).

## Local preview

```sh
python3 -m http.server 8000
# then visit http://localhost:8000/ and /vietnamese/
```
