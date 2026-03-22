---
ticket: afrand-ceramics
status: completed
appetite: M
project: afrand_website
updated: 2026-03-22
files: [docs/brief.html, docs/context.md, docs/etsy-api-application.md, CLAUDE.md]
---

# Afrand Ceramics — Crash Recovery Plan

## Context

Previous session completed brainstorming, research, and planning for the Afrand Ceramics handoff package. Plan was approved and execution began but the session crashed at 15% context during agent dispatch. Only `docs/etsy-api-application.md` was completed.

Resuming from the approved plan at `~/.claude/plans/enumerated-mixing-dolphin.md`.

---

## What's Already Done

- [x] Etsy API rejection research (community forums, GitHub discussions, official docs)
- [x] Platform comparison research (Shopify, WooCommerce, Squarespace)
- [x] Assumption validation (GitHub Pages e-commerce ban, Pipedream limits, Stripe fees)
- [x] `docs/etsy-api-application.md` — complete, 112 lines, ready to submit
- [x] `.gitignore` — `.env` already excluded
- [x] Sync scripts (`sync/etsy-client.js`, `sync/index.js`, `sync/transform.js`)
- [x] Frontend (`afrand.html`) — 37KB polished site with dynamic product loading
- [x] GitHub Actions workflow (`.github/workflows/sync-etsy.yml`)

## What Needs to Be Done

### Step 1: Write `docs/brief.html` 🔽
Single-page visual handout for shop owner. Afrand design tokens (warm, earthy). Sections:
- What we're building & why (architecture diagram)
- 5-dimension comparison table (inventory, checkout, shipping, marketing, retention)
- Platform alternatives sidebar (Shopify/Squarespace/WooCommerce cost comparison)
- What happened with the API application & what's different now
- Action checklist for the shop owner
- Open decisions needing her input
- File: `~/Coding/afrand_website/docs/brief.html`
- Design tokens from CLAUDE.md: `--pampas: #f1ede8`, `--wood: #f4f0e9`, clay `#b07a55`, text `#2d2318`

### Step 2: Write `docs/context.md` 🔽
Technical context for shop owner's Claude Code. Sections:
- Architecture overview (static HTML + Etsy API + Stripe + GitHub Actions)
- Full platform comparison with fee breakdowns and breakeven math
- Etsy fee breakdown (~10-12% per sale)
- Assumptions & uncertainties table (GitHub Pages ❌, Pipedream ⚠️, Stripe ✅)
- Decision points (API denial fallback, developer unavailability, scaling)
- Source links from research
- File: `~/Coding/afrand_website/docs/context.md`

### Step 3: Update CLAUDE.md 🔽
Current CLAUDE.md references stale architecture:
- "GitHub Pages" → Cloudflare Pages (or Netlify)
- "Pipedream" → GitHub Actions cron
- Add docs/ directory to file listing
- File: `~/Coding/afrand_website/CLAUDE.md`

### Step 4: Create GitHub repo & push 🔽
- `gh repo create mark-c4r/afrand-ceramics --private --source ~/Coding/afrand_website`
- Verify `.env` is NOT tracked: `git ls-files .env` should be empty
- Rename `afrand.html` → `index.html` (for hosting root)
- Push all code + docs
- Verify: `gh repo view mark-c4r/afrand-ceramics`

### Step 5: Verify 🔽
- [ ] Repo is private with all code pushed
- [ ] `docs/brief.html` opens in browser, is visual and responsive
- [ ] `docs/context.md` is comprehensive for Claude Code consumption
- [ ] `docs/etsy-api-application.md` has the 480-char description
- [ ] No `.env` or secrets in repo
- [ ] CLAUDE.md reflects updated architecture

---

## Key Files

| File | Status | Action |
|------|--------|--------|
| `docs/etsy-api-application.md` | ✅ Done | Preserve |
| `docs/brief.html` | ❌ Missing | Create (Step 1) |
| `docs/context.md` | ❌ Missing | Create (Step 2) |
| `CLAUDE.md` | ⚠️ Stale | Update (Step 3) |
| `afrand.html` → `index.html` | ⚠️ Not renamed | Rename (Step 4) |

## Execution Strategy

Steps 1-2 are independent — dispatch as parallel agents (brief.html and context.md).
Step 3 is a quick edit.
Step 4 depends on 1-3 being complete.
Step 5 is verification after push.
