const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚗 Starting Lords Driving School Deployment...\n');

try {
  // Step 1: Build the project
  console.log('📦 Building the project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Step 2: Deploy to Firebase
  console.log('\n🚀 Deploying to Firebase Hosting...');
  execSync('firebase deploy --only hosting', { stdio: 'inherit' });
  
  console.log('\n✅ Deployment Complete!');
  console.log('🌐 Website: https://lords-driving-school.web.app');
  console.log('🔧 Firebase Console: https://console.firebase.google.com/project/lords-driving-school/overview');
  
} catch (error) {
  console.error('\n❌ Deployment Failed:', error.message);
  process.exit(1);
}
