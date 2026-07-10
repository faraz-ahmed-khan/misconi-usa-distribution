import { REG_PRODUCT_FAMILIES } from '../../../../src/intake/constants.js';
import { ensureVaultEnv, errorResponse, jsonResponse } from '../../../../src/vault/api-helpers.js';
import { regFamilyLabel } from '../../../../src/vault/promote.js';
import { readProductsByReg } from '../../../../src/vault/store.js';

export const runtime = 'nodejs';

/**
 * GET /api/classification/{REGFamily}
 * Accepts REG-01 style codes or family slug keys.
 */
export async function GET(_request, { params }) {
  ensureVaultEnv();
  const regFamily = decodeURIComponent((await params).regFamily || '').toUpperCase();

  if (!regFamily) {
    return errorResponse('REG family is required', 400);
  }

  let regCode = regFamily;
  if (!REG_PRODUCT_FAMILIES[regCode]) {
    const match = Object.entries(REG_PRODUCT_FAMILIES).find(
      ([, label]) => label.toUpperCase() === regFamily || label.toUpperCase().replace(/\s+/g, '-') === regFamily
    );
    if (match) regCode = match[0];
  }

  if (!REG_PRODUCT_FAMILIES[regCode]) {
    return errorResponse(`Unknown REG family ${regFamily}`, 404);
  }

  const products = readProductsByReg(regCode);

  return jsonResponse({
    regCode,
    family: regFamilyLabel(regCode),
    count: products.length,
    classifications: products.map((product) => ({
      ubid: product.ubid,
      sku: product.sku,
      msiId: product.msiId,
      productCode: product.productCode,
      variantCode: product.variantCode,
      ...product.classification,
    })),
  });
}
