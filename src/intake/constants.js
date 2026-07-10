/** @typedef {'REG-01'|'REG-02'|'REG-03'|'REG-04'|'REG-05'|'REG-06'|'REG-07'|'REG-08'} RegCode */

export const REG_CODES = /** @type {const} */ ([
  'REG-01',
  'REG-02',
  'REG-03',
  'REG-04',
  'REG-05',
  'REG-06',
  'REG-07',
  'REG-08',
]);

export const REG_PRODUCT_FAMILIES = {
  'REG-01': 'Bachelor Gown',
  'REG-02': 'Master Gown',
  'REG-03': 'Doctoral Gown',
  'REG-04': 'Tassel',
  'REG-05': 'Hood',
  'REG-06': 'Cap',
  'REG-07': 'Stole',
  'REG-08': 'Doctoral Tam',
};

export const GOWN_REG_CODES = /** @type {const} */ (['REG-01', 'REG-02', 'REG-03', 'REG-08']);
export const ACCESSORY_REG_CODES = /** @type {const} */ (['REG-04', 'REG-05', 'REG-06', 'REG-07']);

export const GOWN_VARIANTS = /** @type {const} */ (['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']);
export const ACCESSORY_VARIANT = 'STD';

export const UBIDS_PER_SUPPLIER = 40;

export const SKU_PATTERN = /^MIS-(\d{4})-(REG-\d{2})-(.+)$/;

/**
 * Expected variant ladder per REG code.
 * @param {string} regCode
 * @returns {readonly string[]}
 */
export function variantsForRegCode(regCode) {
  if (GOWN_REG_CODES.includes(/** @type {typeof GOWN_REG_CODES[number]} */ (regCode))) {
    return GOWN_VARIANTS;
  }
  if (ACCESSORY_REG_CODES.includes(/** @type {typeof ACCESSORY_REG_CODES[number]} */ (regCode))) {
    return [ACCESSORY_VARIANT];
  }
  return [];
}

/**
 * Row count per REG code for a complete supplier catalog.
 * @param {string} regCode
 */
export function rowCountForRegCode(regCode) {
  return variantsForRegCode(regCode).length;
}

/** Total MPI rows when all REG families are populated. */
export function expectedMpiRowCount() {
  return REG_CODES.reduce((sum, code) => sum + rowCountForRegCode(code), 0);
}

/**
 * Build canonical SKU for a supplier product variant.
 * @param {string} msiId
 * @param {string} regCode
 * @param {string} variantCode
 */
export function buildSku(msiId, regCode, variantCode) {
  const regNum = regCode.replace('REG-', '');
  return `MIS-${msiId}-REG-${regNum}-${variantCode}`;
}
