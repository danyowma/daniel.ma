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

## Local preview

Open `vietnamese/index.html` directly in a browser, or serve the folder:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000/vietnamese/
```

## Deploy: GitHub + Cloudflare Pages

One-time setup.

1. **Install git** (macOS Command Line Tools), if `git --version` fails:

   ```sh
   xcode-select --install
   ```

2. **Create the repo and push to GitHub:**

   ```sh
   cd /Users/dma/Code/daniel.ma
   git init
   git add .
   git commit -m "Vietnamese flashcards"
   git branch -M main
   # create an empty repo on github.com first, then:
   git remote add origin git@github.com:<you>/daniel.ma.git
   git push -u origin main
   ```

3. **Connect it in Cloudflare:**
   - Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
     **Connect to Git** → pick the `daniel.ma` repo.
   - Build settings:
     - Framework preset: **None**
     - Build command: **(leave empty)**
     - Build output directory: **`/`**
   - **Save and Deploy.**

4. Every `git push` to `main` now triggers a deploy. The flashcards are at
   `https://<project>.pages.dev/vietnamese/`. Attach `daniel.ma` under
   **Custom domains** in the Pages project when ready.
