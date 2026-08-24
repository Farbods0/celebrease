const postgres = require('postgres');

async function main() {
  const sql = postgres(process.env.DATABASE_URL);
  
  try {
    const events = await sql`SELECT id, name, image FROM event`;
    console.log("Events:", events);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await sql.end();
  }
}

main();
