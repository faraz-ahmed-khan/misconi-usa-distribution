import { REG_PRODUCT_FAMILIES } from '../intake/constants.js';
import { VAULT_ENV } from './config.js';

/**
 * @param {import('../intake/types.js').MsiSupplier} msi
 * @param {import('../intake/types.js').MpiSupplierPacks} packs
 * @param {{ source: string, promotedAt: string, vaultVersion?: number }} meta
 * @returns {{ supplier: import('./types.js').VaultSupplier, products: import('./types.js').VaultProduct[] }}
 */
export function buildVaultRecordsForSupplier(msi, packs, meta) {
  const vaultVersion = meta.vaultVersion ?? 1;
  const pack2ByMpi = new Map(packs.pack2.map((row) => [row.mpiId, row]));
  const pack3ByMpi = new Map(packs.pack3.map((row) => [row.mpiId, row]));

  /** @type {import('./types.js').VaultProduct[]} */
  const products = [];

  for (const row of packs.pack1) {
    const pack2 = pack2ByMpi.get(row.mpiId);
    const pack3 = pack3ByMpi.get(row.mpiId);

    if (!pack2 || !pack3) {
      throw new Error(`Missing Pack 2/3 rows for MPI ${row.mpiId} (supplier ${msi.msiId})`);
    }

    products.push({
      ubid: row.ubid,
      mpiId: row.mpiId,
      msiId: row.msiId,
      sku: row.sku,
      productCode: row.productCode,
      variantCode: row.variantCode,
      variantLabel: row.variantLabel,
      classification: {
        mpiId: pack2.mpiId,
        ubid: pack2.ubid,
        categoryGroup: pack2.categoryGroup,
        category: pack2.category,
        subcategory: pack2.subcategory,
        industryClassification: pack2.industryClassification,
        tags: pack2.tags,
      },
      specs: {
        mpiId: pack3.mpiId,
        ubid: pack3.ubid,
        materials: pack3.materials,
        dimensions: pack3.dimensions,
        weight: pack3.weight,
        packaging: pack3.packaging,
        technicalSpecs: pack3.technicalSpecs,
      },
      vaultVersion,
      promotedAt: meta.promotedAt,
      source: meta.source,
      environment: VAULT_ENV,
    });
  }

  const supplier = {
    msiId: msi.msiId,
    name: msi.name,
    allowedRegCodes: msi.allowedRegCodes,
    allowedMaterials: msi.allowedMaterials,
    variantLadderRules: msi.variantLadderRules,
    skuPattern: msi.skuPattern,
    ubidCount: msi.ubidCount,
    capabilities: msi.capabilities,
    status: msi.status,
    productUbids: products.map((p) => p.ubid),
    vaultVersion,
    promotedAt: meta.promotedAt,
    source: meta.source,
    environment: VAULT_ENV,
  };

  return { supplier, products };
}

/**
 * @param {import('./types.js').VaultProduct[]} products
 * @returns {import('./types.js').VaultIndexes}
 */
export function buildIndexes(products) {
  /** @type {Record<string, string>} */
  const bySku = {};
  /** @type {Record<string, string>} */
  const byMpiId = {};
  /** @type {Record<string, string[]>} */
  const byReg = {};
  /** @type {Record<string, string[]>} */
  const bySupplier = {};

  for (const product of products) {
    bySku[product.sku] = product.ubid;
    byMpiId[product.mpiId] = product.ubid;

    if (!byReg[product.productCode]) byReg[product.productCode] = [];
    byReg[product.productCode].push(product.ubid);

    if (!bySupplier[product.msiId]) bySupplier[product.msiId] = [];
    bySupplier[product.msiId].push(product.ubid);
  }

  return { bySku, byMpiId, byReg, bySupplier };
}

/**
 * @param {string} regCode
 */
export function regFamilyLabel(regCode) {
  return REG_PRODUCT_FAMILIES[regCode] || regCode;
}
