const PACK1_REQUIRED = ['mpiId', 'ubid', 'msiId', 'productCode', 'sku', 'variantCode'];
const PACK2_REQUIRED = ['mpiId', 'ubid', 'categoryGroup', 'category', 'subcategory', 'industryClassification'];
const PACK3_REQUIRED = ['mpiId', 'ubid', 'materials', 'dimensions', 'weight', 'packaging'];

/**
 * Validate Pack 1 → Pack 2 → Pack 3 structural mapping.
 * @param {string} msiId
 * @param {import('../types.js').MpiSupplierPacks} packs
 * @returns {import('../types.js').ValidationIssue[]}
 */
export function validateStructural(msiId, packs) {
  /** @type {import('../types.js').ValidationIssue[]} */
  const issues = [];
  const { pack1, pack2, pack3 } = packs;

  const pack2ByMpi = indexBy(pack2, 'mpiId');
  const pack3ByMpi = indexBy(pack3, 'mpiId');

  const pack1MpiIds = new Set();
  const pack1Ubids = new Set();

  for (const row of pack1) {
    for (const field of PACK1_REQUIRED) {
      if (!row[field]) {
        issues.push({
          severity: 'error',
          code: 'STRUCT_PACK1_MISSING_FIELD',
          message: `Pack 1 row missing required field: ${field}`,
          msiId,
          mpiId: row.mpiId,
          ubid: row.ubid,
          field,
        });
      }
    }

    if (pack1MpiIds.has(row.mpiId)) {
      issues.push({
        severity: 'error',
        code: 'STRUCT_PACK1_DUPLICATE_MPI',
        message: `Duplicate MPI_ID in Pack 1: ${row.mpiId}`,
        msiId,
        mpiId: row.mpiId,
        field: 'mpiId',
      });
    }
    pack1MpiIds.add(row.mpiId);

    if (pack1Ubids.has(row.ubid)) {
      issues.push({
        severity: 'error',
        code: 'STRUCT_PACK1_DUPLICATE_UBID',
        message: `Duplicate UBID in Pack 1: ${row.ubid}`,
        msiId,
        ubid: row.ubid,
        field: 'ubid',
      });
    }
    pack1Ubids.add(row.ubid);

    const p2 = pack2ByMpi.get(row.mpiId);
    const p3 = pack3ByMpi.get(row.mpiId);

    if (!p2) {
      issues.push({
        severity: 'error',
        code: 'STRUCT_ORPHAN_PACK1',
        message: `Pack 1 row ${row.mpiId} has no matching Pack 2 classification row`,
        msiId,
        mpiId: row.mpiId,
        ubid: row.ubid,
      });
    } else {
      for (const field of PACK2_REQUIRED) {
        if (!p2[field]) {
          issues.push({
            severity: 'error',
            code: 'STRUCT_PACK2_MISSING_FIELD',
            message: `Pack 2 row for ${row.mpiId} missing field: ${field}`,
            msiId,
            mpiId: row.mpiId,
            field,
          });
        }
      }
      if (p2.ubid !== row.ubid) {
        issues.push({
          severity: 'error',
          code: 'STRUCT_PACK1_PACK2_UBID_MISMATCH',
          message: `Pack 2 UBID ${p2.ubid} does not match Pack 1 UBID ${row.ubid} for MPI ${row.mpiId}`,
          msiId,
          mpiId: row.mpiId,
          ubid: row.ubid,
          field: 'ubid',
        });
      }
    }

    if (!p3) {
      issues.push({
        severity: 'error',
        code: 'STRUCT_ORPHAN_PACK1_PACK3',
        message: `Pack 1 row ${row.mpiId} has no matching Pack 3 specification row`,
        msiId,
        mpiId: row.mpiId,
        ubid: row.ubid,
      });
    } else {
      for (const field of PACK3_REQUIRED) {
        if (!p3[field]) {
          issues.push({
            severity: 'error',
            code: 'STRUCT_PACK3_MISSING_FIELD',
            message: `Pack 3 row for ${row.mpiId} missing field: ${field}`,
            msiId,
            mpiId: row.mpiId,
            field,
          });
        }
      }
      if (p3.ubid !== row.ubid) {
        issues.push({
          severity: 'error',
          code: 'STRUCT_PACK1_PACK3_UBID_MISMATCH',
          message: `Pack 3 UBID ${p3.ubid} does not match Pack 1 UBID ${row.ubid} for MPI ${row.mpiId}`,
          msiId,
          mpiId: row.mpiId,
          ubid: row.ubid,
          field: 'ubid',
        });
      }
    }
  }

  for (const row of pack2) {
    if (!pack1MpiIds.has(row.mpiId)) {
      issues.push({
        severity: 'error',
        code: 'STRUCT_ORPHAN_PACK2',
        message: `Pack 2 row ${row.mpiId} has no matching Pack 1 key row`,
        msiId,
        mpiId: row.mpiId,
        ubid: row.ubid,
      });
    }
  }

  issues.push(...findDuplicateRows(msiId, pack2, 'mpiId', 'STRUCT_PACK2_DUPLICATE_MPI', 'Pack 2'));
  issues.push(...findDuplicateRows(msiId, pack3, 'mpiId', 'STRUCT_PACK3_DUPLICATE_MPI', 'Pack 3'));

  for (const row of pack3) {
    if (!pack1MpiIds.has(row.mpiId)) {
      issues.push({
        severity: 'error',
        code: 'STRUCT_ORPHAN_PACK3',
        message: `Pack 3 row ${row.mpiId} has no matching Pack 1 key row`,
        msiId,
        mpiId: row.mpiId,
        ubid: row.ubid,
      });
    }
  }

  if (pack2.length !== pack1.length) {
    issues.push({
      severity: 'error',
      code: 'STRUCT_PACK_COUNT_MISMATCH',
      message: `Pack 2 count (${pack2.length}) does not match Pack 1 count (${pack1.length})`,
      msiId,
      field: 'pack2',
    });
  }

  if (pack3.length !== pack1.length) {
    issues.push({
      severity: 'error',
      code: 'STRUCT_PACK_COUNT_MISMATCH',
      message: `Pack 3 count (${pack3.length}) does not match Pack 1 count (${pack1.length})`,
      msiId,
      field: 'pack3',
    });
  }

  return issues;
}

/**
 * @param {string} msiId
 * @param {Record<string, unknown>[]} rows
 * @param {string} key
 * @param {string} code
 * @param {string} label
 */
function findDuplicateRows(msiId, rows, key, code, label) {
  /** @type {import('../types.js').ValidationIssue[]} */
  const issues = [];
  const seen = new Set();
  for (const row of rows) {
    const value = String(row[key] ?? '');
    if (!value) continue;
    if (seen.has(value)) {
      issues.push({
        severity: 'error',
        code,
        message: `${label} duplicate ${key}: ${value}`,
        msiId,
        mpiId: key === 'mpiId' ? value : String(row.mpiId ?? ''),
        ubid: key === 'ubid' ? value : String(row.ubid ?? ''),
        field: key,
      });
    }
    seen.add(value);
  }
  return issues;
}

/**
 * @template T
 * @param {T[]} rows
 * @param {keyof T & string} key
 */
function indexBy(rows, key) {
  /** @type {Map<string, T>} */
  const map = new Map();
  for (const row of rows) {
    const value = String(row[key] ?? '');
    if (value) map.set(value, row);
  }
  return map;
}
