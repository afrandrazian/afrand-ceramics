---
ticket: afrand-ceramics
status: completed
appetite: M
project: afrand_website
updated: 2026-03-22
files: [docs/brief.html, docs/context.md, docs/etsy-api-application.md, CLAUDE.md]
---

# Afrand Ceramics — Shop Owner Handoff Package

## Context

Afrand Ceramics (`afrandceramics.etsy.com`) is a handmade ceramics shop. We're building a personal website with bidirectional inventory sync. First Etsy API application was declined (empty description). This plan creates a handoff package for the shop owner so she can:

1. Understand the full project and approach decisions
2. Use her own Claude Code to ask questions and explore alternatives
3. Submit a strong Etsy API re-application
4. Collaborate via a shared GitHub repo

This is pro bono work for a friend. No secrets, full transparency.

---

## Deliverables

### 1. GitHub Repo (`mark-c4r/afrand-ceramics`, private)
- Push existing code from `~/Coding/afrand_website/`
- Add `docs/` directory with handoff materials
- Add shop owner as collaborator (once she creates GitHub account)
- **Do NOT enable GitHub Pages** — GitHub Pages prohibits e-commerce (see Assumptions below)

### 2. `docs/brief.html` — Visual Handout (for the human)
Single-page HTML, styled with the Afrand design tokens (warm, earthy, clean). Sections:

**a. What We're Building & Why**
- Diagram: Etsy Shop ↔ API ↔ Your Website ↔ Stripe
- Benefits: brand ownership, lower fees, customer emails, two storefronts same inventory

**b. How the Pieces Fit Together** (5-dimension comparison)

| Dimension | With API + Own Site | Etsy Only | Manual/Separate |
|-----------|-------------------|-----------|-----------------|
| **Inventory** | Auto-sync both ways | Single source | Double the work |
| **Checkout** | Etsy + Stripe (2 channels) | Etsy only (~10% fees) | Same, but mismatch risk |
| **Shipping** | Pirateship/manual (same either way) | Same | Same |
| **Marketing** | 2 funnels, same inventory | 1 funnel (Etsy search only) | 2 funnels, split inventory |
| **Retention** | Own email list, direct relationship | Etsy owns the customer | Same potential, harder to maintain |

**c. Why Not Shopify / Squarespace / WooCommerce?** (sidebar, not the focus)
Quick comparison table showing monthly costs and trade-offs. Our custom approach is $0-12/mo vs $38-62/mo for the alternatives. Details in the markdown file.

**d. What Happened With the API Application** (and what we're doing differently)
- Previous attempt: description left empty → auto-declined
- New approach: detailed 480-char description, addresses all known rejection triggers
- Estimated approval time: ~20 days

**e. What You Need To Do** (checklist)
1. Create a GitHub account → accept collaborator invite
2. Review this brief + discuss with your Claude Code
3. Submit the Etsy API application (exact form values provided)
4. Wait for approval (~20 days)

**f. Open Decisions** (things that need the shop owner's input)
- Domain: buy `afrandceramics.com` now or later?
- Hosting: Cloudflare Pages vs Netlify (both free, see context.md for details)
- Timeline: when to aim for launch?

### 3. `docs/context.md` — Technical Context (for her Claude Code)
Comprehensive markdown with:

**a. Architecture**
- Static HTML site (already built: `afrand.html`)
- Product data from Etsy API → `products.json` → site renders dynamically
- Checkout: Etsy for Etsy-sourced items, Stripe Payment Links for direct purchases
- Sync: scheduled script (hourly or triggered)

**b. Full Platform Comparison** (Shopify, WooCommerce, Squarespace, our approach)

| Approach | Monthly Cost | Etsy Sync Cost | Total | Technical Complexity | Best For |
|----------|-------------|---------------|-------|---------------------|----------|
| **Our approach** (static + API) | $0-12 | $0 (we build it) | **$0-12/mo** | Low for owner | Has developer help |
| Shopify Basic + CedCommerce | $29 + $9-29 | included | **$38-58/mo** | Low | Self-service, no developer |
| Squarespace Core + Trunk | $23 + $35-39 | included | **$58-62/mo** | Low | Beautiful templates |
| WooCommerce + CedCommerce | $15-25 + $15 | included | **$31-46/mo** | High | Technical users |
| Etsy only | $0 base | N/A | **~10-12% per sale** | Zero | Status quo |

For each: detailed pros/cons, what you get, what you lose, fee breakdowns, breakeven math.

**c. Etsy Fee Breakdown**
- Listing: $0.20 per listing (renews every 4 months)
- Transaction: 6.5% of sale price + shipping
- Payment processing: 3% + $0.25
- Offsite ads: 12-15% (mandatory if >$10k/yr)
- **Effective total: ~10-12% per sale** (up to 25%+ with offsite ads)

**d. Etsy API Application — Exact Form Values**
- Name, description (480 chars), checkboxes, URL, strategy notes
- All the research on rejection patterns and how our application addresses each

**e. Assumptions & Uncertainties**

| Assumption | Status | If Wrong... |
|-----------|--------|-------------|
| GitHub Pages for hosting | ❌ **INVALID** — prohibits e-commerce | Use Cloudflare Pages or Netlify (both free) |
| Pipedream free tier for sync automation | ⚠️ **RISKY** — only 100 credits/mo, hourly sync needs ~720 | Use GitHub Actions cron (free) or Cloudflare Workers |
| Stripe Payment Links | ✅ Valid — 2.9% + $0.30, no monthly fee | — |
| Etsy API approval | ⚠️ **UNCERTAIN** — first attempt declined | Reapply with strong description; if denied again, email developer@etsy.com |
| Static HTML is sufficient | ✅ Valid — site is polished, responsive, 37KB | — |
| Shop owner can maintain with Claude Code | ✅ Likely — Claude can guide through all steps | If struggle, consider Squarespace as fallback |

**f. Decision Points for the Shop Owner**
- If API is never approved: switch to Shopify ($38/mo) or manual sync?
- If developer friend becomes unavailable: migrate to Squarespace ($23/mo)?
- At what volume does upgrading make sense?

**g. Source Links**
All research sources from community forums, GitHub discussions, official docs, pricing pages.

### 4. `docs/etsy-api-application.md` — Ready-to-Submit Form Values
The exact text for each field, ready to copy-paste into the Etsy developer portal.

---

## Implementation Steps

### Step 1: Create GitHub repo and push code
- `gh repo create mark-c4r/afrand-ceramics --private`
- Copy relevant files from `~/Coding/afrand_website/` (HTML, images, sync scripts, products.json)
- Reorganize: `index.html` at root, `docs/` for handoff materials
- Do NOT include `.env` or any secrets

### Step 2: Write `docs/brief.html`
- Single-page HTML with Afrand design tokens
- Sections as outlined above
- Diagrams using simple CSS (no external dependencies)
- Responsive, works on phone
- ~2-3 screen heights of content

### Step 3: Write `docs/context.md`
- Full technical context as outlined above
- Include all research from agents (Shopify, WooCommerce, Squarespace comparisons)
- Include fee breakdowns, breakeven math
- Include assumptions table with uncertainty flags
- Include all source links

### Step 4: Write `docs/etsy-api-application.md`
- Exact form field values
- Strategy notes (what to avoid, what to emphasize)
- What to do if rejected again

### Step 5: Determine hosting strategy
- Since GitHub Pages prohibits e-commerce, recommend **Cloudflare Pages** (free, supports custom domain, no e-commerce restriction)
- Or **Netlify** as alternative
- Update architecture docs accordingly

### Step 6: Invite shop owner as collaborator
- She creates GitHub account
- `gh api repos/mark-c4r/afrand-ceramics/collaborators/THEIR_USERNAME -X PUT`
- She gets email invite → accepts → can see everything

---

## Verification

- [ ] Repo exists and is private with all code pushed
- [ ] `docs/brief.html` opens in browser and is readable, visual, responsive
- [ ] `docs/context.md` is comprehensive enough for Claude Code to answer follow-up questions
- [ ] `docs/etsy-api-application.md` has the exact 480-char description and all form values
- [ ] No `.env` or secrets in the repo
- [ ] Assumptions table flags GitHub Pages issue and Pipedream limitation

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `docs/brief.html` | Create | Visual handout for shop owner |
| `docs/context.md` | Create | Technical context for Claude Code |
| `docs/etsy-api-application.md` | Create | Ready-to-submit API form values |
| `index.html` | Rename from `afrand.html` | Main site file |
| `.gitignore` | Update | Ensure .env excluded |

## Existing Files to Preserve
- `sync/etsy-client.js`, `sync/index.js`, `sync/transform.js` — already built sync scripts
- `products.json` — product data structure
- `CLAUDE.md` — project instructions (update with new hosting decision)
- Images: `cup.webp`, `plate.webp`, `afrand_banner.webp`, etc.
