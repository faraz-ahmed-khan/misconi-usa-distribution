import fs from 'node:fs';
import path from 'node:path';
import { readXlsxSheet, listXlsxSheets } from '../utils/read-xlsx.js';

const PACK1_MAP = {
  mpiId: ['MPI_ID', 'MPI ID'],
  ubid: ['UBID'],
  msiId: ['MSI_ID', 'MSI ID', 'Supplier ID'],
  productCode: ['ProductCode', 'Product Code', 'REG Code', 'REG_Code'],
  sku: ['SKU'],
  variantCode: ['VariantCode', 'Variant Code', 'Variant'],
  variantLabel: ['VariantLabel', 'Variant Label'],
};

const PACK2_MAP = {
  mpiId: ['MPI_ID', 'MPI ID'],
  ubid: ['UBID'],
  categoryGroup: ['Category Group', 'CategoryGroup'],
  category: ['Category'],
  subcategory: ['Subcategory', 'Sub Category'],
  industryClassification: ['Industry Classification', 'IndustryClassification'],
  tags: ['Tags'],
};

const PACK3_MAP = {
  mpiId: ['MPI_ID', 'MPI ID'],
  ubid: ['UBID'],
  materials: ['Materials', 'Material'],
  dimensions: ['Dimensions'],
  weight: ['Weight'],
  packaging: ['Packaging'],
  technicalSpecs: ['Technical Specs', 'TechnicalSpecs', 'Specifications'],
};

/**
 * @param {Record<string, string>} row
 * @param {Record<string, string[]>} map
 * @param {string} key
 */
function pick(row, map, key) {
  for (const alias of map[key] || [key]) {
    if (row[alias] !== undefined && row[alias] !== '') return String(row[alias]).trim();
  }
  return '';
}

/**
 * @param {Record<string, string>} row
 * @param {Record<string, string[]>} map
 */
function mapRow(row, map) {
  /** @type {Record<string, string>} */
  const out = {};
  for (const key of Object.keys(map)) {
    out[key] = pick(row, map, key);
  }
  return out;
}

/**
 * @param {Record<string, string>[]} rows
 * @param {Record<string, string[]>} map
 */
function mapRows(rows, map) {
  return rows.filter((r) => pick(r, map, 'mpiId') || pick(r, map, 'ubid')).map((r) => mapRow(r, map));
}

/**
 * Load MPI packs for all suppliers from JSON or XLSX.
 * @param {{ jsonDir?: string, xlsxPath?: string }} options
 * @returns {Record<string, import('../types.js').MpiSupplierPacks>}
 */
export function loadMpiPacks(options = {}) {
  const { jsonDir, xlsxPath } = options;

  if (jsonDir && fs.existsSync(jsonDir)) {
    return loadMpiFromJsonDir(jsonDir);
  }

  if (xlsxPath && fs.existsSync(xlsxPath)) {
    return loadMpiFromXlsx(xlsxPath);
  }

  throw new Error('MPI source not found. Provide jsonDir or xlsxPath.');
}

/**
 * @param {string} jsonDir
 */
function loadMpiFromJsonDir(jsonDir) {
  const pack1All = readJsonIfExists(path.join(jsonDir, 'pack1.json'));
  const pack2All = readJsonIfExists(path.join(jsonDir, 'pack2.json'));
  const pack3All = readJsonIfExists(path.join(jsonDir, 'pack3.json'));

  /** @type {Record<string, import('../types.js').MpiSupplierPacks>} */
  const bySupplier = {};

  const msiIds = [...new Set(pack1All.map((r) => r.msiId).filter(Boolean))];

  for (const msiId of msiIds) {
    const pack1 = pack1All.filter((r) => r.msiId === msiId);
    const mpiIds = new Set(pack1.map((r) => r.mpiId));
    bySupplier[msiId] = {
      pack1,
      pack2: pack2All.filter((r) => mpiIds.has(r.mpiId)),
      pack3: pack3All.filter((r) => mpiIds.has(r.mpiId)),
    };
  }

  return bySupplier;
}

/**
 * @param {string} filePath
 */
function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return Array.isArray(raw) ? raw : raw.rows || [];
}

/**
 * @param {string} xlsxPath
 */
function loadMpiFromXlsx(xlsxPath) {
  const sheets = listXlsxSheets(xlsxPath);
  const findSheet = (pattern) => sheets.find((s) => pattern.test(s));

  const pack1Sheet = findSheet(/pack\s*1|product\s*keys/i) || sheets[0];
  const pack2Sheet = findSheet(/pack\s*2|classification/i) || sheets[1];
  const pack3Sheet = findSheet(/pack\s*3|specification/i) || sheets[2];

  const pack1Rows = mapRows(readXlsxSheet(xlsxPath, pack1Sheet), PACK1_MAP);
  const pack2Rows = mapRows(readXlsxSheet(xlsxPath, pack2Sheet), PACK2_MAP);
  const pack3Rows = mapRows(readXlsxSheet(xlsxPath, pack3Sheet), PACK3_MAP);

  /** @type {Record<string, import('../types.js').MpiSupplierPacks>} */
  const bySupplier = {};
  const msiIds = new Set(pack1Rows.map((r) => r.msiId).filter(Boolean));

  for (const msiId of msiIds) {
    const pack1 = pack1Rows.filter((r) => r.msiId === msiId);
    const mpiIds = new Set(pack1.map((r) => r.mpiId));
    bySupplier[msiId] = {
      pack1,
      pack2: pack2Rows.filter((r) => mpiIds.has(r.mpiId)),
      pack3: pack3Rows.filter((r) => mpiIds.has(r.mpiId)),
    };
  }

  return bySupplier;
}

export function resolveMpiSource() {
  const handoffDir = process.env.MSI_MPI_HANDOFF_DIR;
  if (handoffDir) {
    const xlsx = path.join(handoffDir, 'Master Product Intake (MPI) - TO ZOHO.xlsx');
    const jsonDir = path.join(handoffDir, 'mpi');
    if (fs.existsSync(xlsx)) return { xlsxPath: xlsx };
    if (fs.existsSync(jsonDir)) return { jsonDir };
    return null;
  }

  const projectDir = path.resolve('data/intake/mpi');
  if (fs.existsSync(projectDir)) return { jsonDir: projectDir };

  return null;
}
