import * as vscode from 'vscode';
import { AntigravityTracker } from './antigravityTracker';
import { ClaudeTracker } from './claudeTracker';
import { UsageData } from './types';

export class DashboardPanel {
    public static currentPanel: DashboardPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    private constructor(
        panel: vscode.WebviewPanel,
        extensionUri: vscode.Uri,
        private antigravityTracker: AntigravityTracker,
        private claudeTracker: ClaudeTracker
    ) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        this.update();
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(
            async (message) => {
                switch (message.command) {
                    case 'refresh':
                        await this.update();
                        return;
                    case 'setApiKey':
                        vscode.commands.executeCommand('aiTokenTracker.setClaudeApiKey');
                        return;
                }
            },
            null,
            this._disposables
        );
    }

    public static createOrShow(
        context: vscode.ExtensionContext,
        antigravityTracker: AntigravityTracker,
        claudeTracker: ClaudeTracker
    ) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (DashboardPanel.currentPanel) {
            DashboardPanel.currentPanel._panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'aiTokenTracker',
            'AI Token Dashboard',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
            }
        );

        DashboardPanel.currentPanel = new DashboardPanel(
            panel,
            context.extensionUri,
            antigravityTracker,
            claudeTracker
        );
    }

    public static async updateIfVisible(
        antigravityTracker: AntigravityTracker,
        claudeTracker: ClaudeTracker
    ) {
        if (this.currentPanel && this.currentPanel._panel.visible) {
            await this.currentPanel.update();
        }
    }

    public async update() {
        try {
            const agyData = await this.antigravityTracker.getUsageData();
            const claudeData = await this.claudeTracker.getUsageData();
            this._panel.webview.html = this._getHtmlForWebview(this._panel.webview, agyData, claudeData);
        } catch (e) {
            this._panel.webview.html = `<h1>Error Loading Data</h1><p>${String(e)}</p>`;
        }
    }

    public dispose() {
        DashboardPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview, agyData: UsageData, claudeData: UsageData) {
        const formatNum = (num: number) => num.toLocaleString();
        
        // Calculate percentages
        const agyPct = agyData.budgetLimit > 0 
            ? Math.min(100, (agyData.totalTokens / agyData.budgetLimit) * 100).toFixed(1) 
            : '0';
        
        const config = vscode.workspace.getConfiguration('aiTokenTracker');
        const claudeBudget = config.get<number>('claude.monthlyBudget', 100);
        const claudePct = claudeBudget > 0 
            ? Math.min(100, (claudeData.estimatedCost / claudeBudget) * 100).toFixed(1) 
            : '0';

        let agySessionsHtml = '';
        for (const s of agyData.sessions.slice(0, 5)) {
            const name = s.name.length > 30 ? s.name.substring(0, 30) + '...' : s.name;
            agySessionsHtml += `<tr>
                <td>${name}</td>
                <td>${s.stepCount}</td>
                <td>${formatNum(s.totalTokens)}</td>
            </tr>`;
        }

        let claudeModelsHtml = '';
        for (const m of claudeData.modelBreakdown) {
            claudeModelsHtml += `<tr>
                <td>${m.model}</td>
                <td>$${m.estimatedCost.toFixed(2)}</td>
                <td>${formatNum(m.totalTokens)}</td>
            </tr>`;
        }

        let claudeDataWarning = '';
        if (claudeData.totalTokens === 0) {
            claudeDataWarning = `
                <div style="background: var(--vscode-editorInfo-background); padding: 15px; border-radius: 5px; margin-top: 20px;">
                    <strong>No data found.</strong> Make sure you have set your Claude Admin API Key.
                    <br><br>
                    <button onclick="vscode.postMessage({command: 'setApiKey'})">Set API Key</button>
                </div>
            `;
        }

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>AI Token Dashboard</title>
                <style>
                    body {
                        font-family: var(--vscode-font-family);
                        color: var(--vscode-editor-foreground);
                        padding: 20px;
                        max-width: 1000px;
                        margin: 0 auto;
                    }
                    .container {
                        display: flex;
                        gap: 20px;
                        flex-wrap: wrap;
                    }
                    .card {
                        background-color: var(--vscode-editorWidget-background);
                        border: 1px solid var(--vscode-widget-border);
                        border-radius: 8px;
                        padding: 20px;
                        flex: 1;
                        min-width: 300px;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    }
                    h2 {
                        margin-top: 0;
                        border-bottom: 1px solid var(--vscode-widget-border);
                        padding-bottom: 10px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .metric {
                        margin: 15px 0;
                    }
                    .metric-label {
                        font-size: 0.9em;
                        color: var(--vscode-descriptionForeground);
                    }
                    .metric-value {
                        font-size: 1.8em;
                        font-weight: bold;
                        margin-top: 5px;
                    }
                    .progress-bar {
                        height: 10px;
                        background-color: var(--vscode-progressBar-background);
                        border-radius: 5px;
                        overflow: hidden;
                        margin-top: 10px;
                        opacity: 0.3;
                    }
                    .progress-fill {
                        height: 100%;
                        background-color: var(--vscode-button-background);
                        width: 0%;
                        transition: width 0.5s ease-in-out;
                    }
                    .progress-fill.warning { background-color: var(--vscode-editorWarning-foreground); }
                    .progress-fill.danger { background-color: var(--vscode-editorError-foreground); }
                    
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    th, td {
                        text-align: left;
                        padding: 8px;
                        border-bottom: 1px solid var(--vscode-widget-border);
                    }
                    th {
                        color: var(--vscode-descriptionForeground);
                        font-weight: normal;
                    }
                    button {
                        background-color: var(--vscode-button-background);
                        color: var(--vscode-button-foreground);
                        border: none;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                        margin-top: 15px;
                    }
                    button:hover {
                        background-color: var(--vscode-button-hoverBackground);
                    }
                    .refresh-btn {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        border-radius: 50%;
                        width: 50px;
                        height: 50px;
                        font-size: 20px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                    }
                    .note {
                        font-size: 0.85em;
                        color: var(--vscode-descriptionForeground);
                        margin-top: 10px;
                        font-style: italic;
                    }
                </style>
            </head>
            <body>
                <h1>AI Token & Usage Dashboard</h1>
                <p>Data refreshed at ${new Date().toLocaleTimeString()}</p>

                <div class="container">
                    <!-- Antigravity Card -->
                    <div class="card">
                        <h2>
                            Antigravity CLI (Gemini Pro)
                            <span style="font-size: 0.5em; background: var(--vscode-badge-background); color: var(--vscode-badge-foreground); padding: 4px 8px; border-radius: 10px;">ACTIVE</span>
                        </h2>
                        
                        <div class="metric">
                            <div class="metric-label">Estimated Token Usage</div>
                            <div class="metric-value">${formatNum(agyData.totalTokens)}</div>
                            <div class="note">Out of ${formatNum(agyData.budgetLimit)} limit</div>
                        </div>

                        <div class="progress-bar">
                            <div class="progress-fill ${parseFloat(agyPct) > 90 ? 'danger' : parseFloat(agyPct) > 70 ? 'warning' : ''}" 
                                 style="width: ${agyPct}%; opacity: 1;"></div>
                        </div>

                        <div class="metric" style="display: flex; justify-content: space-between; margin-top: 20px;">
                            <div>
                                <div class="metric-label">Sessions Today</div>
                                <div class="metric-value" style="font-size: 1.4em;">${agyData.sessionsToday}</div>
                            </div>
                            <div>
                                <div class="metric-label">Total Sessions</div>
                                <div class="metric-value" style="font-size: 1.4em;">${agyData.totalSessions}</div>
                            </div>
                        </div>

                        <p class="note">* Note: Antigravity local data does not expose raw token counts. Token numbers are estimates based on active session step counts (~2.5k tokens/step).</p>

                        <h3 style="margin-top: 30px;">Recent Sessions</h3>
                        <table>
                            <tr>
                                <th>Name</th>
                                <th>Steps</th>
                                <th>Est. Tokens</th>
                            </tr>
                            ${agySessionsHtml}
                        </table>
                    </div>

                    <!-- Claude Card -->
                    <div class="card">
                        <h2>Claude API (Pay-as-you-go)</h2>
                        
                        <div class="metric">
                            <div class="metric-label">Total API Spend</div>
                            <div class="metric-value">$${claudeData.estimatedCost.toFixed(2)}</div>
                            <div class="note">Budget: $${claudeBudget.toFixed(2)}</div>
                        </div>

                        <div class="progress-bar">
                            <div class="progress-fill ${parseFloat(claudePct) > 90 ? 'danger' : parseFloat(claudePct) > 70 ? 'warning' : ''}" 
                                 style="width: ${claudePct}%; opacity: 1;"></div>
                        </div>

                        <div class="metric" style="display: flex; justify-content: space-between; margin-top: 20px;">
                            <div>
                                <div class="metric-label">Total Tokens</div>
                                <div class="metric-value" style="font-size: 1.4em;">${formatNum(claudeData.totalTokens)}</div>
                            </div>
                            <div>
                                <div class="metric-label">Input / Output</div>
                                <div class="metric-value" style="font-size: 1.2em;">
                                    ${formatNum(claudeData.inputTokens)} / ${formatNum(claudeData.outputTokens)}
                                </div>
                            </div>
                        </div>

                        ${claudeDataWarning}

                        <h3 style="margin-top: 30px;">Model Breakdown</h3>
                        <table>
                            <tr>
                                <th>Model</th>
                                <th>Cost</th>
                                <th>Tokens</th>
                            </tr>
                            ${claudeModelsHtml}
                        </table>
                    </div>
                </div>

                <button class="refresh-btn" onclick="vscode.postMessage({command: 'refresh'})" title="Refresh Data">
                    ↻
                </button>

                <script>
                    const vscode = acquireVsCodeApi();
                </script>
            </body>
            </html>`;
    }
}
