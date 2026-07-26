import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { createEmptyUsageData, SessionUsage, UsageData } from './types';

interface ConversationSummary {
    ID?: string;
    Title?: string;
    Preview?: string;
    NumSteps?: number;
    Loaded?: boolean;
    UpdatedAt?: string;
}

interface ConversationMetadata {
    conversations?: {
        [uuid: string]: {
            summary?: ConversationSummary;
            last_modified_time?: string;
        };
    };
}

export class AntigravityTracker {
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    private resolveDataDirs(): string[] {
        const config = vscode.workspace.getConfiguration('aiTokenTracker');
        let userDir = config.get<string>('antigravity.dataDir', '');
        
        if (userDir && typeof userDir === 'string') {
            if (userDir.startsWith('~')) {
                userDir = path.join(os.homedir(), userDir.slice(1));
            }
            return [userDir];
        }

        // Scan all antigravity-* directories in ~/.gemini
        const geminiDir = path.join(os.homedir(), '.gemini');
        const foundDirs: string[] = [];
        
        if (fs.existsSync(geminiDir)) {
            try {
                const entries = fs.readdirSync(geminiDir, { withFileTypes: true });
                for (const entry of entries) {
                    if (entry.isDirectory() && entry.name.startsWith('antigravity-')) {
                        foundDirs.push(path.join(geminiDir, entry.name));
                    }
                }
            } catch (e) {
                console.error('Error scanning ~/.gemini directory:', e);
            }
        }

        if (foundDirs.length === 0) {
            foundDirs.push(path.join(os.homedir(), '.gemini', 'antigravity-cli'));
            foundDirs.push(path.join(os.homedir(), '.gemini', 'antigravity-ide'));
        }

        return foundDirs;
    }

    private parseDate(dateStr?: string, fallback?: Date): Date {
        if (!dateStr) return fallback || new Date();
        
        // Fix potential missing 'T' in ISO string e.g. "2026-07-2609:38:16..." -> "2026-07-26T09:38:16..."
        let sanitized = dateStr;
        if (/^\d{4}-\d{2}-\d{2}\d{2}:/.test(sanitized)) {
            sanitized = sanitized.slice(0, 10) + 'T' + sanitized.slice(10);
        }

        const d = new Date(sanitized);
        if (isNaN(d.getTime())) {
            return fallback || new Date();
        }
        return d;
    }

    private extractPromptFromTranscript(transcriptPath: string): { stepCount: number; prompt?: string } {
        try {
            if (!fs.existsSync(transcriptPath)) {
                return { stepCount: 0 };
            }
            const content = fs.readFileSync(transcriptPath, 'utf8');
            const lines = content.split('\n').filter(line => line.trim().length > 0);
            
            let prompt: string | undefined;
            for (const line of lines) {
                try {
                    const parsed = JSON.parse(line);
                    if (parsed.type === 'USER_INPUT' && parsed.content) {
                        const match = parsed.content.match(/<USER_REQUEST>([\s\S]*?)<\/USER_REQUEST>/);
                        let rawPrompt = match ? match[1].trim() : parsed.content;
                        // Clean up tag markers
                        rawPrompt = rawPrompt.replace(/<[\s\S]*?>/g, '').trim();
                        if (rawPrompt) {
                            prompt = rawPrompt.length > 50 ? rawPrompt.slice(0, 47) + '...' : rawPrompt;
                            break;
                        }
                    }
                } catch (e) {
                    // Ignore line parse errors
                }
            }
            return { stepCount: lines.length, prompt };
        } catch (e) {
            return { stepCount: 0 };
        }
    }

    public async getUsageData(): Promise<UsageData> {
        const data = createEmptyUsageData();
        const config = vscode.workspace.getConfiguration('aiTokenTracker');
        data.budgetLimit = config.get<number>('antigravity.monthlyTokenBudget', 1000000);

        const estimatedTokensPerStep = 2500;
        const dataDirs = this.resolveDataDirs();

        const sessionsByUuid = new Map<string, SessionUsage>();

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        for (const dataDir of dataDirs) {
            // 1. Scan metadata file if it exists
            const metadataPath = path.join(dataDir, 'cache', 'conversation_metadata.json');
            if (fs.existsSync(metadataPath)) {
                try {
                    const rawData = fs.readFileSync(metadataPath, 'utf8');
                    const metadata: ConversationMetadata = JSON.parse(rawData);

                    if (metadata.conversations) {
                        for (const [uuid, conv] of Object.entries(metadata.conversations)) {
                            const summary = conv.summary || {};
                            const updatedAt = this.parseDate(summary.UpdatedAt || conv.last_modified_time);

                            const steps = summary.NumSteps || 0;
                            const title = summary.Title || summary.Preview || 'Untitled Session';

                            sessionsByUuid.set(uuid, {
                                id: uuid,
                                name: title,
                                inputTokens: 0,
                                outputTokens: 0,
                                totalTokens: 0,
                                estimatedCost: 0,
                                timestamp: updatedAt,
                                model: 'Gemini (Antigravity)',
                                stepCount: steps
                            });
                        }
                    }
                } catch (e) {
                    console.error(`Error reading metadata from ${metadataPath}:`, e);
                }
            }

            // 2. Scan brain directory for sessions
            const brainDir = path.join(dataDir, 'brain');
            if (fs.existsSync(brainDir)) {
                try {
                    const sessionFolders = fs.readdirSync(brainDir, { withFileTypes: true });
                    for (const folder of sessionFolders) {
                        if (!folder.isDirectory()) continue;
                        const uuid = folder.name;
                        
                        // Ignore non-session system directories
                        if (uuid === 'tempmediaStorage' || uuid.startsWith('.')) continue;

                        const transcriptPath = path.join(brainDir, uuid, '.system_generated', 'logs', 'transcript.jsonl');
                        if (fs.existsSync(transcriptPath)) {
                            const stat = fs.statSync(transcriptPath);
                            const { stepCount, prompt } = this.extractPromptFromTranscript(transcriptPath);

                            const existing = sessionsByUuid.get(uuid);
                            if (existing) {
                                existing.stepCount = Math.max(existing.stepCount, stepCount);
                                if (existing.name === 'Untitled Session' && prompt) {
                                    existing.name = prompt;
                                }
                                if (stat.mtime > existing.timestamp) {
                                    existing.timestamp = stat.mtime;
                                }
                            } else {
                                sessionsByUuid.set(uuid, {
                                    id: uuid,
                                    name: prompt || 'Untitled Session',
                                    inputTokens: 0,
                                    outputTokens: 0,
                                    totalTokens: 0,
                                    estimatedCost: 0,
                                    timestamp: stat.mtime,
                                    model: 'Gemini (Antigravity)',
                                    stepCount: stepCount
                                });
                            }
                        }
                    }
                } catch (e) {
                    console.error(`Error scanning brain directory ${brainDir}:`, e);
                }
            }
        }

        // Process all collected sessions
        for (const session of sessionsByUuid.values()) {
            if (session.timestamp < data.periodStart) continue; // Skip sessions older than start of month

            const estimatedTokens = session.stepCount * estimatedTokensPerStep;
            session.totalTokens = estimatedTokens;
            session.inputTokens = Math.floor(estimatedTokens * 0.8);
            session.outputTokens = Math.floor(estimatedTokens * 0.2);

            data.sessions.push(session);
            data.totalTokens += estimatedTokens;
            data.totalSessions++;

            if (session.timestamp >= startOfDay) {
                data.sessionsToday++;
            }
        }

        // Sort sessions by timestamp descending
        data.sessions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        data.lastRefreshed = new Date();
        return data;
    }
}
