import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.user.updateMany({
    where: { email: 'test_edd18b33@celebrease.com' },
    data: { role: 'admin' }
  });
}
main();
