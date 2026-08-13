const { neon } = require('@neondatabase/serverless');

const DATABASE_URL = process.env.DATABASE_URL;
const BACKEND_URL = 'https://celebrease-backend-production-4778.up.railway.app';

const sql = neon(DATABASE_URL);

async function sendVerification(email) {
    const response = await fetch(`${BACKEND_URL}/api/auth/send-verification-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, callbackURL: 'https://celebrease.com/account' }),
    });
    const text = await response.text();
    return { status: response.status, body: text };
}

(async () => {
    // Find all users with unverified email
    const users = await sql`
        SELECT id, name, email, role
        FROM "user"
        WHERE "emailVerified" = false
        ORDER BY "createdAt" DESC
    `;

    if (users.length === 0) {
        console.log('✅ No unverified users found — everyone is already verified!');
        return;
    }

    console.log(`Found ${users.length} unverified user(s):\n`);

    for (const user of users) {
        process.stdout.write(`  Sending to ${user.email} (${user.name})... `);
        try {
            const result = await sendVerification(user.email);
            if (result.status === 200 || result.status === 201) {
                console.log(`✅ Sent`);
            } else {
                console.log(`⚠️  Status ${result.status}: ${result.body}`);
            }
        } catch (err) {
            console.log(`❌ Error: ${err.message}`);
        }
        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 300));
    }

    console.log('\nDone! All verification emails dispatched.');
})();
