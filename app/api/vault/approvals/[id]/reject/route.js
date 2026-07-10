import { requireAdminAuth } from '../../../../../../src/vault/auth.js';
import { ensureVaultEnv, errorResponse, jsonResponse } from '../../../../../../src/vault/api-helpers.js';
import { rejectApproval } from '../../../../../../src/vault/promote.js';

export const runtime = 'nodejs';

/**
 * POST /api/vault/approvals/{id}/reject
 */
export async function POST(request, { params }) {
  ensureVaultEnv();
  const auth = requireAdminAuth(request);
  if (!auth.ok) {
    return errorResponse(auth.message, auth.status);
  }

  const approvalId = (await params).id;
  let rejectedBy = 'admin';
  let reason = 'Rejected by reviewer';

  try {
    const body = await request.json();
    if (body?.rejectedBy) rejectedBy = String(body.rejectedBy);
    if (body?.reason) reason = String(body.reason);
  } catch {
    // optional body
  }

  const result = rejectApproval(approvalId, { rejectedBy, reason });
  if (!result.ok) {
    return errorResponse(result.error, 400);
  }

  return jsonResponse({
    success: true,
    approval: {
      id: result.approval.id,
      status: result.approval.status,
      rejectedAt: result.approval.rejectedAt,
      rejectionReason: result.approval.rejectionReason,
    },
  });
}
