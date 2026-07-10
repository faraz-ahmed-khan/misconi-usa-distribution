import { ensureVaultEnv, errorResponse, jsonResponse } from '../../../../../src/vault/api-helpers.js';
import { readProductBySku } from '../../../../../src/vault/store.js';

export const runtime = 'nodejs';

/**
 * GET /api/product/sku/{SKU}
 */
export async function GET(_request, { params }) {
  ensureVaultEnv();
  const sku = decodeURIComponent((await params).sku || '');

  if (!sku) {
    return errorResponse('SKU is required', 400);
  }

  const product = readProductBySku(sku);
  if (!product) {
    return errorResponse(`Product not found for SKU ${sku}`, 404);
  }

  return jsonResponse({ product });
}
