/**
 * Transform raw Etsy API data into the products.json schema.
 */

/**
 * Transform a raw Etsy listing into our simplified format.
 */
function transformListing(listing) {
  // Etsy returns price as { amount, divisor, currency_code }
  const price = listing.price
    ? listing.price.amount / listing.price.divisor
    : 0;

  // Extract image URLs from the includes
  const images = (listing.images || []).map(img => ({
    full: img.url_fullxfull || '',
    thumb: img.url_570xN || img.url_170x135 || '',
  }));

  return {
    id: listing.listing_id,
    title: listing.title || '',
    description: listing.description || '',
    price,
    currency: listing.price?.currency_code || 'USD',
    state: listing.state || 'active',
    quantity: listing.quantity || 0,
    section_id: listing.shop_section_id || null,
    etsy_url: listing.url || '',
    images,
    tags: listing.tags || [],
    created_at: listing.original_creation_timestamp
      ? new Date(listing.original_creation_timestamp * 1000).toISOString().split('T')[0]
      : null,
    updated_at: listing.last_modified_timestamp
      ? new Date(listing.last_modified_timestamp * 1000).toISOString().split('T')[0]
      : null,
  };
}

/**
 * Transform shop sections into our simplified format.
 */
function transformSections(sections) {
  return sections
    .map((s, i) => ({
      id: s.shop_section_id,
      name: s.title,
      sort_order: s.rank || i + 1,
    }))
    .sort((a, b) => a.sort_order - b.sort_order);
}

/**
 * Build the complete products.json structure.
 */
function buildProductsJson({ sections, activeListings, soldListings, shopId }) {
  const transformedSections = transformSections(sections);

  const listings = [
    ...activeListings.map(transformListing),
    ...soldListings.map(transformListing),
  ];

  return {
    synced_at: new Date().toISOString(),
    shop_id: shopId,
    sections: transformedSections,
    listings,
  };
}

module.exports = { transformListing, transformSections, buildProductsJson };
