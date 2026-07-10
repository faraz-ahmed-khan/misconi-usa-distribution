import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from '../src/intake/utils/load-env.js';
import { readXlsxSheet, listXlsxSheets } from '../src/intake/utils/read-xlsx.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
loadEnv(path.join(root, '.env'));
const dir = process.env.MSI_MPI_HANDOFF_DIR;
const mpi = path.join(dir, 'Master Product Intake (MPI) - TO ZOHO.xlsx');

const rows = readXlsxSheet(mpi, 'MPI');
const header = rows[0];
console.log('MPI header keys:', Object.keys(header).length);
console.log('Sample keys:', Object.keys(header).slice(0, 30).join(', '));

// Find section header rows
for (let i = 0; i < rows.length; i++) {
  const vals = Object.values(rows[i]).join(' ');
  if (/Pack|Classification|Specification|REG|SKU|MSI/i.test(vals)) {
    console.log(`Row ${i}:`, JSON.stringify(rows[i]).slice(0, 300));
  }
}

// Count data rows with UBID
const dataRows = rows.filter((r) => /^\d{7,}$/.test(String(r['1'] || '')));
console.log('\nData rows with numeric UBID:', dataRows.length);
console.log('Last data row MPI_ID:', dataRows[dataRows.length - 1]?.['Keys & Linkage']);

// Unique MSI from MPI_ID prefix
const mpiIds = dataRows.map((r) => r['Keys & Linkage']).filter(Boolean);
const suppliers = new Set(mpiIds.map((id) => id.match(/MPI-(\d+)/)?.[1]).filter(Boolean));
console.log('Supplier prefixes in MPI:', [...suppliers]);
