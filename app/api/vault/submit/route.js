import { requireAdminAuth } from '../../../../src/vault/auth.js';
import { ensureVaultEnv, errorResponse, jsonResponse } from '../../../../src/vault/api-helpers.js';
import { submitIntakeForApproval } from '../../../../src/vault/promote.js';

export const runtime = 'nodejs';

/**
 * POST /api/vault/submit
 * Runs intake validation and queues a manual approval (no vault write).
 * Query: ?seed=true
 */
export async function POST(request) {
  ensureVaultEnv();
  const auth = requireAdminAuth(request);
  if (!auth.ok) {
    return errorResponse(auth.message, auth.status);
  }

  const url = new URL(request.url);
  const useSeed = url.searchParams.get('seed') === 'true';

  const result = submitIntakeForApproval({ useSeed });
  if (!result.ok) {
    return jsonResponse(
      {
        success: false,
        error: result.error,
        intake: {
          success: result.intake.success,
          source: result.intake.source,
          ranAt: result.intake.ranAt,
        },
      },
      422
    );
  }

  return jsonResponse({
    success: true,
    message: 'Intake submitted for manual approval',
    approval: {
      id: result.approval.id,
      status: result.approval.status,
      submittedAt: result.approval.submittedAt,
      source: result.approval.source,
      supplierCount: result.approval.supplierCount,
      productCount: result.approval.productCount,
    },
  });
}

/**
 * GET /api/vault/submit — convenience for CLI/browser testing (admin token required)
 */
export async function GET(request) {
  return POST(request);
}
