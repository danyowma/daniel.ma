# daniel.ma

Personal static site. No build step — plain HTML/CSS/JS.

## Vietnamese flashcards

Lives in [`vietnamese/`](vietnamese/) and is served at `/vietnamese/`.

- **Picture on one side, word + English + audio on the other.** Tap/click or press
  Space to flip.
- **Controls:** Category and Order (In order / Shuffle / Random endless).
  "Show Vietnamese first" reverses the card. "Auto-play audio" speaks the
  Vietnamese on each new/flipped card.
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

## Deploy

- Repo: `github.com/danyowma/daniel.ma` (private), production branch `main`.
- **Cloudflare Pages** is connected to the repo via Git integration. Every push
  to `main` deploys production; every PR gets a preview URL. Build settings:
  framework preset **None**, no build command, output directory `/`.
- Live at `https://daniel-ma.pages.dev` (custom domain `daniel.ma` via the Pages
  project's **Custom domains**).
- **`ci`** (GitHub Actions, [`.github/workflows/ci.yml`](.github/workflows/ci.yml))
  runs on every PR: JS syntax check + HTML sanity check.

## Editing from a phone

1. Open [claude.ai/code](https://claude.ai/code) → pick `daniel.ma`.
2. Describe the change ("add a flashcard for …", "fix the flip animation").
3. Claude works in a cloud sandbox, opens a PR, and enables auto-merge
   (see [`CLAUDE.md`](CLAUDE.md)).
4. Once `ci` and the Cloudflare preview pass, the PR merges itself and
   Cloudflare deploys `main`.

Auto-merge relies on a branch protection rule on `main` that requires the `ci`
check. It does **not** require a review (a solo owner can't approve their own PR).

## Local preview

```sh
python3 -m http.server 8000
# then visit http://localhost:8000/ and /vietnamese/
```
