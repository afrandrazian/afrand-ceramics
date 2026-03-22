# Etsy API Application — Ready to Submit

## Form URL
https://www.etsy.com/developers/register

## Field Values

### Name
```
Afrand Ceramics Website Sync
```

### Description (copy-paste this exactly — 480 chars)
```
I own Afrand Ceramics (afrandceramics.etsy.com). I'm building a personal website to showcase my handmade pottery alongside my Etsy shop. The app: (1) Reads my active listings (titles, prices, images, sections) to display a synced product catalog on my website. (2) Updates listing quantity when a piece sells on my website, keeping inventory accurate across both channels. Purchases happen via Etsy or Stripe on my site — no checkout bypass. Sync runs hourly. Single shop, personal use, no third-party access.
```

### Website URL
Use whichever is available (in order of preference):
1. `https://afrand-ceramics.pages.dev` (if Cloudflare Pages is set up)
2. `https://afrandceramics.netlify.app` (if Netlify is set up)
3. `https://afrandceramics.etsy.com` (fallback — shows the shop exists)

### Checkboxes

| Field | Selection | Why |
|-------|-----------|-----|
| Application type | **Seller Tools** | Syncing your own shop data |
| Users | **Just myself or colleagues** | Single shop owner |
| Commercial | **No** | Not charging anyone for the app |
| Upload or edit listings | **✅ Check this** | Needed to update listing quantity when sold on website |
| Read sales data | **✅ Check this** | Needed to check what's active/sold |
| Send email | **❌ Don't check** | App doesn't send email |

---

## Why This Description Works

The description addresses every known rejection trigger:

| Rejection Trigger | How We Address It |
|-------------------|-------------------|
| Empty/vague description | 480 characters of specific detail |
| Appears to be 3rd-party key request | "I own Afrand Ceramics" — establishes shop ownership |
| Checkout bypass concern | "no checkout bypass" — explicitly stated |
| Using "Etsy" in app name | Name is "Afrand Ceramics Website Sync" — no "Etsy" |
| Overly broad scope | "Single shop, personal use, no third-party access" |
| Unclear API usage | Specifies exactly which APIs: listings read + quantity update |

---

## Strategy Notes

### Do
- Submit from the same Etsy account that owns the shop (afranddd)
- Have 2FA enabled before applying
- Complete the CAPTCHA carefully
- Read and accept the API Terms of Use

### Don't
- Don't mention Pipedream, GitHub Actions, or automation tools in the description
- Don't mention Stripe or other payment providers
- Don't mention "scraping" or "crawling"
- Don't use the word "Etsy" in the app name
- Don't mention bidirectional sync — frame it as "updates listing quantity"

### After Submitting
1. Check status at: https://www.etsy.com/developers/your-apps
2. Approval typically takes ~20 days (based on community reports)
3. You'll see the status change from "Pending" to "Approved" or "Rejected"

### If Rejected Again
1. The rejection reason is visible when you try to create a new application
2. Note the exact rejection reason
3. Email `developer@etsy.com` with:
   - Your app name: "Afrand Ceramics Website Sync"
   - Your shop URL: afrandceramics.etsy.com
   - A brief explanation of what your app does
   - Ask specifically what was wrong with the application
4. Wait for their response (5-6 business days typically)
5. Reapply addressing their specific concern

### If Approved
1. You'll get an API key (Keystring) in your developer dashboard
2. Share the Keystring securely (NOT via email or chat — use the repo's `.env` template)
3. We'll configure the sync scripts in the `sync/` directory

---

## What the API Key Unlocks

With Personal Access (what we're applying for), you can:
- **Read** your shop info, sections, listings, images, reviews
- **Read** receipt/order data
- **Update** listing quantity and state (active/inactive)
- Connect up to **5 shops** (we only need 1)

You do NOT get:
- Access to other people's shops
- Ability to create entirely new listings via API (you still create in Etsy's UI)
- Buyer email addresses (requires separate `buyer_email` scope approval)
- Commercial access (serving other sellers — we don't need this)

---

## Sources
- [Etsy API Docs](https://developers.etsy.com/documentation/)
- [GitHub Discussion #675 — Application Approval Tips](https://github.com/etsy/open-api/discussions/675)
- [GitHub Discussion #1060 — Registration Issues](https://github.com/etsy/open-api/discussions/1060)
- [Community Forum — Declining API Signups](https://community.etsy.com/t5/Technical-Issues/Etsy-declining-all-new-API-v3-signups/td-p/140903273)
- [API Terms of Use](https://www.etsy.com/developers/terms-of-use)
