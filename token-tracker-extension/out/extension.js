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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const antigravityTracker_1 = require("./antigravityTracker");
const claudeTracker_1 = require("./claudeTracker");
const dashboardPanel_1 = require("./dashboardPanel");
let antigravityStatusBar;
let claudeStatusBar;
let refreshInterval;
function activate(context) {
    console.log('AI Token Tracker activated');
    const antigravityTracker = new antigravityTracker_1.AntigravityTracker(context);
    const claudeTracker = new claudeTracker_1.ClaudeTracker(context);
    // Create status bar items
    antigravityStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 200);
    antigravityStatusBar.command = 'aiTokenTracker.showDashboard';
    antigravityStatusBar.tooltip = 'Click for detailed AI usage dashboard';
    context.subscriptions.push(antigravityStatusBar);
    claudeStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 199);
    claudeStatusBar.command = 'aiTokenTracker.showDashboard';
    claudeStatusBar.tooltip = 'Click for detailed AI usage dashboard';
    context.subscriptions.push(claudeStatusBar);
    // Register commands
    context.subscriptions.push(vscode.commands.registerCommand('aiTokenTracker.showDashboard', () => {
        dashboardPanel_1.DashboardPanel.createOrShow(context, antigravityTracker, claudeTracker);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('aiTokenTracker.refresh', async () => {
        await refreshUsageData(antigravityTracker, claudeTracker);
        vscode.window.showInformationMessage('AI Token Tracker: Usage data refreshed');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('aiTokenTracker.setClaudeApiKey', async () => {
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
    }));
    // Initial data load
    refreshUsageData(antigravityTracker, claudeTracker);
    // Set up periodic refresh
    const config = vscode.workspace.getConfiguration('aiTokenTracker');
    const intervalMinutes = config.get('refreshIntervalMinutes', 5);
    refreshInterval = setInterval(() => refreshUsageData(antigravityTracker, claudeTracker), intervalMinutes * 60 * 1000);
    // Watch for config changes
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('aiTokenTracker')) {
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
            const newConfig = vscode.workspace.getConfiguration('aiTokenTracker');
            const newInterval = newConfig.get('refreshIntervalMinutes', 5);
            refreshInterval = setInterval(() => refreshUsageData(antigravityTracker, claudeTracker), newInterval * 60 * 1000);
            refreshUsageData(antigravityTracker, claudeTracker);
        }
    }));
}
async function refreshUsageData(antigravityTracker, claudeTracker) {
    const config = vscode.workspace.getConfiguration('aiTokenTracker');
    // Refresh Antigravity data
    if (config.get('statusBar.showAntigravity', true)) {
        try {
            const agyData = await antigravityTracker.getUsageData();
            updateAntigravityStatusBar(agyData);
            antigravityStatusBar.show();
        }
        catch (e) {
            fs.writeFileSync(path.join(__dirname, '..', 'ag-error.log'), String(e.stack || e));
            antigravityStatusBar.text = '$(sparkle) AG: Error';
            antigravityStatusBar.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
            antigravityStatusBar.show();
        }
    }
    else {
        antigravityStatusBar.hide();
    }
    // Refresh Claude data
    if (config.get('statusBar.showClaude', true)) {
        try {
            const claudeData = await claudeTracker.getUsageData();
            updateClaudeStatusBar(claudeData);
            claudeStatusBar.show();
        }
        catch (e) {
            fs.writeFileSync(path.join(__dirname, '..', 'claude-error.log'), String(e.stack || e));
            claudeStatusBar.text = '$(hubot) Claude: Error';
            claudeStatusBar.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
            claudeStatusBar.show();
        }
    }
    else {
        claudeStatusBar.hide();
    }
    // Update dashboard if open
    dashboardPanel_1.DashboardPanel.updateIfVisible(antigravityTracker, claudeTracker);
}
function updateAntigravityStatusBar(data) {
    const totalTokensK = Math.round(data.totalTokens / 1000);
    const displayTokens = data.totalTokens >= 1000000
        ? (data.totalTokens / 1000000).toFixed(1) + 'M'
        : `${totalTokensK}K`;
    const pct = data.budgetLimit > 0
        ? Math.round((data.totalTokens / data.budgetLimit) * 100)
        : 0;
    let icon = '$(sparkle)';
    let bg;
    if (pct >= 90) {
        icon = '$(warning)';
        bg = new vscode.ThemeColor('statusBarItem.errorBackground');
    }
    else if (pct >= 70) {
        icon = '$(alert)';
        bg = new vscode.ThemeColor('statusBarItem.warningBackground');
    }
    antigravityStatusBar.text = `${icon} AG: ${displayTokens}`;
    antigravityStatusBar.backgroundColor = bg;
    if (data.budgetLimit > 0) {
        const remaining = data.budgetLimit - data.totalTokens;
        const remainStr = remaining <= 0
            ? '0K (Limit Exceeded)'
            : remaining >= 1000000
                ? (remaining / 1000000).toFixed(1) + 'M tokens'
                : Math.round(remaining / 1000) + 'K tokens';
        const budgetStr = data.budgetLimit >= 1000000
            ? (data.budgetLimit / 1000000).toFixed(1) + 'M'
            : Math.round(data.budgetLimit / 1000) + 'K';
        antigravityStatusBar.tooltip = `Antigravity Token Usage\n` +
            `Used: ${displayTokens} / ${budgetStr} (${pct}%)\n` +
            `Remaining: ${remainStr}\n` +
            `Sessions today: ${data.sessionsToday}\n\n` +
            `Click for detailed dashboard`;
    }
}
function updateClaudeStatusBar(data) {
    const totalTokensK = Math.round(data.totalTokens / 1000);
    const displayTokens = data.totalTokens >= 1000000
        ? (data.totalTokens / 1000000).toFixed(1) + 'M'
        : `${totalTokensK}K`;
    const costStr = data.estimatedCost.toFixed(2);
    let icon = '$(hubot)';
    let bg;
    const config = vscode.workspace.getConfiguration('aiTokenTracker');
    const budget = config.get('claude.monthlyBudget', 100);
    if (budget > 0 && data.totalTokens > 0) {
        const pct = Math.round((data.estimatedCost / budget) * 100);
        if (pct >= 90) {
            icon = '$(warning)';
            bg = new vscode.ThemeColor('statusBarItem.errorBackground');
        }
        else if (pct >= 70) {
            icon = '$(alert)';
            bg = new vscode.ThemeColor('statusBarItem.warningBackground');
        }
    }
    if (data.totalTokens === 0) {
        claudeStatusBar.text = `${icon} Claude: $0.00`;
    }
    else {
        claudeStatusBar.text = `${icon} Claude: ${displayTokens} · $${costStr}`;
    }
    claudeStatusBar.backgroundColor = bg;
    claudeStatusBar.tooltip = `Claude Token Usage\n` +
        `Total tokens: ${displayTokens}\n` +
        `Estimated cost: $${costStr}\n` +
        `Sessions today: ${data.sessionsToday}\n\n` +
        `Click for detailed dashboard`;
}
function deactivate() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
}
//# sourceMappingURL=extension.js.map
