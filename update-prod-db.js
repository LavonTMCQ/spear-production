const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

// Hash a password using SHA-256
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function updateProdDb() {
  try {
    console.log('Checking if password field exists...');
    
    // Try to get a user to check if the password field exists
    const adminUser = await prisma.user.findUnique({
      where: {
        email: 'quiseforeverphilly@gmail.com'
      },
      select: {
        id: true,
        email: true,
        password: true
      }
    });
    
    console.log('Admin user:', adminUser);
    
    // If the password field doesn't exist or is null, we need to add it
    if (!adminUser.password) {
      console.log('Adding password field to users...');
      
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
    } else {
      console.log('Password field already exists and is set.');
    }
    
    await prisma.$disconnect();
    console.log('Database update completed successfully!');
  } catch (error) {
    console.error('Error updating production database:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

updateProdDb();
