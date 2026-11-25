declare namespace Api {
  namespace UpstreamRisk {
    interface Query { from: string; to: string; userId?: string }
    interface Summary { total: number; success: number; failed: number; successRate: number; avgDurationMs: number }
    interface Breakdown { statusCode?: string; client?: string; count?: number; total?: number; success?: number; successRate?: number }
    interface Trend { time: string; total: number; success: number; successRate: number }
    interface Failure { createdAt: string; userId: string; client: string; statusCode: string; durationMs: number; error: string | null; requestId: string | null }
    interface Response {
      status: 'ok' | 'disabled' | 'down';
      summary: Summary;
      statusBreakdown: Breakdown[];
      clientBreakdown: Breakdown[];
      trend: Trend[];
      recentFailures: Failure[];
    }
  }
}
