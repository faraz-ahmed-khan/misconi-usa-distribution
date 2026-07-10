import { UBIDS_PER_SUPPLIER } from '../constants.js';

/**
 * Identity validation: UBID uniqueness, continuity, SKU uniqueness, REG/variant alignment.
 * @param {string} msiId
 * @param {import('../types.js').MpiSupplierPacks} packs
 * @returns {import('../types.js').ValidationIssue[]}
 */
export function validateIdentity(msiId, packs) {
  /** @type {import('../types.js').ValidationIssue[]} */
  const issues = [];
  const { pack1 } = packs;

  const ubids = pack1.map((r) => r.ubid);
  const skus = pack1.map((r) => r.sku);
  const mpiIds = pack1.map((r) => r.mpiId);

  issues.push(...findDuplicates(msiId, ubids, 'IDENTITY_DUPLICATE_UBID', 'ubid'));
  issues.push(...findDuplicates(msiId, skus, 'IDENTITY_DUPLICATE_SKU', 'sku'));
  issues.push(...findDuplicates(msiId, mpiIds, 'IDENTITY_DUPLICATE_MPI', 'mpiId'));

  const ubidNumbers = ubids
    .map((ubid) => Number(String(ubid).replace(/\D/g, '')))
    .filter((n) => !Number.isNaN(n) && n > 0)
    .sort((a, b) => a - b);

  if (ubidNumbers.length >= 2) {
    for (let i = 1; i < ubidNumbers.length; i += 1) {
      if (ubidNumbers[i] !== ubidNumbers[i - 1] + 1) {
        issues.push({
          severity: 'error',
          code: 'IDENTITY_UBID_CONTINUITY',
          message: `UBID sequence break between ${ubidNumbers[i - 1]} and ${ubidNumbers[i]}`,
          msiId,
          field: 'ubid',
        });
        break;
      }
    }
  }

  for (const row of pack1) {
    const skuReg = row.sku.match(/REG-\d{2}/)?.[0];
    if (skuReg && skuReg !== row.productCode) {
      issues.push({
        severity: 'error',
        code: 'IDENTITY_SKU_REG_MISMATCH',
        message: `SKU REG segment ${skuReg} does not match productCode ${row.productCode}`,
        msiId,
        mpiId: row.mpiId,
        ubid: row.ubid,
        field: 'sku',
      });
    }

    const skuVariant = row.sku.split('-').pop();
    if (skuVariant && skuVariant !== row.variantCode) {
      issues.push({
        severity: 'error',
        code: 'IDENTITY_SKU_VARIANT_MISMATCH',
        message: `SKU variant suffix ${skuVariant} does not match variantCode ${row.variantCode}`,
        msiId,
        mpiId: row.mpiId,
        ubid: row.ubid,
        field: 'sku',
      });
    }
  }

  return issues;
}

/**
 * @param {string} msiId
 * @param {string[]} values
 * @param {string} code
 * @param {string} field
 */
function findDuplicates(msiId, values, code, field) {
  /** @type {import('../types.js').ValidationIssue[]} */
  const issues = [];
  const seen = new Set();

  for (const value of values) {
    if (seen.has(value)) {
      issues.push({
        severity: 'error',
        code,
        message: `Duplicate ${field}: ${value}`,
        msiId,
        field,
        ...(field === 'ubid' ? { ubid: value } : {}),
        ...(field === 'mpiId' ? { mpiId: value } : {}),
      });
    }
    seen.add(value);
  }

  return issues;
}
