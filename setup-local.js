#!/usr/bin/env node

/**
 * Interactive setup script for TimeWarp LoL local development
 * Run with: node setup-local.js
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║              🎮 TimeWarp LoL - Local Setup 🎮                 ║
║                                                                ║
║  This script will help you configure your local environment   ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`);

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
};

async function setupEnvironment() {
  console.log('\n📋 Step 1: Riot Games API Key');
  console.log('   Get your key from: https://developer.riotgames.com/');
  console.log('   (Log in and click "Regenerate Development Key")\n');

  const riotApiKey = await question('Enter your Riot API key (or press Enter to skip): ');

  console.log('\n🔧 Step 2: AWS Configuration (Optional for AI insights)');
  console.log('   If you want AI-powered insights, you need AWS Bedrock access.\n');

  const useAWS = await question('Do you have AWS Bedrock configured? (y/n): ');

  let awsAccessKey = 'placeholder';
  let awsSecretKey = 'placeholder';
  let awsRegion = 'us-east-1';

  if (useAWS.toLowerCase() === 'y') {
    console.log('\n   Great! Let\'s configure AWS...\n');
    awsRegion = await question('AWS Region (default: us-east-1): ') || 'us-east-1';
    awsAccessKey = await question('AWS Access Key ID: ');
    awsSecretKey = await question('AWS Secret Access Key: ');
  } else {
    console.log('\n   ⚠️  No problem! The app will run without AI insights.');
    console.log('   You\'ll still get all statistics, charts, and achievements.\n');
  }

  // Create .env file
  const envContent = `# Riot Games API
RIOT_API_KEY=${riotApiKey || 'your_riot_api_key_here'}

# AWS Configuration
AWS_REGION=${awsRegion}
AWS_ACCESS_KEY_ID=${awsAccessKey}
AWS_SECRET_ACCESS_KEY=${awsSecretKey}

# DynamoDB Tables
DYNAMODB_MATCHES_TABLE=timewarp-matches
DYNAMODB_PLAYERS_TABLE=timewarp-players
DYNAMODB_INSIGHTS_TABLE=timewarp-insights

# S3 Buckets
S3_DATA_BUCKET=timewarp-data
S3_IMAGES_BUCKET=timewarp-images

# Bedrock Configuration
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0

# Application
NEXT_PUBLIC_API_URL=http://localhost:3000
`;

  const envPath = path.join(__dirname, '.env');
  fs.writeFileSync(envPath, envContent);

  console.log('\n✅ Configuration saved to .env file!\n');

  // Summary
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log('📊 Setup Summary:');
  console.log(`   Riot API Key: ${riotApiKey ? '✓ Configured' : '✗ Not configured'}`);
  console.log(`   AWS Bedrock:  ${useAWS.toLowerCase() === 'y' ? '✓ Configured' : '✗ Not configured'}\n`);

  if (!riotApiKey) {
    console.log('⚠️  Warning: You need to add your Riot API key to the .env file');
    console.log('   Get it from: https://developer.riotgames.com/\n');
  }

  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log('🚀 Next Steps:\n');
  console.log('   1. Make sure your .env file has a valid Riot API key');
  if (useAWS.toLowerCase() !== 'y') {
    console.log('   2. (Optional) Configure AWS later for AI insights');
  }
  console.log(`   ${useAWS.toLowerCase() === 'y' ? '2' : '3'}. Run: npm run dev`);
  console.log(`   ${useAWS.toLowerCase() === 'y' ? '3' : '4'}. Open: http://localhost:3000\n`);
  console.log('   📖 For detailed help, see: QUICKSTART.md\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  rl.close();
}

// Run setup
setupEnvironment().catch((error) => {
  console.error('Error during setup:', error);
  rl.close();
  process.exit(1);
});
