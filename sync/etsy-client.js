/**
 * Etsy API v3 client.
 * Handles OAuth token refresh and provides methods for fetching shop data.
 * Zero npm dependencies — uses Node.js built-in fetch.
 */

const BASE_URL = 'https://api.etsy.com/v3/application';

class EtsyClient {
  constructor({ apiKey, refreshToken }) {
    // apiKey may be "keystring:sharedsecret" or just "keystring"
    this.apiKey = apiKey;
    this.clientId = apiKey.split(':')[0]; // OAuth client_id is keystring only
    this.refreshToken = refreshToken;
    this.accessToken = null;
    this.newRefreshToken = null; // Set after token refresh
  }

  /**
   * Refresh the access token using the stored refresh token.
   * IMPORTANT: Etsy refresh tokens are single-use. After refresh,
   * this.newRefreshToken contains the replacement that must be stored.
   */
  async refreshAccessToken() {
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: this.clientId,
      refresh_token: this.refreshToken,
    });

    const res = await fetch('https://api.etsy.com/v3/public/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Token refresh failed (${res.status}): ${text}`);
    }

    const data = await res.json();
    this.accessToken = data.access_token;
    this.newRefreshToken = data.refresh_token;
    return data;
  }

  /**
   * Make an authenticated GET request to the Etsy API.
   */
  async get(path, params = {}) {
    if (!this.accessToken) {
      await this.refreshAccessToken();
    }

    const url = new URL(`${BASE_URL}${path}`);
    for (const [key, val] of Object.entries(params)) {
      if (val !== undefined && val !== null) {
        url.searchParams.set(key, String(val));
      }
    }

    const res = await fetch(url.toString(), {
      headers: {
        'x-api-key': this.apiKey,
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Etsy API error (${res.status}) ${path}: ${text}`);
    }

    return res.json();
  }

  /**
   * Fetch all shop sections (categories).
   */
  async getShopSections(shopId) {
    const data = await this.get(`/shops/${shopId}/sections`);
    return data.results || [];
  }

  /**
   * Fetch listings by state with pagination.
   * state: 'active', 'sold_out', 'inactive', 'draft', 'expired'
   */
  async getListings(shopId, { state = 'active', includes = 'Images', limit = 100 } = {}) {
    const allListings = [];
    let offset = 0;

    while (true) {
      const data = await this.get(`/shops/${shopId}/listings`, {
        state,
        includes,
        limit,
        offset,
      });

      const results = data.results || [];
      allListings.push(...results);

      // Check if there are more pages
      if (results.length < limit) break;
      offset += limit;
    }

    return allListings;
  }

  /**
   * Fetch active + sold_out listings in one call.
   */
  async getAllListings(shopId) {
    const [active, soldOut] = await Promise.all([
      this.getListings(shopId, { state: 'active' }),
      this.getListings(shopId, { state: 'sold_out' }),
    ]);
    return { active, soldOut };
  }
}

module.exports = { EtsyClient };
