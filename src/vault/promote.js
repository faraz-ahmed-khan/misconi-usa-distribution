import { runIntakePipeline } from '../intake/pipeline.js';
import { appendAuditEvent } from './audit.js';
import { createApprovalId, findApproval, listPendingApprovals, saveApproval } from './approvals.js';
import { buildIndexes, buildVaultRecordsForSupplier, regFamilyLabel } from './build-records.js';
import { VAULT_ENV } from './config.js';
import { readManifest, vaultExists, writeVaultSnapshot } from './store.js';

/**
 * @param {import('../intake/types.js').IntakePipelineResult} intake
 * @returns {{ supplierCount: number, productCount: number }}
 */
function countIntakeRows(intake) {
  let productCount = 0;
  for (const msi of intake.msiSuppliers) {
    const packs = intake.mpiBySupplier[msi.msiId];
    if (packs) productCount += packs.pack1.length;
  }
  return { supplierCount: intake.msiSuppliers.length, productCount };
}

/**
 * Submit a validated intake run for manual approval (no vault write).
 * @param {{ useSeed?: boolean, intake?: import('../intake/types.js').IntakePipelineResult }} [options]
 */
export function submitIntakeForApproval(options = {}) {
  const intake = options.intake || runIntakePipeline({ useSeed: options.useSeed });
  const counts = countIntakeRows(intake);

  if (!intake.success) {
    return {
      ok: false,
      error: 'Intake validation failed — fix MMI issues before submitting for vault approval',
      intake,
    };
  }

  const approval = {
    id: createApprovalId(),
    status: /** @type {const} */ ('pending'),
    submittedAt: new Date().toISOString(),
    source: intake.source,
    validationPassed: true,
    supplierCount: counts.supplierCount,
    productCount: counts.productCount,
    snapshotMsi: intake.msiSuppliers,
    snapshotMpi: intake.mpiBySupplier,
  };

  saveApproval(approval);
  appendAuditEvent({
    at: approval.submittedAt,
    action: 'approval_submitted',
    approvalId: approval.id,
    details: {
      source: intake.source,
      supplierCount: counts.supplierCount,
      productCount: counts.productCount,
    },
  });

  return { ok: true, approval, intake };
}

/**
 * Promote an approved snapshot into the MPI Vault (staging).
 * @param {string} approvalId
 * @param {{ approvedBy?: string }} [options]
 */
export function approveAndPromote(approvalId, options = {}) {
  const approval = findApproval(approvalId);
  if (!approval) {
    return { ok: false, error: `Approval ${approvalId} not found` };
  }

  if (approval.status !== 'pending') {
    return { ok: false, error: `Approval ${approvalId} is ${approval.status}, not pending` };
  }

  const promotedAt = new Date().toISOString();
  const previous = readManifest();
  const vaultVersion = (previous?.vaultVersion || 0) + 1;

  /** @type {import('./types.js').VaultSupplier[]} */
  const suppliers = [];
  /** @type {import('./types.js').VaultProduct[]} */
  const products = [];

  for (const msi of approval.snapshotMsi) {
    const packs = approval.snapshotMpi[msi.msiId];
    if (!packs) {
      return { ok: false, error: `Snapshot missing MPI packs for supplier ${msi.msiId}` };
    }

    const built = buildVaultRecordsForSupplier(msi, packs, {
      source: approval.source,
      promotedAt,
      vaultVersion,
    });
    suppliers.push(built.supplier);
    products.push(...built.products);
  }

  const indexes = buildIndexes(products);
  const manifest = {
    environment: VAULT_ENV,
    vaultVersion,
    lastPromotedAt: promotedAt,
    source: approval.source,
    supplierCount: suppliers.length,
    productCount: products.length,
    lastApprovalId: approvalId,
  };

  writeVaultSnapshot({ suppliers, products, indexes, manifest });

  approval.status = 'promoted';
  approval.approvedAt = promotedAt;
  approval.approvedBy = options.approvedBy || 'admin';
  approval.promotedAt = promotedAt;
  saveApproval(approval);

  appendAuditEvent({
    at: promotedAt,
    action: 'vault_promoted',
    approvalId,
    actor: options.approvedBy || 'admin',
    details: {
      vaultVersion,
      supplierCount: suppliers.length,
      productCount: products.length,
      source: approval.source,
    },
  });

  return {
    ok: true,
    approval,
    manifest,
    supplierCount: suppliers.length,
    productCount: products.length,
  };
}

/**
 * @param {string} approvalId
 * @param {{ rejectedBy?: string, reason?: string }} [options]
 */
export function rejectApproval(approvalId, options = {}) {
  const approval = findApproval(approvalId);
  if (!approval) {
    return { ok: false, error: `Approval ${approvalId} not found` };
  }

  if (approval.status !== 'pending') {
    return { ok: false, error: `Approval ${approvalId} is ${approval.status}, not pending` };
  }

  const rejectedAt = new Date().toISOString();
  approval.status = 'rejected';
  approval.rejectedAt = rejectedAt;
  approval.rejectedBy = options.rejectedBy || 'admin';
  approval.rejectionReason = options.reason || 'Rejected by reviewer';
  saveApproval(approval);

  appendAuditEvent({
    at: rejectedAt,
    action: 'approval_rejected',
    approvalId,
    actor: options.rejectedBy || 'admin',
    details: { reason: approval.rejectionReason },
  });

  return { ok: true, approval };
}

/**
 * @returns {{ vaultReady: boolean, manifest: import('./types.js').VaultManifest | null, pendingApprovals: number }}
 */
export function getVaultStatus() {
  return {
    vaultReady: vaultExists(),
    manifest: readManifest(),
    pendingApprovals: listPendingApprovals().length,
  };
}

export { regFamilyLabel };
