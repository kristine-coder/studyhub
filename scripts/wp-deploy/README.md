# WordPress journal deploy (StudyHub)

Applies the **journal shell** (header, footer, sidebar, home + single templates) and updates the **Week 1 draft** from `docs/blog/week-01-introduction.md`.

## Option A — Application password (recommended)

1. WordPress.com → **Users → Security → Application passwords** → create one named `cursor-deploy`.
2. In PowerShell:

```powershell
$env:WP_USER = "kmegrelishvili"
$env:WP_APP_PASS = "paste the app password here"
cd c:\Users\USER\studyHUB\scripts\wp-deploy
node deploy-journal.mjs
```

3. Check the printed `preview` URL.

Regenerate Gutenberg HTML for **all weeks** (paste into posts; title band stays on the Single Posts template):

```powershell
$md2 = "c:\Users\USER\studyHUB\scripts\wp-deploy\md2wp-plain.js"
$blog = "c:\Users\USER\studyHUB\docs\blog"
@(
  @("week-01-introduction.md","week-01-wordpress.html"),
  @("week-02-team-technology-setup.md","week-02-wordpress.html"),
  @("week-03-requirements-and-use-cases.md","week-03-wordpress.html"),
  @("week-04-use-case-specification.md","week-04-wordpress.html"),
  @("week-05-testing-with-cucumber.md","week-05-wordpress.html"),
  @("week-06-in-progress.md","week-06-wordpress.html"),
  @("about.md","about-wordpress.html")
) | ForEach-Object { node $md2 "$blog\$($_[0])" "$blog\$($_[1])" }
```

Legacy path for deploy bundle Week 1 only:

```powershell
node $md2 "$blog\week-01-introduction.md" c:\Users\USER\studyHUB\scripts\wp-deploy\plain\week-01-introduction.html
```

## Option B — Browser console (logged into wp-admin)

HTTPS wp-admin **cannot** load `http://127.0.0.1:8765` (mixed content). Use the **chunks** in `chunks/`:

1. Open any post in the block editor (so `wp` exists).
2. F12 → Console → enable multi-line (`Ctrl+B` in Firefox).
3. Paste and run **in order**: `chunk-0.js` … `chunk-7.js`, then `chunk-run.js`.

Rebuild chunks after content changes:

```powershell
cd C:\Users\USER\AppData\Local\Temp\wpconv   # or copy build scripts here
node build-bundle.js
node build-chunks.js
```

## Local server (optional)

```powershell
node C:\Users\USER\AppData\Local\Temp\wpconv\serve.js
```

Serves templates for backup/development only; not for HTTPS console fetch.
