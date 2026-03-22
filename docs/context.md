# Afrand Ceramics — Technical Context

*This document is for your Claude Code to reference when you have questions about the project.*

## Project Overview

Afrand Ceramics is a handmade ceramics shop currently selling on Etsy (afrandceramics.etsy.com). We're building a personal website that:
- Displays the same products as the Etsy shop (auto-synced via API)
- Accepts direct payments via Stripe (lower fees than Etsy)
- Gives the owner control over branding, email collection, and customer relationships
- Keeps inventory in sync across both platforms

## Architecture

```
┌──────────────┐     Etsy Open API v3      ┌──────────────────┐
│  Etsy Shop   │ <─────────────────────── │  Sync Scripts    │
│  (listings)  │ ───────────────────────> │  (Node.js)       │
└──────────────┘    read listings /        └────────┬─────────┘
                    update quantity                  │
                                                    │ writes
                                                    ▼
┌──────────────┐     serves static        ┌──────────────────┐
│  Visitor's   │ <─────────────────────── │  Website         │
│  Browser     │                          │  (static HTML)   │
└──────┬───────┘                          │  + products.json │
       │                                  └──────────────────┘
       │ clicks "Buy"
       ▼
┌──────────────┐                          ┌──────────────────┐
│  Stripe      │ ──── webhook ──────────> │  GitHub Actions  │
│  Checkout    │                          │  (update Etsy    │
└──────────────┘                          │   listing qty)   │
                                          └──────────────────┘
```

### Key Components

1. **Website** (`afrand.html`): Single-file static site (1,165 lines, ~37KB). All CSS is inline. Loads `products.json` on page load, renders product grid dynamically using vanilla JS. Product cards are grouped by Etsy shop sections (Cups, Planters, Bowls, Vases, Platters, Haft Seen) with a "Past Work" section for sold-out items. Includes a lightbox for image zoom and responsive nav. Hosted on Cloudflare Pages (or Netlify) — **not GitHub Pages** (GitHub Pages explicitly prohibits e-commerce).

2. **Sync Scripts** (`sync/` directory):
   - `etsy-client.js` — OAuth 2.0 client with automatic token refresh. Zero npm dependencies (uses Node built-in fetch). Handles pagination for shops with many listings. Etsy refresh tokens are single-use, so the client tracks the new refresh token after each rotation.
   - `index.js` — Orchestrator: fetches listings + sections in parallel, transforms them, writes `products.json`. Outputs the new refresh token via `GITHUB_OUTPUT` for the Actions workflow to update the secret automatically.
   - `transform.js` — Converts Etsy API response to the simplified product schema. Handles Etsy's price format (`{ amount, divisor, currency_code }`), image URL extraction, and timestamp conversion.

3. **GitHub Actions** (`.github/workflows/sync-etsy.yml`): Runs sync every 30 minutes. Three steps: (1) run sync script, (2) update the `ETSY_REFRESH_TOKEN` secret if it rotated (requires a `GH_PAT` secret with `repo` and `secrets` scope), (3) commit and push the updated `products.json`. The commit is authored by "Etsy Sync Bot".

4. **Stripe Payment Links**: Owner creates a payment link per product. When payment succeeds, a webhook notifies our system to decrement Etsy listing quantity. (This webhook handler is not yet built — it's a future task.)

5. **products.json**: The data bridge between Etsy and the website. Schema:
   - Top level: `synced_at`, `shop_id`, `sections[]`, `listings[]`
   - Each section: `id`, `name`, `sort_order`
   - Each listing: `id`, `title`, `description`, `price`, `currency`, `state`, `quantity`, `section_id`, `etsy_url`, `images[]` (with `full` and `thumb` URLs), `tags[]`, `created_at`, `updated_at`

6. **overrides.json**: Manual product customizations. Currently empty (`{}`). The website rendering code merges overrides by listing ID — supports `hide: true` to suppress a listing from the website without affecting Etsy.

7. **OAuth Setup** (`setup/oauth-setup.js`): One-time PKCE OAuth flow. Starts a local HTTP server on port 3003 to capture the callback. Opens the browser to Etsy's auth URL, exchanges the code for tokens, and prints the refresh token + instructions for finding the shop ID. **Currently requests read-only scopes** (`listings_r shops_r`) — `listings_w` will need to be added when the inventory write-back feature is built.

## Platform Comparison (Why This Approach)

### Our Custom Approach: $0-12/month
**What you get:**
- Full brand control (your domain, your design, your email list)
- Lowest possible fees (Stripe: 2.9% + $0.30 vs Etsy: ~10-12% per sale)
- Two storefronts sharing one inventory pool
- No monthly subscription fees
- Complete ownership of the code and data

**What you trade off:**
- Needs a developer to set up initially
- Ongoing maintenance requires some technical comfort (or Claude Code help)
- No built-in cart/checkout (uses Stripe Payment Links — one link per product)

**Monthly costs:**
- Hosting: $0 (Cloudflare Pages or Netlify free tier)
- Domain: ~$10-12/year ($0.83-1/month)
- Stripe: 2.9% + $0.30 per transaction (only when you sell)
- Etsy API: free
- GitHub Actions: free (2,000 minutes/month included)

### Shopify Basic + CedCommerce Etsy Integration: $38-58/month

**Shopify Basic:** $29/month (or $25/month if paid annually)
- Built-in online store, checkout, payment processing
- Shopify Payments: 2.9% + $0.30 (or 2.6% + $0.30 on annual plan)
- 100+ free themes, drag-and-drop builder
- Inventory management, order management, shipping labels
- Email marketing tools (Shopify Email: 10k free/month)

**CedCommerce Etsy Integration:** $9-29/month
- Free plan: 25 products, basic sync
- $9/month plan: 100 products, better sync
- $29/month plan: unlimited products, advanced features
- Real-time inventory sync between Shopify and Etsy
- Bulk listing management

**Total: $38-58/month**

**Pros:**
- Self-service — no developer needed
- Professional checkout with cart, discounts, gift cards
- Built-in analytics and marketing tools
- Large app ecosystem for any feature you might need
- Easy to manage once set up

**Cons:**
- Monthly cost adds up ($456-696/year)
- You're on Shopify's platform (another middleman, though less controlling than Etsy)
- Transaction fees on top of Shopify Payments if using external gateway
- CedCommerce sync can be buggy (community reports occasional desyncs)
- Still paying Etsy's fees on Etsy sales

**Best for:** Sellers who want full-featured e-commerce without developer help and are OK with $40-60/month.

### Squarespace Business/Commerce + Trunk Integration: $58-62/month

**Squarespace Business:** $23/month (annual) or Commerce Basic: $28/month
- Beautiful design templates (their main selling point)
- Built-in e-commerce, blogging, analytics
- 3% transaction fee on Business plan (0% on Commerce)
- Limited product variants (100 per product)
- Custom CSS/JavaScript access

**Trunk (Etsy sync):** $35-39/month
- Syncs inventory between Squarespace and Etsy
- Supports multi-channel (Amazon, eBay, Shopify too)
- $35/month base, $39/month for advanced features
- Limited to listing sync and inventory updates

**Total: $58-62/month**

**Pros:**
- Most beautiful templates out of the box
- All-in-one platform (website + store + blog)
- Good SEO tools built in
- Professional appearance with minimal effort

**Cons:**
- Most expensive option ($696-744/year)
- Trunk integration is expensive and sometimes unreliable
- Limited customization compared to Shopify
- 3% transaction fee unless you upgrade to Commerce plan
- Fewer apps/integrations than Shopify

**Best for:** Sellers who prioritize visual design and want an all-in-one platform.

### WooCommerce + CedCommerce: $31-46/month

**WordPress Hosting:** $15-25/month (e.g., SiteGround, Bluehost)
- Self-hosted WordPress with WooCommerce plugin (free)
- Full control over everything (you own the server)
- Thousands of themes and plugins
- WooCommerce Payments: 2.9% + $0.30

**CedCommerce for WooCommerce:** $15/month+
- Sync WooCommerce products with Etsy
- Inventory, pricing, and order sync
- Requires some technical setup

**Total: $31-46/month**

**Pros:**
- Most flexible platform (you can build literally anything)
- Large plugin ecosystem
- You own everything (can migrate hosting anytime)
- Lower cost than Shopify/Squarespace long-term

**Cons:**
- Most technical to set up and maintain
- WordPress security updates needed regularly
- Plugin conflicts can break things
- Hosting management (backups, SSL, speed optimization)
- Not recommended without technical comfort

**Best for:** Technical users who want maximum control at moderate cost.

### Etsy Only (Status Quo): ~10-12% per sale

**Costs:**
- Listing fee: $0.20 per listing (renews every 4 months, or on sale)
- Transaction fee: 6.5% of item price + shipping
- Payment processing: 3% + $0.25 (Etsy Payments)
- Offsite ads: 12-15% if Etsy's ad leads to a sale (mandatory if >$10k/year revenue, opt-out if below)
- Effective total: **~10-12% per sale** (15-25%+ with offsite ads)

**Example:** A $50 ceramic piece:
- Listing: $0.20
- Transaction: $3.25
- Processing: $1.75
- **Total fees: $5.20 (10.4%)**
- With offsite ad: $5.20 + $7.50 = **$12.70 (25.4%)**

**Pros:**
- Zero setup, zero maintenance
- Built-in audience (millions of buyers search Etsy daily)
- Trust factor (buyers trust Etsy checkout)
- No technical skills needed

**Cons:**
- Etsy controls everything (they can change fees, algorithm, suspend shops)
- You can't collect customer emails (Etsy anonymizes them)
- No brand-building (customers remember "Etsy" not "Afrand")
- Fees eat into margins significantly
- You compete with every other ceramics seller on the platform
- No direct customer relationship

## Breakeven Analysis

At what monthly revenue does our approach save money vs alternatives?

**Assumptions:**
- Average item price: $50
- Stripe fee: 2.9% + $0.30 = ~$1.75 per sale
- Etsy fee on same item: ~$5.20 per sale
- Savings per direct sale: ~$3.45

**Break-even vs Shopify ($38/mo):** 11 direct sales/month (~$550 revenue)
**Break-even vs Squarespace ($58/mo):** 17 direct sales/month (~$850 revenue)
**Break-even vs Etsy only:** First direct sale saves money (no monthly cost)

Our approach is cheaper from day one if you sell anything directly. It becomes dramatically cheaper than platform alternatives at 10+ direct sales/month.

## Etsy API Details

### Application Status
- **First attempt:** Declined (empty description — submitted too quickly)
- **Second attempt:** Prepared with 480-character description addressing all known rejection triggers (see `docs/etsy-api-application.md` for exact copy-paste text)
- **Current status:** Pending or awaiting resubmission

### Existing API Credentials
The `.env` file contains an `ETSY_API_KEY` (keystring) and `ETSY_SHARED_SECRET`. These may be from the declined application and could be invalid. Verify at https://www.etsy.com/developers/your-apps before using.

### API Scopes Needed
- `listings_r` — Read active/sold listings (titles, prices, images, quantities)
- `listings_w` — Update listing quantity when sold on website (**not yet requested in OAuth setup** — `setup/oauth-setup.js` currently only requests `listings_r shops_r`)
- `shops_r` — Read shop sections/categories

### Known Approval Patterns (from community research)
- Applications with empty/vague descriptions are auto-declined
- Mentioning "Etsy" in app name may trigger rejection
- Third-party key requests (developers building for others) face scrutiny
- Approval takes ~20 days on average
- If rejected, email developer@etsy.com for specific feedback

### Sources
- [Etsy API Docs](https://developers.etsy.com/documentation/)
- [GitHub Discussion #675 — Application Tips](https://github.com/etsy/open-api/discussions/675)
- [GitHub Discussion #1060 — Registration Issues](https://github.com/etsy/open-api/discussions/1060)
- [Community Forum — Declining Signups](https://community.etsy.com/t5/Technical-Issues/Etsy-declining-all-new-API-v3-signups/td-p/140903273)
- [Community Forum — API Without Website](https://community.etsy.com/t5/Technical-Issues/Etsy-API-without-a-website/td-p/139703609)

## Assumptions & Uncertainties

| Assumption | Status | If Wrong... |
|-----------|--------|-------------|
| GitHub Pages for hosting | **INVALID** — [explicitly prohibits e-commerce](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) | Use Cloudflare Pages or Netlify (both free, no restriction) |
| Pipedream for sync automation | **RISKY** — free tier only 100 credits/mo, hourly sync needs ~720 | Use GitHub Actions cron (free, already configured in `.github/workflows/`) |
| Stripe Payment Links | **Valid** — 2.9% + $0.30, no monthly fee, no minimum | -- |
| Etsy API approval | **UNCERTAIN** — first attempt declined | Strong reapplication prepared; if denied again, email developer@etsy.com |
| Static HTML is sufficient | **Valid** — site is polished, responsive, ~37KB, loads fast | -- |
| Shop owner can maintain with Claude Code | **Likely** — Claude can guide through all GitHub/hosting/Stripe steps | Fallback: migrate to Shopify ($38/mo) for self-service |
| Custom domain needed | **OPTIONAL** — can launch with free subdomain first | afrand-ceramics.pages.dev (Cloudflare) or afrandceramics.netlify.app |
| Etsy won't change API terms | **UNCERTAIN** — they've restricted API access before | If API revoked, fall back to manual product management or switch platforms |

## Decision Points for the Shop Owner

1. **If API is never approved:**
   - Option A: Use Shopify ($38/mo) — has built-in Etsy sync via CedCommerce
   - Option B: Manually maintain product list on website (labor-intensive)
   - Option C: Keep Etsy only (status quo)

2. **If developer friend becomes unavailable:**
   - Easiest migration: Shopify (most self-service-friendly)
   - The static HTML site can still work — just won't have automated sync
   - Claude Code can help maintain the site for most tasks

3. **At what volume does upgrading make sense?**
   - Under 10 direct sales/month: our approach is cheapest
   - 10-50 sales/month: our approach saves $300-600/year vs Shopify
   - 50+ sales/month: consider Shopify for better inventory management, but our approach still works

4. **Domain timing:**
   - Buy now (~$10/year): looks more professional on API application
   - Buy later: launch with free subdomain, upgrade when ready
   - Recommendation: buy now if comfortable, it strengthens the API application

## File Structure

```
afrand_website/
├── afrand.html                (the website — single-file static site, 1165 lines)
├── products.json              (product data — synced from Etsy API)
├── overrides.json             (manual product customizations, currently empty)
├── package.json               (only dependency: puppeteer for screenshots)
├── project-brief.yaml         (machine-readable project metadata)
├── CLAUDE.md                  (project instructions for Claude Code)
├── .env                       (API keys — NOT in repo, see .gitignore)
├── .gitignore                 (excludes .env, .env.local, node_modules)
├── .github/
│   └── workflows/
│       └── sync-etsy.yml      (automated sync every 30 minutes)
├── sync/
│   ├── etsy-client.js         (OAuth 2.0 client + API calls, zero npm deps)
│   ├── index.js               (sync orchestrator)
│   └── transform.js           (Etsy API response -> products.json transformer)
├── setup/
│   └── oauth-setup.js         (one-time OAuth PKCE flow setup, port 3003)
├── docs/
│   ├── brief.html             (visual overview — for the human)
│   ├── context.md             (this file — for Claude Code)
│   └── etsy-api-application.md (API form values — ready to submit)
├── images/                    (referenced in HTML)
│   ├── afrand_banner.webp
│   ├── cup.webp
│   └── plate.webp
├── afrand-plan.html           (1-page business owner handoff document)
├── screenshot.js              (Puppeteer screenshot script)
├── screenshot.py              (Python screenshot alternative)
└── [various .png files]       (reference screenshots and assets)
```

## Design Tokens (from CLAUDE.md)

The website uses these CSS custom properties:
- Background: `--pampas: #f1ede8`, `--wood: #f4f0e9`
- Clay accent: `#b07a55`
- Text: `#2d2318`, muted: `#6b5c4e`, faint: `#9e9087`
- Product grids: 4-col at desktop, 2-col at 1024px, 1-col at 600px
- Full custom property system defined at the top of `afrand.html` (spacing, typography, colors)

## Environment Variables

The sync scripts and GitHub Actions need these:

| Variable | Where | Purpose |
|----------|-------|---------|
| `ETSY_API_KEY` | `.env` / GitHub Secret | Etsy API keystring |
| `ETSY_SHARED_SECRET` | `.env` | Etsy shared secret (for local dev only) |
| `ETSY_REFRESH_TOKEN` | GitHub Secret | OAuth refresh token (rotates on each use) |
| `ETSY_SHOP_ID` | GitHub Secret | Numeric Etsy shop ID |
| `GH_PAT` | GitHub Secret | Personal access token with `repo` + `secrets` scope (for auto-updating the refresh token secret) |

## Hosting Decision: Cloudflare Pages vs Netlify

Both are excellent free options. Key differences:

| Feature | Cloudflare Pages | Netlify |
|---------|-----------------|---------|
| Free tier | Unlimited bandwidth, 500 builds/month | 100GB bandwidth, 300 build minutes/month |
| Custom domain | Yes (Cloudflare DNS integration) | Yes |
| HTTPS | Automatic | Automatic |
| Deploy from | GitHub, direct upload | GitHub, GitLab, direct upload |
| CDN | Cloudflare's global network (fastest) | Good but smaller network |
| Forms | No built-in | Built-in form handling |
| Functions | Workers (if needed later) | Serverless functions |
| Domain registrar | Cloudflare Registrar (at-cost pricing) | No registrar |

**Recommendation:** Cloudflare Pages — faster CDN, and if you buy the domain through Cloudflare Registrar, everything is in one place at the lowest domain price.

## What's Built vs What's Not

### Built and working:
- Static website with dynamic product rendering from `products.json`
- Etsy API client with OAuth token refresh
- Sync orchestrator (fetch listings + sections, transform, write JSON)
- GitHub Actions workflow for automated sync + token rotation
- OAuth PKCE setup script for initial authorization
- API application description and strategy documentation

### Not yet built:
- Stripe webhook handler to decrement Etsy quantity on website sale
- `listings_w` scope in OAuth setup (currently read-only)
- Hosting deployment (site is local only — not yet on Cloudflare Pages or Netlify)
- Custom domain setup
- Email collection / mailing list integration
- `.env.example` template file (does not exist yet)

## Research Date

All pricing, platform features, and API documentation was verified in **March 2026**. Platforms change pricing and features regularly. Before making major decisions based on this document, verify current pricing.
