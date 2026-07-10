import {
  ACCESSORY_REG_CODES,
  GOWN_REG_CODES,
  REG_CODES,
  REG_PRODUCT_FAMILIES,
  UBIDS_PER_SUPPLIER,
  buildSku,
  variantsForRegCode,
} from '../constants.js';

const REGALIA_SUPPLIERS = [
  {
    msiId: '0001',
    name: 'Regalia Supplier 0001',
    allowedMaterials: ['Polyester', 'Matte Polyester', 'Recycled PET'],
    capabilities: ['Gown manufacturing', 'Accessory assembly', 'Bulk packaging'],
  },
  {
    msiId: '0002',
    name: 'Regalia Supplier 0002',
    allowedMaterials: ['Polyester', 'Satin', 'Matte Polyester'],
    capabilities: ['Gown manufacturing', 'Hood lining', 'Custom embroidery'],
  },
  {
    msiId: '0003',
    name: 'Regalia Supplier 0003',
    allowedMaterials: ['Polyester', 'Matte Polyester', 'Velvet'],
    capabilities: ['Gown manufacturing', 'Accessory assembly', 'International shipping'],
  },
];

/**
 * Build MSI governance records for all Regalia suppliers.
 * @returns {import('../types.js').MsiSupplier[]}
 */
export function buildSeedMsiSuppliers() {
  return REGALIA_SUPPLIERS.map((supplier) => ({
    msiId: supplier.msiId,
    name: supplier.name,
    allowedRegCodes: [...REG_CODES],
    allowedMaterials: supplier.allowedMaterials,
    variantLadderRules: Object.fromEntries(REG_CODES.map((code) => [code, [...variantsForRegCode(code)]])),
    skuPattern: 'MIS-{MSI_ID}-REG-{XX}-{VariantCode}',
    ubidCount: UBIDS_PER_SUPPLIER,
    capabilities: supplier.capabilities,
    status: 'ACTIVE',
  }));
}

/**
 * Build complete MPI packs for a supplier (40 rows across all REG families).
 * @param {string} msiId
 * @returns {{ pack1: import('../types.js').MpiPack1Row[], pack2: import('../types.js').MpiPack2Row[], pack3: import('../types.js').MpiPack3Row[] }}
 */
export function buildSeedMpiPacksForSupplier(msiId) {
  /** @type {import('../types.js').MpiPack1Row[]} */
  const pack1 = [];
  /** @type {import('../types.js').MpiPack2Row[]} */
  const pack2 = [];
  /** @type {import('../types.js').MpiPack3Row[]} */
  const pack3 = [];

  let ubidSeq = 1;

  for (const regCode of REG_CODES) {
    const variants = variantsForRegCode(regCode);
    const family = REG_PRODUCT_FAMILIES[regCode];
    const isGown = GOWN_REG_CODES.includes(regCode);
    const isAccessory = ACCESSORY_REG_CODES.includes(regCode);

    for (const variantCode of variants) {
      const ubid = formatUbid(msiId, ubidSeq);
      const mpiId = `MPI-${msiId}-${String(ubidSeq).padStart(3, '0')}`;
      const sku = buildSku(msiId, regCode, variantCode);

      pack1.push({
        mpiId,
        ubid,
        msiId,
        productCode: regCode,
        sku,
        variantCode,
        variantLabel: variantCode,
      });

      pack2.push({
        mpiId,
        ubid,
        categoryGroup: 'Regalia',
        category: isGown ? 'Academic Gowns' : 'Academic Accessories',
        subcategory: family,
        industryClassification: 'Educational Regalia',
        tags: [regCode, family, variantCode].join(';'),
      });

      pack3.push({
        mpiId,
        ubid,
        materials: isGown ? 'Matte Polyester' : 'Polyester',
        dimensions: isGown ? 'Standard academic sizing' : 'One size',
        weight: isAccessory ? '0.15 kg' : '0.85 kg',
        packaging: 'Individually bagged, carton packed',
        technicalSpecs: `REG family ${regCode}; variant ${variantCode}`,
      });

      ubidSeq += 1;
    }
  }

  return { pack1, pack2, pack3 };
}

/** @param {string} msiId @param {number} seq */
function formatUbid(msiId, seq) {
  return `UBID-${msiId}-${String(seq).padStart(3, '0')}`;
}

/**
 * Full seed dataset for intake validation.
 */
export function buildSeedIntakeDataset() {
  const msiSuppliers = buildSeedMsiSuppliers();
  const mpiBySupplier = Object.fromEntries(
    msiSuppliers.map((s) => [s.msiId, buildSeedMpiPacksForSupplier(s.msiId)])
  );

  return { msiSuppliers, mpiBySupplier };
}
