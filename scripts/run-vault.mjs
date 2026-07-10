#!/usr/bin/env node
/**
 * MPI Vault CLI — submit, approve, promote, status
 *
 * Usage:
 *   node scripts/run-vault.mjs status
 *   node scripts/run-vault.mjs submit [--seed]
 *   node scripts/run-vault.mjs approve <approvalId> [--by name]
 *   node scripts/run-vault.mjs reject <approvalId> [--reason text]
 *   node scripts/run-vault.mjs promote [--seed]   # submit + approve in one step (staging)
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from '../src/intake/utils/load-env.js';
import {
  approveAndPromote,
  getVaultStatus,
  rejectApproval,
  submitIntakeForApproval,
} from '../src/vault/promote.js';
import { listPendingApprovals } from '../src/vault/approvals.js';
import { readAuditEvents } from '../src/vault/audit.js';
import { getVaultRoot } from '../src/vault/config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
process.chdir(projectRoot);
loadEnv(path.join(projectRoot, '.env'));

const args = process.argv.slice(2);
const command = args[0] || 'status';
const useSeed = args.includes('--seed');

function getFlag(name) {
  const idx = args.indexOf(name);
  if (idx === -1 || idx + 1 >= args.length) return undefined;
  return args[idx + 1];
}

function printStatus() {
  const status = getVaultStatus();
  console.log('\n=== MPI Vault (staging) ===');
  console.log(`Path: ${getVaultRoot()}`);
  console.log(`Vault ready: ${status.vaultReady ? 'yes' : 'no'}`);
  if (status.manifest) {
    console.log(`Version: ${status.manifest.vaultVersion}`);
    console.log(`Last promoted: ${status.manifest.lastPromotedAt}`);
    console.log(`Source: ${status.manifest.source}`);
    console.log(`Suppliers: ${status.manifest.supplierCount}`);
    console.log(`Products: ${status.manifest.productCount}`);
  }
  console.log(`Pending approvals: ${status.pendingApprovals}`);

  const pending = listPendingApprovals();
  if (pending.length) {
    console.log('\nPending:');
    for (const item of pending) {
      console.log(`  - ${item.id} (${item.productCount} products, ${item.source})`);
    }
  }

  const audit = readAuditEvents(5);
  if (audit.length) {
    console.log('\nRecent audit:');
    for (const event of audit) {
      console.log(`  - ${event.at} ${event.action} ${event.approvalId || ''}`);
    }
  }
  console.log('');
}

switch (command) {
  case 'status':
    printStatus();
    break;

  case 'submit': {
    const result = submitIntakeForApproval({ useSeed });
    if (!result.ok) {
      console.error(`Submit failed: ${result.error}`);
      process.exit(1);
    }
    console.log(`Queued approval ${result.approval.id}`);
    console.log(`  Source: ${result.approval.source}`);
    console.log(`  Products: ${result.approval.productCount}`);
    break;
  }

  case 'approve': {
    const approvalId = args[1];
    if (!approvalId || approvalId.startsWith('--')) {
      console.error('Usage: node scripts/run-vault.mjs approve <approvalId> [--by name]');
      process.exit(1);
    }
    const result = approveAndPromote(approvalId, { approvedBy: getFlag('--by') || 'cli' });
    if (!result.ok) {
      console.error(`Approve failed: ${result.error}`);
      process.exit(1);
    }
    console.log(`Promoted vault v${result.manifest.vaultVersion}`);
    console.log(`  Products: ${result.productCount}`);
    console.log(`  Suppliers: ${result.supplierCount}`);
    break;
  }

  case 'reject': {
    const approvalId = args[1];
    if (!approvalId || approvalId.startsWith('--')) {
      console.error('Usage: node scripts/run-vault.mjs reject <approvalId> [--reason text]');
      process.exit(1);
    }
    const result = rejectApproval(approvalId, {
      rejectedBy: getFlag('--by') || 'cli',
      reason: getFlag('--reason') || 'Rejected via CLI',
    });
    if (!result.ok) {
      console.error(`Reject failed: ${result.error}`);
      process.exit(1);
    }
    console.log(`Rejected ${approvalId}`);
    break;
  }

  case 'promote': {
    const submit = submitIntakeForApproval({ useSeed });
    if (!submit.ok) {
      console.error(`Validation failed: ${submit.error}`);
      process.exit(1);
    }
    console.log(`Validated — approval ${submit.approval.id}`);
    const promoted = approveAndPromote(submit.approval.id, { approvedBy: 'cli-promote' });
    if (!promoted.ok) {
      console.error(`Promote failed: ${promoted.error}`);
      process.exit(1);
    }
    console.log(`Vault v${promoted.manifest.vaultVersion} ready (${promoted.productCount} products)`);
    break;
  }

  default:
    console.error(`Unknown command: ${command}`);
    console.error('Commands: status | submit | approve | reject | promote');
    process.exit(1);
}
