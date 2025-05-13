// Test script for TeamViewer API integration

const https = require('https');
const querystring = require('querystring');

// TeamViewer API credentials
const clientId = '748865-SKNA4jUQk10HvZIZhVoD';
const clientSecret = 'XhWKLqAlNJM3YVkEPiFA';

// Helper function to make HTTPS requests
function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve({ statusCode: res.statusCode, headers: res.headers, data: parsedData });
        } catch (e) {
          resolve({ statusCode: res.statusCode, headers: res.headers, data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (postData) {
      req.write(postData);
    }

    req.end();
  });
}

// Generate the authorization URL for the user to visit
function getAuthorizationUrl() {
  const params = querystring.stringify({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: 'http://localhost:3000/api/auth/callback/teamviewer'
  });

  return `https://login.teamviewer.com/oauth2/authorize?${params}`;
}

// Exchange an authorization code for an access token
async function exchangeCodeForToken(code) {
  try {
    const postData = querystring.stringify({
      grant_type: 'authorization_code',
      code: code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: 'http://localhost:3000/api/auth/callback/teamviewer'
    });

    const options = {
      hostname: 'webapi.teamviewer.com',
      port: 443,
      path: '/api/v1/oauth2/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const response = await makeRequest(options, postData);

    if (response.statusCode !== 200) {
      console.error('Failed to exchange code for token:', response.statusCode, response.data);
      return null;
    }

    return response.data.access_token;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return null;
  }
}

// Use a script token for testing (this is a workaround for development)
async function getScriptToken() {
  // Script token generated from the TeamViewer Management Console
  return '26405094-jajtBr0ScJN8z3e83zsY';
}

// Get devices using the access token
async function getDevices(token) {
  try {
    const options = {
      hostname: 'webapi.teamviewer.com',
      port: 443,
      path: '/api/v1/devices',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await makeRequest(options);

    if (response.statusCode !== 200) {
      console.error('Failed to get devices:', response.statusCode, response.data);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error('Error getting devices:', error);
    return null;
  }
}

// Get account information using the access token
async function getAccountInfo(token) {
  try {
    const options = {
      hostname: 'webapi.teamviewer.com',
      port: 443,
      path: '/api/v1/account',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await makeRequest(options);

    if (response.statusCode !== 200) {
      console.error('Failed to get account info:', response.statusCode, response.data);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error('Error getting account info:', error);
    return null;
  }
}

// Get online sessions using the access token
async function getOnlineSessions(token) {
  try {
    const options = {
      hostname: 'webapi.teamviewer.com',
      port: 443,
      path: '/api/v1/sessions',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await makeRequest(options);

    if (response.statusCode !== 200) {
      console.error('Failed to get online sessions:', response.statusCode, response.data);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error('Error getting online sessions:', error);
    return null;
  }
}

// Main function
async function main() {
  console.log('Testing TeamViewer API integration...');

  // Get script token
  console.log('Using script token to access TeamViewer API...');
  const token = await getScriptToken();

  if (!token) {
    console.error('Failed to get script token.');
    return;
  }

  console.log('Script token obtained successfully.');

  // Get account information
  console.log('\nGetting account information...');
  const accountInfo = await getAccountInfo(token);

  if (!accountInfo) {
    console.error('Failed to get account information.');
  } else {
    console.log('Account Information:', JSON.stringify(accountInfo, null, 2));
  }

  // Get devices
  console.log('\nGetting devices...');
  const devices = await getDevices(token);

  if (!devices) {
    console.error('Failed to get devices.');
  } else {
    console.log('Devices:', JSON.stringify(devices, null, 2));
  }

  // Get online sessions
  console.log('\nGetting online sessions...');
  const sessions = await getOnlineSessions(token);

  if (!sessions) {
    console.error('Failed to get online sessions.');
  } else {
    console.log('Online Sessions:', JSON.stringify(sessions, null, 2));
  }
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
});
