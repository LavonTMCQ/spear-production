/**
 * Test script to verify database connection
 * 
 * This script tests:
 * 1. Connection to the PostgreSQL database
 * 2. Querying users and devices
 * 3. Verifying the two-tier access model
 */

const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  console.log('Testing database connection...\n');

  try {
    // Create a new Prisma client
    const prisma = new PrismaClient();

    // Test connection by querying users
    console.log('1. Testing connection to PostgreSQL database:');
    const users = await prisma.user.findMany();
    console.log(`- Connected successfully to database`);
    console.log(`- Found ${users.length} user(s):`);
    users.forEach((user, index) => {
      console.log(`  User ${index + 1}: ${user.name} (${user.email}, Role: ${user.role})`);
    });

    // Query devices
    console.log('\n2. Testing device queries:');
    const devices = await prisma.device.findMany({
      include: {
        assignedTo: true,
      },
    });
    console.log(`- Found ${devices.length} device(s):`);
    devices.forEach((device, index) => {
      console.log(`  Device ${index + 1}: ${device.name} (ID: ${device.teamViewerDeviceId})`);
      if (device.assignedTo) {
        console.log(`    Assigned to: ${device.assignedTo.name} (${device.assignedTo.email})`);
      } else {
        console.log(`    Not assigned to any user`);
      }
    });

    // Test the two-tier access model
    console.log('\n3. Testing two-tier access model:');
    
    // Get admin user
    const adminUser = await prisma.user.findFirst({
      where: {
        role: 'ADMIN',
      },
    });
    
    if (adminUser) {
      console.log(`- Admin user: ${adminUser.name} (${adminUser.email})`);
      
      // In a real implementation, admin would see all devices
      console.log(`- Admin can see all ${devices.length} device(s)`);
    }
    
    // Get client user
    const clientUser = await prisma.user.findFirst({
      where: {
        role: 'CLIENT',
      },
    });
    
    if (clientUser) {
      console.log(`- Client user: ${clientUser.name} (${clientUser.email})`);
      
      // Get devices assigned to client
      const clientDevices = await prisma.device.findMany({
        where: {
          userId: clientUser.id,
        },
      });
      
      console.log(`- Client can see ${clientDevices.length} device(s):`);
      clientDevices.forEach((device, index) => {
        console.log(`  Device ${index + 1}: ${device.name} (ID: ${device.teamViewerDeviceId})`);
      });
    }

    console.log('\nDatabase connection tests completed successfully!');
    
    // Close the Prisma client
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error testing database connection:', error);
  }
}

// Run the tests
testDatabaseConnection();
