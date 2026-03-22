# Project Conventions

## Deploy Model

`main` branch = production (Cloudflare Pages auto-deploys).
Other branches get preview URLs.
`products.json` commits from "Etsy Sync Bot" are automated — expected and normal.

## Codebase Structure

- Single-file site: all CSS and JS lives in `index.html` (no build tools, no bundler)
- Product data: `products.json` (auto-generated) + `overrides.json` (manual layer)
- Sync scripts in `sync/` use only Node built-in fetch (zero npm dependencies)
- Docs for project context and handoff go in `docs/`

## Git

- Commit messages: lowercase, imperative ("add testimonial", "update hero image")
- For bigger changes: use a branch + PR so the other collaborator can review
- For small content edits: direct push to main is fine

## Design Changes

- Design tokens are CSS custom properties at the top of the `<style>` block in `index.html`
- Product grid renders dynamically from `products.json` via vanilla JS
- Test changes by opening `index.html` in a browser locally
- The site is ~37KB with no external dependencies — keep it light

## Reference

- `docs/context.md` has the full technical deep dive (architecture, fees, alternatives)
- `docs/brief.html` is a visual overview (open in browser)
