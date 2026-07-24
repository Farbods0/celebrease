const { spawn } = require('child_process');
const readline = require('readline');

// Start the actual railway mcp process
const railway = spawn('/Users/farbodjahan/.railway/bin/railway', ['mcp'], {
  stdio: ['pipe', 'pipe', process.stderr]
});

// Read from stdin (Antigravity) and forward to railway, 
// intercepting server/discover
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  try {
    const msg = JSON.parse(line);
    if (msg.method === 'server/discover') {
      // Respond to server/discover immediately, don't pass to railway
      const response = {
        jsonrpc: "2.0",
        id: msg.id,
        result: {}
      };
      process.stdout.write(JSON.stringify(response) + '\n');
    } else {
      // Forward other messages to railway
      railway.stdin.write(line + '\n');
    }
  } catch (e) {
    // If not JSON, just forward
    railway.stdin.write(line + '\n');
  }
});

// Read from railway and forward to stdout (Antigravity)
railway.stdout.on('data', (data) => {
  process.stdout.write(data);
});

railway.on('close', (code) => {
  process.exit(code);
});
