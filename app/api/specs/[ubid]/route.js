import { ensureVaultEnv, errorResponse, jsonResponse } from '../../../../src/vault/api-helpers.js';
import { readProduct } from '../../../../src/vault/store.js';

export const runtime = 'nodejs';

/**
 * GET /api/specs/{UBID}
 */
export async function GET(_request, { params }) {
  ensureVaultEnv();
  const ubid = decodeURIComponent((await params).ubid || '');

  if (!ubid) {
    return errorResponse('UBID is required', 400);
  }

  const product = readProduct(ubid);
  if (!product) {
    return errorResponse(`Specs not found for UBID ${ubid}`, 404);
  }

  return jsonResponse({
    ubid: product.ubid,
    mpiId: product.mpiId,
    sku: product.sku,
    productCode: product.productCode,
    specs: product.specs,
  });
}
