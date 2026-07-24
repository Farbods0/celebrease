import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { createEmptyUsageData, SessionUsage, UsageData } from './types';

interface ConversationSummary {
    ID: string;
    Title: string;
    NumSteps: number;
    UpdatedAt: string;
}

interface ConversationMetadata {
    conversations: {
        [uuid: string]: {
            summary: ConversationSummary;
            last_modified_time: string;
        };
    };
}

export class AntigravityTracker {
    private context: vscode.ExtensionContext;
    private dataDir: string;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.dataDir = this.resolveDataDir();
    }

    private resolveDataDir(): string {
        const config = vscode.workspace.getConfiguration('aiTokenTracker');
        let dir = config.get<string>('antigravity.dataDir', '');
        if (!dir) {
            dir = path.join(os.homedir(), '.gemini', 'antigravity-cli');
        } else if (dir.startsWith('~')) {
            dir = path.join(os.homedir(), dir.slice(1));
        }
        return dir;
    }

    public async getUsageData(): Promise<UsageData> {
        const data = createEmptyUsageData();
        const config = vscode.workspace.getConfiguration('aiTokenTracker');
        data.budgetLimit = config.get<number>('antigravity.monthlyTokenBudget', 1000000);

        // Note: Antigravity CLI does not expose raw token counts locally.
        // It relies on Google Cloud Code APIs. We track usage based on session step counts
        // and provide an estimated token multiplier.
        const estimatedTokensPerStep = 2500; // rough average

        try {
            const metadataPath = path.join(this.dataDir, 'cache', 'conversation_metadata.json');
            if (fs.existsSync(metadataPath)) {
                const rawData = fs.readFileSync(metadataPath, 'utf8');
                const metadata: ConversationMetadata = JSON.parse(rawData);

                const now = new Date();
                const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

                for (const [uuid, conv] of Object.entries(metadata.conversations)) {
                    if (!conv.summary || !conv.summary.UpdatedAt) continue;

                    const updatedAt = new Date(conv.summary.UpdatedAt);
                    if (updatedAt < data.periodStart) continue; // Skip old sessions

                    const steps = conv.summary.NumSteps || 0;
                    const estimatedTokens = steps * estimatedTokensPerStep;

                    const session: SessionUsage = {
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

        } catch (error) {
            console.error('Error reading Antigravity data:', error);
            throw new Error('Failed to parse Antigravity local metadata');
        }

        data.lastRefreshed = new Date();
        return data;
    }
}
