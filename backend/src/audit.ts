import { PrismaClient } from './generated/prisma';
const prisma = new PrismaClient();

async function main() {
  const kits = await prisma.kit.findMany({
    select: { sku: true, images: true, holidayId: true }
  });
  console.log(JSON.stringify(kits, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
