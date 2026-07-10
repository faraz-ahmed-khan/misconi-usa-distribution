import path from 'node:path';
import { readXlsxSheet } from '../utils/read-xlsx.js';
import {
  REG_CODES,
  REG_PRODUCT_FAMILIES,
  UBIDS_PER_SUPPLIER,
  buildSku,
  variantsForRegCode,
} from '../constants.js';

const MSI_SHEET = 'MSI';
const MPI_SHEET = 'MPI';

/**
 * Normalize REG code variants: REG01 → REG-01
 * @param {string} raw
 */
export function normalizeRegCode(raw) {
  const cleaned = String(raw || '').trim().toUpperCase().replace(/‑/g, '-');
  const match = cleaned.match(/REG-?(\d{2})/);
  if (!match) return cleaned;
  return `REG-${match[1]}`;
}

/**
 * Parse MPI_ID like MPI-0001-REG01-XS
 * @param {string} mpiId
 */
export function parseMpiId(mpiId) {
  const cleaned = String(mpiId || '').trim().replace(/‑/g, '-');
  const match = cleaned.match(/^MPI-(\d{4})-(REG-?\d{2})-(.+)$/i);
  if (!match) return null;
  return {
    msiId: match[1],
    productCode: normalizeRegCode(match[2]),
    variantCode: match[3],
    mpiId: cleaned,
  };
}

/**
 * Map MSI_ID like REG-SUP-001 → 0001
 * @param {string} raw
 */
export function normalizeMsiId(raw) {
  const cleaned = String(raw || '').trim().replace(/‑/g, '-');
  const supMatch = cleaned.match(/REG-?SUP-?(\d+)/i);
  if (supMatch) return supMatch[1].padStart(4, '0');
  const numMatch = cleaned.match(/(\d{4})/);
  if (numMatch) return numMatch[1];
  return cleaned;
}

/**
 * Load MSI + MPI from Zoho TO ZOHO handoff workbooks.
 * @param {{ msiXlsxPath: string, mpiXlsxPath: string }}
 */
export function loadZohoHandoff({ msiXlsxPath, mpiXlsxPath }) {
  const msiSuppliers = loadMsiFromZohoSheet(msiXlsxPath);
  const mpiBySupplier = loadMpiFromZohoSheet(mpiXlsxPath);

  return {
    msiSuppliers,
    mpiBySupplier,
    source: `zoho-handoff:${path.basename(msiXlsxPath)}+${path.basename(mpiXlsxPath)}`,
  };
}

/**
 * @param {string} xlsxPath
 * @returns {import('../types.js').MsiSupplier[]}
 */
function loadMsiFromZohoSheet(xlsxPath) {
  const rows = readXlsxSheet(xlsxPath, MSI_SHEET);

  return rows
    .filter((row) => {
      const msiRaw = row['Keys & Linkage'] || '';
      return /REG.?SUP/i.test(msiRaw);
    })
    .map((row) => {
      const msiId = normalizeMsiId(row['Keys & Linkage']);
      const name = row['2'] || row.SupplierDisplayName || `Supplier ${msiId}`;

      return {
        msiId,
        name,
        allowedRegCodes: [...REG_CODES],
        allowedMaterials: ['Polyester', 'Matte Polyester', 'Satin', 'Velvet', 'Recycled PET'],
        variantLadderRules: Object.fromEntries(REG_CODES.map((code) => [code, [...variantsForRegCode(code)]])),
        skuPattern: 'MIS-{MSI_ID}-REG-{XX}-{VariantCode}',
        ubidCount: UBIDS_PER_SUPPLIER,
        capabilities: ['Gown manufacturing', 'Accessory assembly'],
        status: 'ACTIVE',
        externalMsiId: row['Keys & Linkage'],
        hqState: row['3'] || '',
      };
    });
}

/**
 * @param {string} xlsxPath
 * @returns {Record<string, import('../types.js').MpiSupplierPacks>}
 */
function loadMpiFromZohoSheet(xlsxPath) {
  const rows = readXlsxSheet(xlsxPath, MPI_SHEET);

  /** @type {Record<string, import('../types.js').MpiPack1Row[]>} */
  const pack1BySupplier = {};
  /** @type {Record<string, import('../types.js').MpiPack2Row[]>} */
  const pack2BySupplier = {};
  /** @type {Record<string, import('../types.js').MpiPack3Row[]>} */
  const pack3BySupplier = {};

  for (const row of rows) {
    const mpiIdRaw = row['Keys & Linkage'] || '';
    if (!/^MPI-/i.test(mpiIdRaw)) continue;

    const parsed = parseMpiId(mpiIdRaw);
    if (!parsed) continue;

    const { msiId, productCode, variantCode, mpiId } = parsed;
    const ubid = String(row['1'] || '').trim();
    if (!ubid) continue;

    const sku = buildSku(msiId, productCode, variantCode);
    const category = row['2'] || 'Regalia';
    const weight = row['3'] || '';
    const compliance = row['494'] || '';

    if (!pack1BySupplier[msiId]) {
      pack1BySupplier[msiId] = [];
      pack2BySupplier[msiId] = [];
      pack3BySupplier[msiId] = [];
    }

    pack1BySupplier[msiId].push({
      mpiId,
      ubid,
      msiId,
      productCode,
      sku,
      variantCode,
      variantLabel: variantCode,
    });

    pack2BySupplier[msiId].push({
      mpiId,
      ubid,
      categoryGroup: 'Regalia',
      category,
      subcategory: REG_PRODUCT_FAMILIES[productCode] || productCode,
      industryClassification: 'Educational Regalia',
      tags: [productCode, variantCode].join(';'),
    });

    pack3BySupplier[msiId].push({
      mpiId,
      ubid,
      materials: 'Per supplier specification',
      dimensions: 'Per variant specification',
      weight,
      packaging: 'Per supplier packaging standard',
      technicalSpecs: compliance,
    });
  }

  /** @type {Record<string, import('../types.js').MpiSupplierPacks>} */
  const bySupplier = {};
  for (const msiId of Object.keys(pack1BySupplier)) {
    bySupplier[msiId] = {
      pack1: pack1BySupplier[msiId],
      pack2: pack2BySupplier[msiId],
      pack3: pack3BySupplier[msiId],
    };
  }

  return bySupplier;
}

/**
 * @param {string} filePath
 */
export function isZohoHandoffWorkbook(filePath) {
  return /TO ZOHO\.xlsx$/i.test(filePath);
}
