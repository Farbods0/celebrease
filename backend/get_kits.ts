import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const kits = await prisma.kit.findMany({
        include: { holiday: true }
    });
    
    const result = kits.map(k => ({
        sku: k.sku,
        tier: k.tier,
        holidayName: k.holiday.name,
        holidayId: k.holidayId
    }));
    
    console.log(JSON.stringify(result, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
