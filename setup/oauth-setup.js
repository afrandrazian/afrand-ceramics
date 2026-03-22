#!/usr/bin/env node

/**
 * One-time OAuth 2.0 setup for Etsy API v3.
 *
 * Usage:
 *   ETSY_API_KEY=your_keystring node setup/oauth-setup.js
 *
 * This script:
 *   1. Generates PKCE code verifier + challenge
 *   2. Opens browser to Etsy authorization URL
 *   3. Captures the callback with authorization code
 *   4. Exchanges code for access + refresh tokens
 *   5. Prints tokens for you to store as GitHub Secrets
 */

const http = require('http');
const crypto = require('crypto');
const { execSync } = require('child_process');
const url = require('url');

const API_KEY = process.env.ETSY_API_KEY;
const REDIRECT_URI = 'http://localhost:3003/callback';
const SCOPES = 'listings_r shops_r';
const PORT = 3003;

if (!API_KEY) {
  console.error('Error: Set ETSY_API_KEY environment variable first.');
  console.error('  export ETSY_API_KEY=your_etsy_api_keystring');
  process.exit(1);
}

// PKCE helpers
function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url');
}

function generateCodeChallenge(verifier) {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}

const codeVerifier = generateCodeVerifier();
const codeChallenge = generateCodeChallenge(codeVerifier);
const state = crypto.randomBytes(16).toString('hex');

const authUrl = new URL('https://www.etsy.com/oauth/connect');
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
authUrl.searchParams.set('scope', SCOPES);
authUrl.searchParams.set('client_id', API_KEY);
authUrl.searchParams.set('state', state);
authUrl.searchParams.set('code_challenge', codeChallenge);
authUrl.searchParams.set('code_challenge_method', 'S256');

async function exchangeCodeForTokens(authCode) {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: API_KEY,
    redirect_uri: REDIRECT_URI,
    code: authCode,
    code_verifier: codeVerifier,
  });

  const res = await fetch('https://api.etsy.com/v3/public/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed (${res.status}): ${text}`);
  }

  return res.json();
}

// Start local server to capture the OAuth callback
const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);

  if (parsed.pathname !== '/callback') {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const { code, state: returnedState, error } = parsed.query;

  if (error) {
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.end(`<h2>Authorization denied</h2><p>${error}</p>`);
    server.close();
    process.exit(1);
  }

  if (returnedState !== state) {
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.end('<h2>State mismatch — possible CSRF attack</h2>');
    server.close();
    process.exit(1);
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h2>Authorization successful!</h2><p>You can close this tab. Check your terminal for the tokens.</p>');

  try {
    console.log('\nExchanging authorization code for tokens...');
    const tokens = await exchangeCodeForTokens(code);

    console.log('\n=== SUCCESS ===\n');
    console.log('Store these as GitHub Secrets:\n');
    console.log(`  ETSY_REFRESH_TOKEN = ${tokens.refresh_token}`);
    console.log(`  ETSY_SHOP_ID       = (find your shop ID below)\n`);
    console.log(`Access token (expires in ${tokens.expires_in}s):`);
    console.log(`  ${tokens.access_token}\n`);

    // Extract user ID from access token (format: "userId.token")
    const userId = tokens.access_token.split('.')[0];
    console.log(`Your Etsy user ID: ${userId}`);
    console.log('To find your shop ID, run:');
    console.log(`  curl -H "x-api-key: ${API_KEY}" -H "Authorization: Bearer ${tokens.access_token}" https://api.etsy.com/v3/application/users/${userId}/shops\n`);
  } catch (err) {
    console.error('Token exchange failed:', err.message);
  }

  server.close();
});

server.listen(PORT, () => {
  console.log(`\nEtsy OAuth Setup`);
  console.log(`================\n`);
  console.log(`1. Opening browser for authorization...`);
  console.log(`2. Authorize the app in your browser.`);
  console.log(`3. You'll be redirected back here.\n`);
  console.log(`Auth URL: ${authUrl.toString()}\n`);

  // Open browser (macOS)
  try {
    execSync(`open "${authUrl.toString()}"`);
  } catch {
    console.log('Could not open browser automatically. Open the URL above manually.');
  }
});
