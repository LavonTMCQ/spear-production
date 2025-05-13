/**
 * Script to set up environment variables for Vercel deployment
 * 
 * This script will output the commands to set up environment variables in Vercel
 */

// Load environment variables from .env file
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

// Project name
const projectName = 'spear-production';

// Generate commands to set up environment variables in Vercel
console.log(`\nRun the following commands to set up environment variables in Vercel:\n`);

Object.entries(envConfig).forEach(([key, value]) => {
  console.log(`vercel env add ${key} ${projectName} -y`);
});

console.log(`\nAfter setting up the environment variables, redeploy the project:\n`);
console.log(`vercel --prod`);
