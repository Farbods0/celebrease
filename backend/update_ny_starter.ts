import { PrismaClient } from './src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
    await prisma.kit.update({
        where: { sku: 'NY-STARTER-2026' },
        data: {
            images: ['/events/ny_starter_kit_1785004034470.jpg']
        }
    });
    console.log('Updated NY-STARTER-2026 images');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
