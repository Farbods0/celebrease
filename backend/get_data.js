const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();
prisma.holiday.findMany({ include: { kits: true } }).then(data => {
  require('fs').writeFileSync('holidays.json', JSON.stringify(data, null, 2));
  prisma.$disconnect();
});
