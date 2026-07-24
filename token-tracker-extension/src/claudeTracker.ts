import * as vscode from 'vscode';
import * as https from 'https';
import { createEmptyUsageData, estimateCost, UsageData, ModelUsage } from './types';

export class ClaudeTracker {
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    public async getUsageData(): Promise<UsageData> {
        const data = createEmptyUsageData();
        const apiKey = await this.context.secrets.get('claude-admin-api-key');

        if (!apiKey) {
            // Return empty data if no key is set yet
            return data;
        }

        try {
            // Fetch usage from Anthropic's Admin API
            // Note: requires an Admin API key (sk-ant-admin-...)
            const now = new Date();
            const startDate = data.periodStart.toISOString().split('T')[0];
            const endDate = now.toISOString().split('T')[0];

            const response = await this.fetchAnthropicUsage(apiKey, startDate, endDate);
            
            if (response && response.data) {
                for (const item of response.data) {
                    // item might look like: { type: "usage", date: "2024-03-01", model: "claude-3-opus", input_tokens: 100, output_tokens: 50, ... }
                    const modelName = item.model || 'unknown';
                    const input = item.input_tokens || 0;
                    const output = item.output_tokens || 0;
                    const cacheRead = item.cache_read_input_tokens || 0;
                    const cacheWrite = item.cache_creation_input_tokens || 0;
                    const cost = estimateCost(modelName, input, output);

                    data.inputTokens += input;
                    data.outputTokens += output;
                    data.cacheReadTokens += cacheRead;
                    data.cacheWriteTokens += cacheWrite;
                    data.totalTokens += (input + output);
                    data.estimatedCost += cost;

                    // Update model breakdown
                    let modelUsage = data.modelBreakdown.find(m => m.model === modelName);
                    if (!modelUsage) {
                        modelUsage = {
                            model: modelName,
                            inputTokens: 0,
                            outputTokens: 0,
                            totalTokens: 0,
                            estimatedCost: 0,
                            requestCount: 0
                        };
                        data.modelBreakdown.push(modelUsage);
                    }
                    modelUsage.inputTokens += input;
                    modelUsage.outputTokens += output;
                    modelUsage.totalTokens += (input + output);
                    modelUsage.estimatedCost += cost;
                    modelUsage.requestCount += 1;
                }
            }

            // In a real application, you might also track local sessions for Claude if they are initiated from VS Code.
            // For now, we rely on the global API usage.
            data.sessionsToday = response.data?.filter((d: any) => d.date === endDate).length || 0;

        } catch (error) {
            console.error('Error fetching Claude usage:', error);
            throw new Error('Failed to fetch Claude usage via Admin API');
        }

        data.lastRefreshed = new Date();
        return data;
    }

    private fetchAnthropicUsage(apiKey: string, startDate: string, endDate: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'api.anthropic.com',
                port: 443,
                path: `/v1/organizations/usage?start_date=${startDate}&end_date=${endDate}`,
                method: 'GET',
                headers: {
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'Content-Type': 'application/json'
                }
            };

            const req = https.request(options, (res) => {
                let body = '';
                res.on('data', (chunk) => body += chunk);
                res.on('end', () => {
                    if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                        try {
                            resolve(JSON.parse(body));
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        reject(new Error(`Anthropic API Error: ${res.statusCode} ${body}`));
                    }
                });
            });

            req.on('error', (e) => reject(e));
            req.end();
        });
    }
}
