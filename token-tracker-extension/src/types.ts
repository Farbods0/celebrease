export interface UsageData {
    /** Total tokens used (input + output) */
    totalTokens: number;
    /** Input tokens used */
    inputTokens: number;
    /** Output tokens used */
    outputTokens: number;
    /** Cache read tokens (if applicable) */
    cacheReadTokens: number;
    /** Cache write tokens (if applicable) */
    cacheWriteTokens: number;
    /** Budget limit in tokens (0 if no limit set) */
    budgetLimit: number;
    /** Estimated cost in USD */
    estimatedCost: number;
    /** Number of sessions/conversations today */
    sessionsToday: number;
    /** Total sessions/conversations this period */
    totalSessions: number;
    /** Per-session breakdown */
    sessions: SessionUsage[];
    /** Per-model breakdown */
    modelBreakdown: ModelUsage[];
    /** Period start date */
    periodStart: Date;
    /** Period end date */
    periodEnd: Date;
    /** Last refreshed timestamp */
    lastRefreshed: Date;
}

export interface SessionUsage {
    id: string;
    name: string;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    estimatedCost: number;
    timestamp: Date;
    model: string;
    stepCount: number;
}

export interface ModelUsage {
    model: string;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    estimatedCost: number;
    requestCount: number;
}

export interface TranscriptStep {
    step_index?: number;
    source?: string;
    type?: string;
    status?: string;
    content?: string;
    model?: string;
    usage?: {
        input_tokens?: number;
        output_tokens?: number;
        cache_read_input_tokens?: number;
        cache_creation_input_tokens?: number;
    };
    tool_calls?: Array<{
        name?: string;
        arguments?: Record<string, unknown>;
    }>;
    timestamp?: string;
}

/** Pricing per 1M tokens in USD */
export const PRICING: Record<string, { input: number; output: number }> = {
    // Gemini models (Antigravity)
    'gemini-2.5-pro': { input: 1.25, output: 10.00 },
    'gemini-2.5-flash': { input: 0.15, output: 0.60 },
    'gemini-2.0-flash': { input: 0.10, output: 0.40 },
    'gemini-2.0-pro': { input: 1.25, output: 5.00 },
    'gemini-1.5-pro': { input: 1.25, output: 5.00 },
    'gemini-1.5-flash': { input: 0.075, output: 0.30 },
    // Claude models
    'claude-opus-4': { input: 15.00, output: 75.00 },
    'claude-sonnet-4': { input: 3.00, output: 15.00 },
    'claude-3.5-sonnet': { input: 3.00, output: 15.00 },
    'claude-3.5-haiku': { input: 0.80, output: 4.00 },
    'claude-3-opus': { input: 15.00, output: 75.00 },
    'claude-3-sonnet': { input: 3.00, output: 15.00 },
    'claude-3-haiku': { input: 0.25, output: 1.25 },
};

export function estimateCost(
    model: string,
    inputTokens: number,
    outputTokens: number
): number {
    // Try exact match first, then partial match
    let pricing = PRICING[model];
    if (!pricing) {
        const key = Object.keys(PRICING).find((k) =>
            model.toLowerCase().includes(k.toLowerCase())
        );
        pricing = key ? PRICING[key] : { input: 1.0, output: 3.0 }; // default estimate
    }
    return (
        (inputTokens / 1_000_000) * pricing.input +
        (outputTokens / 1_000_000) * pricing.output
    );
}

export function createEmptyUsageData(): UsageData {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
        totalTokens: 0,
        inputTokens: 0,
        outputTokens: 0,
        cacheReadTokens: 0,
        cacheWriteTokens: 0,
        budgetLimit: 0,
        estimatedCost: 0,
        sessionsToday: 0,
        totalSessions: 0,
        sessions: [],
        modelBreakdown: [],
        periodStart: startOfMonth,
        periodEnd: now,
        lastRefreshed: now,
    };
}
