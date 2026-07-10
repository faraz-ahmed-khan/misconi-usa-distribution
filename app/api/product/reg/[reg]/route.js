import { REG_PRODUCT_FAMILIES } from '../../../../../src/intake/constants.js';
import { ensureVaultEnv, errorResponse, jsonResponse } from '../../../../../src/vault/api-helpers.js';
import { readProductsByReg } from '../../../../../src/vault/store.js';

export const runtime = 'nodejs';

/**
 * GET /api/product/reg/{REG}
 */
export async function GET(_request, { params }) {
  ensureVaultEnv();
  const reg = decodeURIComponent((await params).reg || '').toUpperCase();

  if (!reg) {
    return errorResponse('REG code is required', 400);
  }

  const normalized = reg.startsWith('REG-') ? reg : reg.replace(/^REG/, 'REG-');
  if (!REG_PRODUCT_FAMILIES[normalized]) {
    return errorResponse(`Unknown REG family ${reg}`, 404);
  }

  const products = readProductsByReg(normalized);

  return jsonResponse({
    regCode: normalized,
    family: REG_PRODUCT_FAMILIES[normalized],
    count: products.length,
    products,
  });
}
