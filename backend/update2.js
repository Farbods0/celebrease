const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();
async function main() {
  const kitP = await prisma.kit.findUnique({ where: { sku: 'NOW-PREMIUM-2026' } });
  if (kitP) {
    console.log('Premium images:', kitP.images);
    await prisma.kit.update({
      where: { sku: 'NOW-PREMIUM-2026' },
      data: {
        images: ['/events/now-premium-2026-v2_angle1.jpg', '/events/now-premium-2026-v2_angle2.jpg', '/events/now-premium-2026-v2_angle3.jpg', '/events/now-premium-2026-v2_angle4.jpg']
      }
    });
    console.log('Premium updated');
  }
  const holiday = await prisma.holiday.findFirst({ where: { name: 'Nowruz' } });
  if (holiday) {
    await prisma.holiday.update({
      where: { id: holiday.id },
      data: { image: '/events/now-premium-2026-v2_angle1.jpg' }
    });
    console.log('Holiday updated');
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
