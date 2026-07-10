import fs from 'node:fs';
import path from 'node:path';
import { readXlsxSheet, listXlsxSheets } from '../utils/read-xlsx.js';
import { REG_CODES, UBIDS_PER_SUPPLIER } from '../constants.js';

/** Common header aliases from Zoho export templates. */
const MSI_FIELD_MAP = {
  msiId: ['MSI_ID', 'MSI ID', 'Supplier ID', 'MSI_ID '],
  name: ['Supplier Name', 'Name', 'MSI_Name'],
  allowedRegCodes: ['Allowed REG Codes', 'REG Codes', 'Allowed_REG_Codes'],
  allowedMaterials: ['Allowed Materials', 'Materials', 'Allowed_Materials'],
  skuPattern: ['SKU Pattern', 'SKU_Pattern'],
  ubidCount: ['UBID Count', 'UBID_Count', 'UBIDs'],
  capabilities: ['Capabilities', 'Supplier Capabilities'],
  status: ['Status'],
};

/**
 * @param {Record<string, string>} row
 * @param {Record<string, string[]>} fieldMap
 */
function pickField(row, fieldMap, key) {
  const aliases = fieldMap[key] || [key];
  for (const alias of aliases) {
    if (row[alias] !== undefined && row[alias] !== '') return row[alias];
  }
  return '';
}

/**
 * @param {string} value
 */
function parseList(value) {
  if (!value) return [];
  return value
    .split(/[;,|]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Load MSI suppliers from JSON file or XLSX handoff.
 * @param {{ jsonPath?: string, xlsxPath?: string, sheetName?: string }} options
 * @returns {import('../types.js').MsiSupplier[]}
 */
export function loadMsiSuppliers(options = {}) {
  const { jsonPath, xlsxPath, sheetName } = options;

  if (jsonPath && fs.existsSync(jsonPath)) {
    const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    return Array.isArray(raw) ? raw.map(normalizeMsiRow) : raw.suppliers.map(normalizeMsiRow);
  }

  if (xlsxPath && fs.existsSync(xlsxPath)) {
    const sheets = listXlsxSheets(xlsxPath);
    const targetSheet = sheetName || sheets.find((s) => /msi|supplier/i.test(s)) || sheets[0];
    const rows = readXlsxSheet(xlsxPath, targetSheet);
    return rows.filter((r) => pickField(r, MSI_FIELD_MAP, 'msiId')).map((row) => msiFromXlsxRow(row));
  }

  throw new Error('MSI source not found. Provide jsonPath or xlsxPath.');
}

/**
 * @param {import('../types.js').MsiSupplier} supplier
 */
function normalizeMsiRow(supplier) {
  return {
    ...supplier,
    allowedRegCodes: supplier.allowedRegCodes || [],
    allowedMaterials: supplier.allowedMaterials || [],
    variantLadderRules: supplier.variantLadderRules || {},
    ubidCount: Number(supplier.ubidCount) || UBIDS_PER_SUPPLIER,
    capabilities: supplier.capabilities || [],
  };
}

/**
 * @param {Record<string, string>} row
 * @returns {import('../types.js').MsiSupplier}
 */
function msiFromXlsxRow(row) {
  const msiId = pickField(row, MSI_FIELD_MAP, 'msiId').padStart(4, '0');
  const allowedRegCodes = parseList(pickField(row, MSI_FIELD_MAP, 'allowedRegCodes'));
  const variantLadderRules = Object.fromEntries(
    allowedRegCodes.map((code) => {
      const key = `Variants ${code}`;
      const altKey = `${code} Variants`;
      const raw = row[key] || row[altKey] || '';
      const variants = parseList(raw);
      return [code, variants];
    })
  );

  return {
    msiId,
    name: pickField(row, MSI_FIELD_MAP, 'name') || `Supplier ${msiId}`,
    allowedRegCodes: allowedRegCodes.length ? allowedRegCodes : [...REG_CODES],
    allowedMaterials: parseList(pickField(row, MSI_FIELD_MAP, 'allowedMaterials')),
    variantLadderRules,
    skuPattern: pickField(row, MSI_FIELD_MAP, 'skuPattern') || 'MIS-{MSI_ID}-REG-{XX}-{VariantCode}',
    ubidCount: Number(pickField(row, MSI_FIELD_MAP, 'ubidCount')) || UBIDS_PER_SUPPLIER,
    capabilities: parseList(pickField(row, MSI_FIELD_MAP, 'capabilities')),
    status: pickField(row, MSI_FIELD_MAP, 'status') || 'ACTIVE',
  };
}

/**
 * Resolve MSI handoff path from env or project data folder.
 */
export function resolveMsiSource() {
  const handoffDir = process.env.MSI_MPI_HANDOFF_DIR;
  if (handoffDir) {
    const xlsx = path.join(handoffDir, 'Master Supplier Intake (MSI) - TO ZOHO.xlsx');
    const json = path.join(handoffDir, 'msi-suppliers.json');
    if (fs.existsSync(xlsx)) return { xlsxPath: xlsx };
    if (fs.existsSync(json)) return { jsonPath: json };
    return null;
  }

  const projectJson = path.resolve('data/intake/msi-suppliers.json');
  if (fs.existsSync(projectJson)) return { jsonPath: projectJson };

  return null;
}
