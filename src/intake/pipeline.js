import fs from 'node:fs';
import path from 'node:path';
import { buildSeedIntakeDataset } from './data/seed-regalia.js';
import { loadMsiSuppliers, resolveMsiSource } from './loaders/msi-loader.js';
import { loadMpiPacks, resolveMpiSource } from './loaders/mpi-loader.js';
import { isZohoHandoffWorkbook, loadZohoHandoff } from './loaders/zoho-handoff-loader.js';
import { runMmiValidationForAll } from './validators/mmi-validator.js';

/**
 * Execute steps 1–4 of the MSI/MPI handoff:
 * 1. Load MSI intake
 * 2. Load MPI packs
 * 3. Run MMI validation
 * 4. Confirm Pack 1 → Pack 2 → Pack 3 alignment
 *
 * Step 5 promotion is handled by src/vault/promote.js (manual approval required).
 *
 * @param {{ useSeed?: boolean, msiSource?: object, mpiSource?: object }} [options]
 * @returns {import('./types.js').IntakePipelineResult}
 */
export function runIntakePipeline(options = {}) {
  const { useSeed = false } = options;
  let source = 'seed';

  /** @type {import('./types.js').MsiSupplier[]} */
  let msiSuppliers;
  /** @type {Record<string, import('./types.js').MpiSupplierPacks>} */
  let mpiBySupplier;

  if (useSeed) {
    const seed = buildSeedIntakeDataset();
    msiSuppliers = seed.msiSuppliers;
    mpiBySupplier = seed.mpiBySupplier;
    source = 'seed-regalia';
  } else {
    const handoffDir = process.env.MSI_MPI_HANDOFF_DIR;
    const msiSource = options.msiSource || resolveMsiSource();
    const mpiSource = options.mpiSource || resolveMpiSource();

    if (handoffDir && (!msiSource?.xlsxPath || !mpiSource?.xlsxPath)) {
      throw new Error(
        `MSI_MPI_HANDOFF_DIR is set but Excel handoff files were not found.\n` +
          `  Dir: ${handoffDir}\n` +
          `  Expected: "Master Supplier Intake (MSI) - TO ZOHO.xlsx" and "Master Product Intake (MPI) - TO ZOHO.xlsx"`
      );
    }

    if (!msiSource || !mpiSource) {
      const seed = buildSeedIntakeDataset();
      msiSuppliers = seed.msiSuppliers;
      mpiBySupplier = seed.mpiBySupplier;
      source = 'seed-regalia-fallback';
    } else if (
      msiSource.xlsxPath &&
      mpiSource.xlsxPath &&
      isZohoHandoffWorkbook(msiSource.xlsxPath) &&
      isZohoHandoffWorkbook(mpiSource.xlsxPath)
    ) {
      const handoff = loadZohoHandoff({
        msiXlsxPath: msiSource.xlsxPath,
        mpiXlsxPath: mpiSource.xlsxPath,
      });
      msiSuppliers = handoff.msiSuppliers;
      mpiBySupplier = handoff.mpiBySupplier;
      source = handoff.source;
    } else {
      msiSuppliers = loadMsiSuppliers(msiSource);
      mpiBySupplier = loadMpiPacks(mpiSource);
      source = msiSource.xlsxPath || mpiSource.xlsxPath || msiSource.jsonPath || 'handoff';
    }
  }

  /** @type {import('./types.js').ValidationIssue[]} */
  const globalIssues = [];

  for (const msi of msiSuppliers) {
    if (!mpiBySupplier[msi.msiId]) {
      globalIssues.push({
        severity: 'error',
        code: 'PIPELINE_MPI_NOT_LOADED',
        message: `MPI data not loaded for MSI supplier ${msi.msiId}`,
        msiId: msi.msiId,
      });
    }
  }

  const validationBySupplier = runMmiValidationForAll(msiSuppliers, mpiBySupplier);
  const allPassed = Object.values(validationBySupplier).every((r) => r.passed) && globalIssues.length === 0;

  return {
    success: allPassed,
    ranAt: new Date().toISOString(),
    msiSuppliers,
    mpiBySupplier,
    validationBySupplier,
    globalIssues,
    source,
  };
}

/**
 * Write seed JSON files to data/intake for handoff / Zoho prep.
 * @param {string} [outDir]
 */
export function writeSeedDataFiles(outDir = 'data/intake') {
  const seed = buildSeedIntakeDataset();
  const mpiDir = path.join(outDir, 'mpi');

  fs.mkdirSync(mpiDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'msi-suppliers.json'), JSON.stringify(seed.msiSuppliers, null, 2));

  const pack1 = [];
  const pack2 = [];
  const pack3 = [];

  for (const packs of Object.values(seed.mpiBySupplier)) {
    pack1.push(...packs.pack1);
    pack2.push(...packs.pack2);
    pack3.push(...packs.pack3);
  }

  fs.writeFileSync(path.join(mpiDir, 'pack1.json'), JSON.stringify(pack1, null, 2));
  fs.writeFileSync(path.join(mpiDir, 'pack2.json'), JSON.stringify(pack2, null, 2));
  fs.writeFileSync(path.join(mpiDir, 'pack3.json'), JSON.stringify(pack3, null, 2));

  return { outDir, supplierCount: seed.msiSuppliers.length, mpiRowCount: pack1.length };
}
