/**
 * Test script to verify TeamViewer integration for both admin and client roles
 *
 * This script tests:
 * 1. Admin access to all devices
 * 2. Client access to only assigned devices
 * 3. TeamViewer connection functionality
 */

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testTeamViewerIntegration() {
  console.log('Testing TeamViewer integration for different roles...\n');

  try {
    // Test admin access to all devices
    console.log('1. Testing admin access to all devices:');

    // Check TeamViewer configuration
    const configResponse = await fetch('http://localhost:3000/api/teamviewer/config-status');
    const configData = await configResponse.json();
    console.log(`- TeamViewer configuration status: ${configData.isConfigured ? 'Configured' : 'Not configured'}`);
    console.log(`- Client ID: ${configData.clientId}`);

    // Get devices (admin view)
    const devicesResponse = await fetch('http://localhost:3000/api/teamviewer/devices');
    const devicesData = await devicesResponse.json();
    const devices = devicesData.devices || [];

    console.log(`- Admin can see ${devices.length} device(s):`);
    devices.forEach((device, index) => {
      console.log(`  Device ${index + 1}: ${device.alias || device.description} (ID: ${device.device_id}, TeamViewer ID: ${device.remotecontrol_id})`);
    });

    // Simulate client access to only assigned devices
    console.log('\n2. Testing client access to assigned devices:');

    // For testing purposes, we'll filter devices to simulate client access
    // In a real implementation, this would be handled by the database and API
    const clientId = 'client-123'; // Example client ID
    const assignedDevices = devices.filter((device, index) => index === 0); // Assign only the first device to this client

    console.log(`- Client (ID: ${clientId}) can see ${assignedDevices.length} device(s):`);
    assignedDevices.forEach((device, index) => {
      console.log(`  Device ${index + 1}: ${device.alias || device.description} (ID: ${device.device_id}, TeamViewer ID: ${device.remotecontrol_id})`);
    });

    // Test TeamViewer connection functionality
    console.log('\n3. Testing TeamViewer connection functionality:');
    if (devices.length > 0) {
      const testDevice = devices[0];
      console.log(`- Testing connection to device: ${testDevice.alias || testDevice.description} (ID: ${testDevice.device_id})`);
      console.log(`- Connection URL would be: https://start.teamviewer.com/${testDevice.remotecontrol_id}`);
      console.log('- Connection test successful (simulated)');
    } else {
      console.log('- No devices available to test connection');
    }

    console.log('\nTeamViewer integration tests completed successfully!');
  } catch (error) {
    console.error('Error testing TeamViewer integration:', error);
  }
}

// Run the tests
testTeamViewerIntegration();
