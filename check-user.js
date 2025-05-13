const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
  try {
    const adminUser = await prisma.user.findUnique({
      where: {
        email: 'quiseforeverphilly@gmail.com'
      }
    });
    console.log('Admin user:', adminUser);

    const clientUser = await prisma.user.findUnique({
      where: {
        email: 'client@example.com'
      }
    });
    console.log('Client user:', clientUser);

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkUser();
