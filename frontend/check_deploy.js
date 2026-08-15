const { execSync } = require('child_process');

async function check() {
  for (let i = 0; i < 30; i++) {
    try {
      const out = execSync('npx netlify api listSiteDeploys --data "{\\"site_id\\": \\"0c7dcc14-b267-4a8a-b518-2bdb5633dc2f\\"}"', { encoding: 'utf8', stdio: 'pipe' });
      const cleanedOut = out.replace(/npm warn.*\n/g, '').trim();
      const deploys = JSON.parse(cleanedOut);
      if (deploys[0].state === 'ready') {
        console.log('Ready!');
        process.exit(0);
      } else if (deploys[0].state === 'error') {
        console.log('Error');
        process.exit(1);
      }
      console.log('Building...');
    } catch (e) {
      console.error('Error fetching', e.message);
    }
    await new Promise(r => setTimeout(r, 5000));
  }
}
check();
