#!/usr/bin/env node
/**
 * Run MSI intake load + MMI validation pipeline (steps 1–4).
 *
 * Usage:
 *   node scripts/run-intake-validation.mjs
 *   node scripts/run-intake-validation.mjs --seed
 *   node scripts/run-intake-validation.mjs --write-seed
 *   MSI_MPI_HANDOFF_DIR="path/to/handoff" node scripts/run-intake-validation.mjs
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from '../src/intake/utils/load-env.js';
import { runIntakePipeline, writeSeedDataFiles } from '../src/intake/pipeline.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
process.chdir(projectRoot);

loadEnv(path.join(projectRoot, '.env'));

const args = new Set(process.argv.slice(2));
const useSeed = args.has('--seed');
const writeSeed = args.has('--write-seed');

if (writeSeed) {
  const result = writeSeedDataFiles();
  console.log(`Wrote seed intake data to ${result.outDir}`);
  console.log(`  Suppliers: ${result.supplierCount}`);
  console.log(`  MPI rows (Pack 1): ${result.mpiRowCount}`);
}

const result = runIntakePipeline({ useSeed: useSeed || writeSeed });

console.log('\n=== MSI / MPI Intake Validation Pipeline ===');
if (process.env.MSI_MPI_HANDOFF_DIR) {
  console.log(`Handoff dir: ${process.env.MSI_MPI_HANDOFF_DIR}`);
}
console.log(`Source: ${result.source}`);
console.log(`Ran at: ${result.ranAt}`);
console.log(`Overall: ${result.success ? 'PASSED' : 'FAILED'}\n`);

for (const msi of result.msiSuppliers) {
  const validation = result.validationBySupplier[msi.msiId];
  console.log(`Supplier ${msi.msiId} — ${msi.name}`);
  console.log(`  MSI compliance:  ${validation.checks.msiCompliance ? 'PASS' : 'FAIL'}`);
  console.log(`  Structural:      ${validation.checks.structural ? 'PASS' : 'FAIL'}`);
  console.log(`  Identity:        ${validation.checks.identity ? 'PASS' : 'FAIL'}`);
  console.log(`  Pack alignment:  ${validation.checks.packAlignment ? 'PASS' : 'FAIL'}`);
  console.log(`  Counts P1/P2/P3: ${validation.counts.pack1Count}/${validation.counts.pack2Count}/${validation.counts.pack3Count} (expected ${validation.counts.expectedCount})`);

  const errors = validation.issues.filter((i) => i.severity === 'error');
  if (errors.length) {
    console.log(`  Errors (${errors.length}):`);
    for (const err of errors.slice(0, 8)) {
      console.log(`    - [${err.code}] ${err.message}`);
    }
    if (errors.length > 8) console.log(`    ... and ${errors.length - 8} more`);
  } else {
    console.log('  No errors.');
  }
  console.log('');
}

if (result.globalIssues.length) {
  console.log('Global issues:');
  for (const issue of result.globalIssues) {
    console.log(`  - [${issue.code}] ${issue.message}`);
  }
}

process.exit(result.success ? 0 : 1);
