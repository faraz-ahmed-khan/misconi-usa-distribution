import { requireAdminAuth } from '../../../../src/vault/auth.js';
import { ensureVaultEnv, errorResponse, jsonResponse } from '../../../../src/vault/api-helpers.js';
import { listPendingApprovals, readApprovalsStore } from '../../../../src/vault/approvals.js';

export const runtime = 'nodejs';

/**
 * GET /api/vault/approvals
 */
export async function GET(request) {
  ensureVaultEnv();
  const auth = requireAdminAuth(request);
  if (!auth.ok) {
    return errorResponse(auth.message, auth.status);
  }

  const url = new URL(request.url);
  const includeHistory = url.searchParams.get('history') === 'true';

  const pending = listPendingApprovals().map(summarizeApproval);
  const payload = { pending };

  if (includeHistory) {
    payload.history = readApprovalsStore().history.slice(0, 50).map(summarizeApproval);
  }

  return jsonResponse(payload);
}

/**
 * @param {import('../../../../src/vault/types.js').VaultApproval} approval
 */
function summarizeApproval(approval) {
  return {
    id: approval.id,
    status: approval.status,
    submittedAt: approval.submittedAt,
    source: approval.source,
    supplierCount: approval.supplierCount,
    productCount: approval.productCount,
    approvedAt: approval.approvedAt,
    approvedBy: approval.approvedBy,
    rejectedAt: approval.rejectedAt,
    rejectionReason: approval.rejectionReason,
    promotedAt: approval.promotedAt,
  };
}
