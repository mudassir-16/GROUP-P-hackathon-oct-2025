#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Google Authentication...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found!');
    console.log('Please create .env.local first\n');
    process.exit(1);
}

console.log('📝 Current configuration:');
console.log('Firebase Project: openideax-d222b');
console.log('Auth Domain: openideax-d222b.firebaseapp.com\n');

console.log('🔗 ADD THIS DOMAIN TO FIREBASE:');
console.log('\n1. Go to: https://console.firebase.google.com/project/openideax-d222b/authentication/settings');
console.log('2. Scroll to "Authorized domains"');
console.log('3. Click "Add domain"');
console.log('4. Add: localhost');
console.log('5. Click "Add"');
console.log('\n💡 You may also need to add:');
console.log('   - 127.0.0.1');
console.log('   - 192.168.0.68 (your network IP)');
console.log('   - 10.231.82.47 (if shown in terminal)\n');

console.log('⏱️ After adding domains, wait 10-30 seconds for changes to propagate.');
console.log('🔄 Then refresh your browser and try signing in again.\n');

console.log('🎯 Alternative: Use Mock Authentication');
console.log('The app will work without Google Auth using mock data.');
console.log('You can test all features except real Firebase storage.\n');