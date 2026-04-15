# Midsteel Website

Static marketing website for Midsteel (ferrous and non-ferrous metal sales).

## Project Layout

- index.html: Main site page
- assets/css/styles.css: Site styling and responsive layouts
- assets/js/script.js: Menu, reveal animations, quote form WhatsApp integration
- preview.html: Redirect page to index.html
- scripts/preview-server.js: Lightweight Node.js static file server for local preview
- assets/images/: Production-ready image assets used by the website
- assets/images/source-uploads/: Original/raw uploaded images kept for reference
- logs/: Local preview server logs (runtime output only)

## Local Preview

1. Ensure Node.js is installed.
2. From the project root, run:

   npm run preview

   If PowerShell blocks `npm` scripts, use:

   npm.cmd run preview

3. Open:

   http://127.0.0.1:4173/

## Notes

- The quote form opens WhatsApp with pre-filled user details.
- For a Node-based host, use `npm start` and provide `PORT` if your platform assigns one.
- For a static host, deploy `index.html`, `assets/`, and any other top-level public files directly.
- Runtime logs are ignored via .gitignore and should not be committed.
