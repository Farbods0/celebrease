const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.user.update({
    where: { email: 'test_edd18b33@celebrease.com' },
    data: { role: 'admin' }
  });
  console.log("Made test user an admin.");
}
main().catch(console.error).finally(() => prisma.$disconnect());
