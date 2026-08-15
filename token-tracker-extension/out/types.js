"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRICING = void 0;
exports.estimateCost = estimateCost;
exports.createEmptyUsageData = createEmptyUsageData;
/** Pricing per 1M tokens in USD */
exports.PRICING = {
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
function estimateCost(model, inputTokens, outputTokens) {
    // Try exact match first, then partial match
    let pricing = exports.PRICING[model];
    if (!pricing) {
        const key = Object.keys(exports.PRICING).find((k) => model.toLowerCase().includes(k.toLowerCase()));
        pricing = key ? exports.PRICING[key] : { input: 1.0, output: 3.0 }; // default estimate
    }
    return ((inputTokens / 1000000) * pricing.input +
        (outputTokens / 1000000) * pricing.output);
}
function createEmptyUsageData() {
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
//# sourceMappingURL=types.js.map
