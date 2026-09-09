# daniel.ma

Personal static site. No build step, no framework — plain HTML/CSS/JS served as-is.
Cloudflare Pages deploys `main` on every push; PRs get preview URLs.

## Layout

- `index.html`, `index.css` — landing page
- `vietnamese/` — flashcards app, served at `/vietnamese/`
  - `cards.js` — vocabulary (edit this to add words)
  - `sentences.js`, `stories.js` — sentence / story practice content
  - `app.js`, `styles.css`, `index.html` — the app itself
  - `audio/` — recorded pronunciation clips (`.m4a` / `.wav`)

## Working here

- Keep it dependency-free. No bundler, no npm packages in the site itself.
- Match the surrounding style in each file.
- `ci` (GitHub Actions) checks JS syntax and HTML on every PR — keep it green.

## Finishing a change (required)

After opening a pull request, enable auto-merge so it lands on `main` once `ci`
passes and Cloudflare's preview deploy succeeds:

```sh
gh pr merge --auto --squash --delete-branch
```

Do this as the last step of every PR unless the user says otherwise.
