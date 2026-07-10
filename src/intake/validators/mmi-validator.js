import { expectedMpiRowCount } from '../constants.js';
import { validateMsiCompliance } from './msi-compliance.js';
import { validateStructural } from './structural.js';
import { validateIdentity } from './identity.js';

/**
 * Run full MMI validation sequence for one supplier.
 * @param {import('../types.js').MsiSupplier} msi
 * @param {import('../types.js').MpiSupplierPacks} packs
 * @returns {import('../types.js').MmiValidationResult}
 */
export function runMmiValidation(msi, packs) {
  const msiComplianceIssues = validateMsiCompliance(msi, packs);
  const structuralIssues = validateStructural(msi.msiId, packs);
  const identityIssues = validateIdentity(msi.msiId, packs);

  const issues = [...msiComplianceIssues, ...structuralIssues, ...identityIssues];
  const errors = issues.filter((i) => i.severity === 'error');

  const msiCompliance = msiComplianceIssues.every((i) => i.severity !== 'error');
  const structural = structuralIssues.every((i) => i.severity !== 'error');
  const identity = identityIssues.every((i) => i.severity !== 'error');
  const packAlignment =
    packs.pack1.length === packs.pack2.length &&
    packs.pack1.length === packs.pack3.length &&
    structuralIssues.filter((i) => i.code.startsWith('STRUCT_ORPHAN') || i.code === 'STRUCT_PACK_COUNT_MISMATCH').length === 0;

  return {
    passed: errors.length === 0,
    msiId: msi.msiId,
    issues,
    checks: {
      msiCompliance,
      structural,
      identity,
      packAlignment,
    },
    counts: {
      pack1Count: packs.pack1.length,
      pack2Count: packs.pack2.length,
      pack3Count: packs.pack3.length,
      expectedCount: expectedMpiRowCount(),
    },
  };
}

/**
 * Run MMI validation for all loaded suppliers.
 * @param {import('../types.js').MsiSupplier[]} msiSuppliers
 * @param {Record<string, import('../types.js').MpiSupplierPacks>} mpiBySupplier
 * @returns {Record<string, import('../types.js').MmiValidationResult>}
 */
export function runMmiValidationForAll(msiSuppliers, mpiBySupplier) {
  /** @type {Record<string, import('../types.js').MmiValidationResult>} */
  const results = {};

  for (const msi of msiSuppliers) {
    const packs = mpiBySupplier[msi.msiId];
    if (!packs) {
      results[msi.msiId] = {
        passed: false,
        msiId: msi.msiId,
        issues: [
          {
            severity: 'error',
            code: 'MPI_MISSING_SUPPLIER',
            message: `No MPI packs loaded for supplier ${msi.msiId}`,
            msiId: msi.msiId,
          },
        ],
        checks: { msiCompliance: false, structural: false, identity: false, packAlignment: false },
        counts: { pack1Count: 0, pack2Count: 0, pack3Count: 0, expectedCount: expectedMpiRowCount() },
      };
      continue;
    }

    results[msi.msiId] = runMmiValidation(msi, packs);
  }

  return results;
}
