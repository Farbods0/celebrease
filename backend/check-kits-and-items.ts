import { PrismaClient } from './src/generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
    const kits = await prisma.kit.findMany({
        include: { holiday: true }
    });
    
    console.log("=== KITS ===");
    for (const kit of kits) {
        console.log(`Kit ID: ${kit.id}, SKU: ${kit.sku}, Images: ${kit.images}, Holiday: ${kit.holiday.name}`);
    }

    const items = await prisma.item.findMany();
    console.log("=== ITEMS ===");
    for (const item of items) {
        console.log(`Item SKU: ${item.sku}, Name: ${item.name}, Image: ${item.image}`);
    }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
