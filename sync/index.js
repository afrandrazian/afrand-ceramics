#!/usr/bin/env node

/**
 * Etsy → products.json sync orchestrator.
 *
 * Reads Etsy API credentials from environment variables,
 * fetches shop data, transforms it, and writes products.json.
 *
 * Usage:
 *   ETSY_API_KEY=... ETSY_REFRESH_TOKEN=... ETSY_SHOP_ID=... node sync/index.js
 *
 * Outputs (GitHub Actions):
 *   - products.json written to repo root
 *   - If refresh token rotated: sets `new_refresh_token` output for secret update
 */

const fs = require('fs');
const path = require('path');
const { EtsyClient } = require('./etsy-client');
const { buildProductsJson } = require('./transform');

const PRODUCTS_PATH = path.join(__dirname, '..', 'products.json');

async function main() {
  const apiKey = process.env.ETSY_API_KEY;
  const refreshToken = process.env.ETSY_REFRESH_TOKEN;
  const shopId = process.env.ETSY_SHOP_ID;

  if (!apiKey || !refreshToken || !shopId) {
    console.error('Missing required environment variables:');
    if (!apiKey) console.error('  ETSY_API_KEY');
    if (!refreshToken) console.error('  ETSY_REFRESH_TOKEN');
    if (!shopId) console.error('  ETSY_SHOP_ID');
    process.exit(1);
  }

  const client = new EtsyClient({ apiKey, refreshToken });

  console.log('Fetching shop data from Etsy...');

  const [sections, { active, soldOut }] = await Promise.all([
    client.getShopSections(shopId),
    client.getAllListings(shopId),
  ]);

  console.log(`  Sections: ${sections.length}`);
  console.log(`  Active listings: ${active.length}`);
  console.log(`  Sold listings: ${soldOut.length}`);

  const productsJson = buildProductsJson({
    sections,
    activeListings: active,
    soldListings: soldOut,
    shopId,
  });

  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(productsJson, null, 2) + '\n');
  console.log(`Written to ${PRODUCTS_PATH}`);

  // If the refresh token rotated, output it for GitHub Actions to update the secret
  if (client.newRefreshToken && client.newRefreshToken !== refreshToken) {
    console.log('Refresh token rotated — outputting for secret update.');
    // GitHub Actions output
    const outputFile = process.env.GITHUB_OUTPUT;
    if (outputFile) {
      fs.appendFileSync(outputFile, `new_refresh_token=${client.newRefreshToken}\n`);
    } else {
      // Local run — just log it
      console.log(`New refresh token: ${client.newRefreshToken}`);
    }
  }

  console.log('Sync complete.');
}

main().catch(err => {
  console.error('Sync failed:', err.message);
  process.exit(1);
});
