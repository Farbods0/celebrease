import * as vscode from 'vscode';
import { AntigravityTracker } from './antigravityTracker';
import { ClaudeTracker } from './claudeTracker';
import { DashboardPanel } from './dashboardPanel';
import { UsageData } from './types';

let antigravityStatusBar: vscode.StatusBarItem;
let claudeStatusBar: vscode.StatusBarItem;
let refreshInterval: NodeJS.Timeout | undefined;

export function activate(context: vscode.ExtensionContext) {
    console.log('AI Token Tracker activated');

    const antigravityTracker = new AntigravityTracker(context);
    const claudeTracker = new ClaudeTracker(context);

    // Create status bar items
    antigravityStatusBar = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        200
    );
    antigravityStatusBar.command = 'aiTokenTracker.showDashboard';
    antigravityStatusBar.tooltip = 'Click for detailed AI usage dashboard';
    context.subscriptions.push(antigravityStatusBar);

    claudeStatusBar = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        199
    );
    claudeStatusBar.command = 'aiTokenTracker.showDashboard';
    claudeStatusBar.tooltip = 'Click for detailed AI usage dashboard';
    context.subscriptions.push(claudeStatusBar);

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('aiTokenTracker.showDashboard', () => {
            DashboardPanel.createOrShow(context, antigravityTracker, claudeTracker);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('aiTokenTracker.refresh', async () => {
            await refreshUsageData(antigravityTracker, claudeTracker);
            vscode.window.showInformationMessage('AI Token Tracker: Usage data refreshed');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('aiTokenTracker.setClaudeApiKey', async () => {
            const key = await vscode.window.showInputBox({
                prompt: 'Enter your Claude Admin API Key (sk-ant-admin-...)',
                password: true,
                placeHolder: 'sk-ant-admin-...',
                validateInput: (value) => {
                    if (value && !value.startsWith('sk-ant-admin')) {
                        return 'Admin API keys start with sk-ant-admin';
                    }
                    return null;
                }
            });
            if (key !== undefined) {
                await context.secrets.store('claude-admin-api-key', key);
                vscode.window.showInformationMessage('Claude Admin API Key saved securely');
                await refreshUsageData(antigravityTracker, claudeTracker);
            }
        })
    );

    // Initial data load
    refreshUsageData(antigravityTracker, claudeTracker);

    // Set up periodic refresh
    const config = vscode.workspace.getConfiguration('aiTokenTracker');
    const intervalMinutes = config.get<number>('refreshIntervalMinutes', 5);
    refreshInterval = setInterval(
        () => refreshUsageData(antigravityTracker, claudeTracker),
        intervalMinutes * 60 * 1000
    );

    // Watch for config changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration('aiTokenTracker')) {
                if (refreshInterval) {
                    clearInterval(refreshInterval);
                }
                const newConfig = vscode.workspace.getConfiguration('aiTokenTracker');
                const newInterval = newConfig.get<number>('refreshIntervalMinutes', 5);
                refreshInterval = setInterval(
                    () => refreshUsageData(antigravityTracker, claudeTracker),
                    newInterval * 60 * 1000
                );
                refreshUsageData(antigravityTracker, claudeTracker);
            }
        })
    );
}

async function refreshUsageData(
    antigravityTracker: AntigravityTracker,
    claudeTracker: ClaudeTracker
): Promise<void> {
    const config = vscode.workspace.getConfiguration('aiTokenTracker');

    // Refresh Antigravity data
    if (config.get<boolean>('statusBar.showAntigravity', true)) {
        try {
            const agyData = await antigravityTracker.getUsageData();
            updateAntigravityStatusBar(agyData);
            antigravityStatusBar.show();
        } catch (e) {
            antigravityStatusBar.text = '$(sparkle) AGY: Error';
            antigravityStatusBar.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
            antigravityStatusBar.show();
        }
    } else {
        antigravityStatusBar.hide();
    }

    // Refresh Claude data
    if (config.get<boolean>('statusBar.showClaude', true)) {
        try {
            const claudeData = await claudeTracker.getUsageData();
            updateClaudeStatusBar(claudeData);
            claudeStatusBar.show();
        } catch (e) {
            claudeStatusBar.text = '$(hubot) Claude: Error';
            claudeStatusBar.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
            claudeStatusBar.show();
        }
    } else {
        claudeStatusBar.hide();
    }

    // Update dashboard if open
    DashboardPanel.updateIfVisible(antigravityTracker, claudeTracker);
}

function updateAntigravityStatusBar(data: UsageData): void {
    const totalTokensK = Math.round(data.totalTokens / 1000);
    const pct = data.budgetLimit > 0
        ? Math.round((data.totalTokens / data.budgetLimit) * 100)
        : 0;

    let icon = '$(sparkle)';
    let bg: vscode.ThemeColor | undefined;

    if (pct >= 90) {
        icon = '$(warning)';
        bg = new vscode.ThemeColor('statusBarItem.errorBackground');
    } else if (pct >= 70) {
        icon = '$(alert)';
        bg = new vscode.ThemeColor('statusBarItem.warningBackground');
    }

    antigravityStatusBar.text = `${icon} AGY: ${totalTokensK}K tokens`;
    antigravityStatusBar.backgroundColor = bg;

    if (data.budgetLimit > 0) {
        const remainK = Math.round((data.budgetLimit - data.totalTokens) / 1000);
        antigravityStatusBar.tooltip = `Antigravity Token Usage\n` +
            `Used: ${totalTokensK}K / ${Math.round(data.budgetLimit / 1000)}K (${pct}%)\n` +
            `Remaining: ${remainK}K tokens\n` +
            `Sessions today: ${data.sessionsToday}\n\n` +
            `Click for detailed dashboard`;
    }
}

function updateClaudeStatusBar(data: UsageData): void {
    const totalTokensK = Math.round(data.totalTokens / 1000);
    const costStr = data.estimatedCost.toFixed(2);

    let icon = '$(hubot)';
    let bg: vscode.ThemeColor | undefined;

    const config = vscode.workspace.getConfiguration('aiTokenTracker');
    const budget = config.get<number>('claude.monthlyBudget', 100);

    if (budget > 0) {
        const pct = Math.round((data.estimatedCost / budget) * 100);
        if (pct >= 90) {
            icon = '$(warning)';
            bg = new vscode.ThemeColor('statusBarItem.errorBackground');
        } else if (pct >= 70) {
            icon = '$(alert)';
            bg = new vscode.ThemeColor('statusBarItem.warningBackground');
        }
    }

    claudeStatusBar.text = `${icon} Claude: ${totalTokensK}K · $${costStr}`;
    claudeStatusBar.backgroundColor = bg;
    claudeStatusBar.tooltip = `Claude Token Usage\n` +
        `Total tokens: ${totalTokensK}K\n` +
        `Estimated cost: $${costStr}\n` +
        `Sessions today: ${data.sessionsToday}\n\n` +
        `Click for detailed dashboard`;
}

export function deactivate() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
}
