import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import os from 'node:os';

/**
 * Minimal XLSX reader (no external deps). Parses first sheet to array of row objects.
 * @param {string} filePath
 * @param {string} [sheetName] - if omitted, uses first sheet
 * @returns {Record<string, string>[]}
 */
export function readXlsxSheet(filePath, sheetName) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`XLSX not found: ${filePath}`);
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'xlsx-'));
  try {
    const zipCopy = path.join(tmpDir, 'workbook.zip');
    fs.copyFileSync(filePath, zipCopy);
    execSync(`tar -xf "${zipCopy}" -C "${tmpDir}"`, { stdio: 'pipe' });

    const workbookXml = fs.readFileSync(path.join(tmpDir, 'xl', 'workbook.xml'), 'utf8');
    const relsXml = fs.readFileSync(path.join(tmpDir, 'xl', '_rels', 'workbook.xml.rels'), 'utf8');
    const sharedStrings = readSharedStrings(tmpDir);

    const sheetEntries = [...workbookXml.matchAll(/<sheet\b[^>]*\bname="([^"]+)"[^>]*\br:id="([^"]+)"/g)].map((m) => ({
      name: m[1],
      rid: m[2],
    }));

    const relTargets = Object.fromEntries(
      [...relsXml.matchAll(/Id="([^"]+)"[^>]+Target="([^"]+)"/g)].map((m) => [m[1], m[2].replace(/^\//, '')])
    );

    const targetSheet = sheetName
      ? sheetEntries.find((s) => s.name === sheetName)
      : sheetEntries[0];

    if (!targetSheet) {
      throw new Error(sheetName ? `Sheet not found: ${sheetName}` : 'Workbook has no sheets');
    }

    const relTarget = relTargets[targetSheet.rid];
    const sheetPath = relTarget.startsWith('xl/') ? path.join(tmpDir, relTarget) : path.join(tmpDir, 'xl', relTarget);
    const sheetXml = fs.readFileSync(sheetPath, 'utf8');

    return sheetXmlToRows(sheetXml, sharedStrings);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

/**
 * @param {string} tmpDir
 */
function readSharedStrings(tmpDir) {
  const ssPath = path.join(tmpDir, 'xl', 'sharedStrings.xml');
  if (!fs.existsSync(ssPath)) return [];

  const xml = fs.readFileSync(ssPath, 'utf8');
  const strings = [];
  const siMatches = xml.match(/<si>[\s\S]*?<\/si>/g) || [];

  for (const si of siMatches) {
    const parts = [...si.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((m) => decodeXml(m[1]));
    strings.push(parts.join(''));
  }
  return strings;
}

/**
 * @param {string} xml
 * @param {string[]} sharedStrings
 */
function sheetXmlToRows(xml, sharedStrings) {
  const rowMatches = xml.match(/<row[^>]*>[\s\S]*?<\/row>/g) || [];
  const matrix = [];

  for (const rowXml of rowMatches) {
    const rowIndex = Number(rowXml.match(/r="(\d+)"/)?.[1] || matrix.length + 1);
    const cells = [...rowXml.matchAll(/<c([^>]*)>([\s\S]*?)<\/c>/g)];
    const row = [];

    for (const [, attrs, inner] of cells) {
      const ref = attrs.match(/r="([A-Z]+)(\d+)"/);
      const colLetters = ref?.[1] || 'A';
      const colIndex = columnLettersToIndex(colLetters);
      const type = attrs.match(/t="([^"]+)"/)?.[1];
      const value = inner.match(/<v>([\s\S]*?)<\/v>/)?.[1] || '';
      const inline = inner.match(/<t[^>]*>([\s\S]*?)<\/t>/)?.[1];

      let cellValue = '';
      if (type === 's') {
        cellValue = sharedStrings[Number(value)] ?? '';
      } else if (inline !== undefined) {
        cellValue = decodeXml(inline);
      } else {
        cellValue = decodeXml(value);
      }

      row[colIndex] = cellValue;
    }

    matrix[rowIndex - 1] = row;
  }

  const filled = matrix.filter(Boolean);
  if (!filled.length) return [];

  const headers = filled[0].map((h, i) => String(h || `COL_${i}`).trim());
  return filled.slice(1).map((row) => {
    /** @type {Record<string, string>} */
    const obj = {};
    headers.forEach((header, i) => {
      if (header) obj[header] = String(row?.[i] ?? '').trim();
    });
    return obj;
  });
}

/** @param {string} letters */
function columnLettersToIndex(letters) {
  let n = 0;
  for (const ch of letters) {
    n = n * 26 + (ch.charCodeAt(0) - 64);
  }
  return n - 1;
}

/** @param {string} value */
function decodeXml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

/**
 * List sheet names in an xlsx file.
 * @param {string} filePath
 */
export function listXlsxSheets(filePath) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'xlsx-list-'));
  try {
    const zipCopy = path.join(tmpDir, 'workbook.zip');
    fs.copyFileSync(filePath, zipCopy);
    execSync(`tar -xf "${zipCopy}" -C "${tmpDir}"`, { stdio: 'pipe' });
    const workbookXml = fs.readFileSync(path.join(tmpDir, 'xl', 'workbook.xml'), 'utf8');
    return [...workbookXml.matchAll(/<sheet\b[^>]*\bname="([^"]+)"[^>]*\br:id="/g)].map((m) => m[1]);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}
