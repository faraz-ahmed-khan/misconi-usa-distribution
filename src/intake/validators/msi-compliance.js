import {
  REG_CODES,
  REG_PRODUCT_FAMILIES,
  SKU_PATTERN,
  UBIDS_PER_SUPPLIER,
  buildSku,
  expectedMpiRowCount,
  variantsForRegCode,
} from '../constants.js';

/**
 * @param {import('../types.js').MsiSupplier} msi
 * @param {import('../types.js').MpiSupplierPacks} packs
 * @returns {import('../types.js').ValidationIssue[]}
 */
export function validateMsiCompliance(msi, packs) {
  /** @type {import('../types.js').ValidationIssue[]} */
  const issues = [];
  const { pack1, pack3 } = packs;

  for (const row of pack1) {
    if (!msi.allowedRegCodes.includes(row.productCode)) {
      issues.push({
        severity: 'error',
        code: 'MSI_REG_NOT_ALLOWED',
        message: `Product code ${row.productCode} is not allowed for supplier ${msi.msiId}`,
        msiId: msi.msiId,
        mpiId: row.mpiId,
        ubid: row.ubid,
        field: 'productCode',
      });
    }

    const expectedVariants = msi.variantLadderRules[row.productCode] || variantsForRegCode(row.productCode);
    if (!expectedVariants.includes(row.variantCode)) {
      issues.push({
        severity: 'error',
        code: 'MSI_VARIANT_LADDER',
        message: `Variant ${row.variantCode} is invalid for ${row.productCode}. Expected: ${expectedVariants.join(', ')}`,
        msiId: msi.msiId,
        mpiId: row.mpiId,
        ubid: row.ubid,
        field: 'variantCode',
      });
    }

    const expectedSku = buildSku(msi.msiId, row.productCode, row.variantCode);
    if (row.sku !== expectedSku) {
      issues.push({
        severity: 'error',
        code: 'MSI_SKU_PATTERN',
        message: `SKU ${row.sku} does not match pattern. Expected ${expectedSku}`,
        msiId: msi.msiId,
        mpiId: row.mpiId,
        ubid: row.ubid,
        field: 'sku',
      });
    } else if (!SKU_PATTERN.test(row.sku)) {
      issues.push({
        severity: 'error',
        code: 'MSI_SKU_FORMAT',
        message: `SKU ${row.sku} fails format validation`,
        msiId: msi.msiId,
        mpiId: row.mpiId,
        field: 'sku',
      });
    }
  }

  for (const row of pack3) {
    const pack1Row = pack1.find((p) => p.mpiId === row.mpiId);
    if (!pack1Row) continue;

    const materialText = String(row.materials || '');
    const isPlaceholder = /per supplier|specification/i.test(materialText);
    if (
      !isPlaceholder &&
      msi.allowedMaterials.length &&
      !msi.allowedMaterials.some((m) => materialText.includes(m))
    ) {
      issues.push({
        severity: 'error',
        code: 'MSI_MATERIAL_COMPLIANCE',
        message: `Material "${row.materials}" is not in MSI allowed materials for ${msi.msiId}`,
        msiId: msi.msiId,
        mpiId: row.mpiId,
        ubid: row.ubid,
        field: 'materials',
      });
    }
  }

  const regCounts = countByRegCode(pack1);
  for (const regCode of REG_CODES) {
    const expected = variantsForRegCode(regCode).length;
    const actual = regCounts[regCode] || 0;
    if (actual !== expected) {
      issues.push({
        severity: 'error',
        code: 'MSI_REG_ROW_COUNT',
        message: `${regCode} (${REG_PRODUCT_FAMILIES[regCode]}) has ${actual} rows, expected ${expected}`,
        msiId: msi.msiId,
        field: 'productCode',
      });
    }
  }

  if (pack1.length !== UBIDS_PER_SUPPLIER) {
    issues.push({
      severity: 'error',
      code: 'MSI_UBID_COUNT',
      message: `Supplier ${msi.msiId} has ${pack1.length} UBIDs, expected ${UBIDS_PER_SUPPLIER}`,
      msiId: msi.msiId,
      field: 'ubid',
    });
  }

  return issues;
}

/**
 * @param {import('../types.js').MpiPack1Row[]} pack1
 */
function countByRegCode(pack1) {
  /** @type {Record<string, number>} */
  const counts = {};
  for (const row of pack1) {
    counts[row.productCode] = (counts[row.productCode] || 0) + 1;
  }
  return counts;
}

export { expectedMpiRowCount };
