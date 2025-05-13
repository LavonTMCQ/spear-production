const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

// Hash a password using SHA-256
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function updateAdminPassword() {
  try {
    // Hash the password "password"
    const hashedPassword = hashPassword("password");
    
    // Update the admin user with the hashed password
    const updatedAdmin = await prisma.user.update({
      where: {
        email: 'quiseforeverphilly@gmail.com'
      },
      data: {
        password: hashedPassword
      }
    });
    
    console.log('Admin user updated:', updatedAdmin);
    
    // Also update the client user for consistency
    const updatedClient = await prisma.user.update({
      where: {
        email: 'client@example.com'
      },
      data: {
        password: hashedPassword
      }
    });
    
    console.log('Client user updated:', updatedClient);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

updateAdminPassword();
