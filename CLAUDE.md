# Afrand Ceramics Project

## Files
- `index.html` — main site (single HTML file, no build tools; renamed from afrand.html)
- `afrand-plan.html` — 1-page business owner handoff document (legacy)
- `products.json` — product data (synced from Etsy API)
- `overrides.json` — manual product customizations
- `screenshot.js` — Puppeteer script for screenshots; run with `node screenshot.js`

### Sync Scripts (`sync/`)
- `etsy-client.js` — OAuth 2.0 client with automatic token refresh
- `index.js` — Sync orchestrator: fetches listings, transforms, writes products.json
- `transform.js` — Converts Etsy API response to simplified product schema

### Setup (`setup/`)
- `oauth-setup.js` — One-time OAuth PKCE flow for Etsy API authorization

### Docs (`docs/`)
- `brief.html` — Visual project overview for shop owner (human-readable)
- `context.md` — Technical context for shop owner's Claude Code
- `etsy-api-application.md` — Ready-to-submit Etsy API form values

### GitHub Actions (`.github/workflows/`)
- `sync-etsy.yml` — Automated sync every 30 minutes + secret rotation

## Design Tokens
- Background gradient; `--pampas: #f1ede8`, `--wood: #f4f0e9`, clay accent `#b07a55`
- Text: `#2d2318`, muted: `#6b5c4e`, faint: `#9e9087`
- Product grids: 4-col → 2-col at 1024px → 1-col at 600px

## Architecture
- **Hosting**: Cloudflare Pages (free tier) — GitHub Pages prohibited for e-commerce
- **Domain**: afrandceramics.com via Cloudflare Registrar (at-cost pricing)
- **Payments**: Stripe Payment Links (owner creates per-piece; 2.9% + $0.30)
- **Inventory sync**: Etsy ↔ site via GitHub Actions cron (every 30 min)
  - Etsy API → `products.json` in repo → site renders dynamically
  - Etsy sale → quantity updates in products.json
  - Website sale (Stripe webhook) → GitHub Actions updates Etsy listing quantity
- **Shipping**: Pirateship.com for USPS labels

### Architecture Decisions
| Decision | Date | Reason |
|----------|------|--------|
| Cloudflare Pages over GitHub Pages | 2026-03-22 | GitHub Pages [prohibits e-commerce](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) |
| GitHub Actions over Pipedream | 2026-03-22 | Pipedream free tier too limited (100 credits/mo vs ~720 needed); GitHub Actions free (2,000 min/mo) |
| Bidirectional Etsy sync | 2026-03-22 | Without it, two separate product lists = double the work + inventory mismatch risk |

## Repo
- **GitHub**: `mark-c4r/afrand-ceramics` (private)
- **Collaborator**: shop owner (once she creates GitHub account)
- **Secrets needed**: `ETSY_API_KEY`, `ETSY_REFRESH_TOKEN`, `ETSY_SHOP_ID`, `GH_PAT`

## Next Steps (do in order)
1. Owner creates GitHub account → accept collaborator invite
2. Owner submits Etsy API application (see `docs/etsy-api-application.md`)
3. Wait for API approval (~20 days)
4. Buy afrandceramics.com at Cloudflare (~$10/year)
5. Deploy site to Cloudflare Pages
6. Run OAuth setup (`setup/oauth-setup.js`) to get refresh token
7. Configure GitHub Secrets for automated sync
8. Owner creates Stripe account + Payment Links per product
9. Connect domain (Cloudflare DNS → Cloudflare Pages)

## Owner Actions Still Needed
- Create GitHub account + accept invite
- Submit Etsy API application (form values in `docs/etsy-api-application.md`)
- Buy afrandceramics.com at Cloudflare (~$10/year)
- Create Stripe account + connect bank
- Approve Etsy OAuth permissions screen
