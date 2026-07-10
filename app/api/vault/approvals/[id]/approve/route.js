import { requireAdminAuth } from '../../../../../../src/vault/auth.js';
import { ensureVaultEnv, errorResponse, jsonResponse } from '../../../../../../src/vault/api-helpers.js';
import { approveAndPromote } from '../../../../../../src/vault/promote.js';

export const runtime = 'nodejs';

/**
 * POST /api/vault/approvals/{id}/approve
 */
export async function POST(request, { params }) {
  ensureVaultEnv();
  const auth = requireAdminAuth(request);
  if (!auth.ok) {
    return errorResponse(auth.message, auth.status);
  }

  const approvalId = (await params).id;
  let approvedBy = 'admin';

  try {
    const body = await request.json();
    if (body?.approvedBy) approvedBy = String(body.approvedBy);
  } catch {
    // optional body
  }

  const result = approveAndPromote(approvalId, { approvedBy });
  if (!result.ok) {
    return errorResponse(result.error, 400);
  }

  return jsonResponse({
    success: true,
    message: 'Approved and promoted to MPI Vault (staging)',
    approval: {
      id: result.approval.id,
      status: result.approval.status,
      promotedAt: result.approval.promotedAt,
    },
    manifest: result.manifest,
    supplierCount: result.supplierCount,
    productCount: result.productCount,
  });
}
