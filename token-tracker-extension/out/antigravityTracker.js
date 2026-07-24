"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntigravityTracker = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const types_1 = require("./types");
class AntigravityTracker {
    constructor(context) {
        this.context = context;
        this.dataDir = this.resolveDataDir();
    }
    resolveDataDir() {
        const config = vscode.workspace.getConfiguration('aiTokenTracker');
        let dir = config.get('antigravity.dataDir', '');
        if (!dir) {
            dir = path.join(os.homedir(), '.gemini', 'antigravity-cli');
        }
        else if (dir.startsWith('~')) {
            dir = path.join(os.homedir(), dir.slice(1));
        }
        return dir;
    }
    async getUsageData() {
        const data = (0, types_1.createEmptyUsageData)();
        const config = vscode.workspace.getConfiguration('aiTokenTracker');
        data.budgetLimit = config.get('antigravity.monthlyTokenBudget', 1000000);
        // Note: Antigravity CLI does not expose raw token counts locally.
        // It relies on Google Cloud Code APIs. We track usage based on session step counts
        // and provide an estimated token multiplier.
        const estimatedTokensPerStep = 2500; // rough average
        try {
            const metadataPath = path.join(this.dataDir, 'cache', 'conversation_metadata.json');
            if (fs.existsSync(metadataPath)) {
                const rawData = fs.readFileSync(metadataPath, 'utf8');
                const metadata = JSON.parse(rawData);
                const now = new Date();
                const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                for (const [uuid, conv] of Object.entries(metadata.conversations)) {
                    if (!conv.summary || !conv.summary.UpdatedAt)
                        continue;
                    const updatedAt = new Date(conv.summary.UpdatedAt);
                    if (updatedAt < data.periodStart)
                        continue; // Skip old sessions
                    const steps = conv.summary.NumSteps || 0;
                    const estimatedTokens = steps * estimatedTokensPerStep;
                    const session = {
                        id: uuid,
                        name: conv.summary.Title || 'Untitled Session',
                        inputTokens: Math.floor(estimatedTokens * 0.8),
                        outputTokens: Math.floor(estimatedTokens * 0.2),
                        totalTokens: estimatedTokens,
                        estimatedCost: 0, // Included in Gemini Pro subscription
                        timestamp: updatedAt,
                        model: 'Gemini (Antigravity)',
                        stepCount: steps
                    };
                    data.sessions.push(session);
                    data.totalTokens += estimatedTokens;
                    data.totalSessions++;
                    if (updatedAt >= startOfDay) {
                        data.sessionsToday++;
                    }
                }
            }
            // Sort sessions by recent
            data.sessions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        }
        catch (error) {
            console.error('Error reading Antigravity data:', error);
            throw new Error('Failed to parse Antigravity local metadata');
        }
        data.lastRefreshed = new Date();
        return data;
    }
}
exports.AntigravityTracker = AntigravityTracker;
//# sourceMappingURL=antigravityTracker.js.map