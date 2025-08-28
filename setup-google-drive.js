#!/usr/bin/env node

/**
 * Setup script for Google Drive API service account
 * This script helps you convert your service account JSON file to an environment variable
 */

const fs = require('fs');
const path = require('path');

// Path to your service account JSON file
const serviceAccountPath = process.argv[2];

if (!serviceAccountPath) {
  console.error('Usage: node setup-google-drive.js <path-to-service-account-json>');
  console.error('Example: node setup-google-drive.js ./winter-cargo-462801-k2-b85346f1d560.json');
  process.exit(1);
}

try {
  // Read the service account JSON file
  const serviceAccountJson = fs.readFileSync(serviceAccountPath, 'utf8');
  
  // Validate JSON
  const serviceAccount = JSON.parse(serviceAccountJson);
  
  // Required fields validation
  const requiredFields = ['type', 'project_id', 'private_key', 'client_email'];
  for (const field of requiredFields) {
    if (!serviceAccount[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  // Convert to single line for environment variable
  const singleLineJson = JSON.stringify(serviceAccount);
  
  // Read existing .env.local file
  const envPath = path.join(__dirname, '.env');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Update or add GOOGLE_SERVICE_ACCOUNT_JSON
  const envLines = envContent.split('\n');
  let updated = false;
  
  for (let i = 0; i < envLines.length; i++) {
    if (envLines[i].startsWith('GOOGLE_SERVICE_ACCOUNT_JSON=')) {
      envLines[i] = `GOOGLE_SERVICE_ACCOUNT_JSON=${singleLineJson}`;
      updated = true;
      break;
    }
  }
  
  if (!updated) {
    envLines.push(`GOOGLE_SERVICE_ACCOUNT_JSON=${singleLineJson}`);
  }
  
  // Write back to .env.local
  fs.writeFileSync(envPath, envLines.join('\n'));
  
  console.log('✅ Google Drive API service account configured successfully!');
  console.log(`✅ Service account email: ${serviceAccount.client_email}`);
  console.log(`✅ Project ID: ${serviceAccount.project_id}`);
  console.log('\n📝 Next steps:');
  console.log('1. Make sure your Google Drive files are shared with the service account email');
  console.log('2. Restart your development server (npm run dev)');
  console.log('3. Test loading a PDF from Google Drive');
  
} catch (error) {
  console.error('❌ Error setting up Google Drive API:', error.message);
  process.exit(1);
}
