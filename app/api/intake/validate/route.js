import { runIntakePipeline } from '../../../../src/intake/pipeline.js';
import { loadEnv } from '../../../../src/intake/utils/load-env.js';
import path from 'node:path';

export const runtime = 'nodejs';

loadEnv(path.resolve(process.cwd(), '.env'));

/**
 * POST /api/intake/validate
 * Runs MSI load + MPI ingest validation + MMI sequence (steps 1–4).
 * Query: ?seed=true to force Regalia seed dataset
 */
export async function POST(request) {
  try {
    const url = new URL(request.url);
    const useSeed = url.searchParams.get('seed') === 'true';

    const result = runIntakePipeline({ useSeed });

    const summary = Object.fromEntries(
      Object.entries(result.validationBySupplier).map(([msiId, v]) => [
        msiId,
        {
          passed: v.passed,
          checks: v.checks,
          counts: v.counts,
          errorCount: v.issues.filter((i) => i.severity === 'error').length,
          issues: v.issues.slice(0, 50),
        },
      ])
    );

    return Response.json({
      success: result.success,
      ranAt: result.ranAt,
      source: result.source,
      supplierCount: result.msiSuppliers.length,
      validation: summary,
      globalIssues: result.globalIssues,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Validation failed',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/intake/validate — same as POST for easy browser testing
 */
export async function GET(request) {
  return POST(request);
}
