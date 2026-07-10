import { ensureVaultEnv, errorResponse, jsonResponse } from '../../../../src/vault/api-helpers.js';
import { readSupplier, readSupplierProducts } from '../../../../src/vault/store.js';

export const runtime = 'nodejs';

/**
 * GET /api/supplier/{SupplierID}
 */
export async function GET(_request, { params }) {
  ensureVaultEnv();
  const supplierId = decodeURIComponent((await params).supplierId || '');

  if (!supplierId) {
    return errorResponse('Supplier ID is required', 400);
  }

  const supplier = readSupplier(supplierId.padStart(4, '0'));
  if (!supplier) {
    return errorResponse(`Supplier not found for ID ${supplierId}`, 404);
  }

  const products = readSupplierProducts(supplier.msiId);

  return jsonResponse({
    supplier,
    productCount: products.length,
    products,
  });
}
