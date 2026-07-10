import { ensureVaultEnv, jsonResponse } from '../../../../src/vault/api-helpers.js';
import { readAuditEvents } from '../../../../src/vault/audit.js';
import { listPendingApprovals } from '../../../../src/vault/approvals.js';
import { getVaultStatus } from '../../../../src/vault/promote.js';
import { getVaultRoot } from '../../../../src/vault/config.js';

export const runtime = 'nodejs';

/**
 * GET /api/vault/status
 */
export async function GET() {
  ensureVaultEnv();
  const status = getVaultStatus();
  const pending = listPendingApprovals().map((approval) => ({
    id: approval.id,
    status: approval.status,
    submittedAt: approval.submittedAt,
    source: approval.source,
    supplierCount: approval.supplierCount,
    productCount: approval.productCount,
  }));

  return jsonResponse({
    ...status,
    vaultPath: getVaultRoot(),
    pendingApprovalsList: pending,
    recentAudit: readAuditEvents(20),
  });
}
