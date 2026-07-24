import { PrismaClient } from './src/generated/prisma/client';
const prisma = new PrismaClient();

async function main() {
    const holidays = await prisma.holiday.findMany();
    console.log(`Holidays in DB: ${holidays.length}`);
}

main().catch(e => {
    console.error(e);
}).finally(async () => {
    await prisma.$disconnect();
});
