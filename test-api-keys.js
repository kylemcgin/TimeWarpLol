/**
 * Test script to verify API keys at each stage
 * Run with: node test-api-keys.js
 */

require('dotenv').config();
const axios = require('axios');

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60));
}

async function testRiotApiKey() {
  logSection('STAGE 1: Environment Variables Check');

  const riotApiKey = process.env.RIOT_API_KEY;

  log('\n1. RIOT_API_KEY from .env file:', 'blue');
  if (!riotApiKey) {
    log('   ❌ RIOT_API_KEY not found in environment', 'red');
    return false;
  }

  if (riotApiKey === 'your_riot_api_key_here') {
    log('   ❌ RIOT_API_KEY is still the placeholder value', 'red');
    return false;
  }

  log(`   ✓ RIOT_API_KEY is set: ${riotApiKey.substring(0, 15)}...`, 'green');
  log(`   ✓ Full key: ${riotApiKey}`, 'green');

  // Check other env vars
  log('\n2. AWS Configuration:', 'blue');
  log(`   AWS_REGION: ${process.env.AWS_REGION || 'NOT SET'}`, process.env.AWS_REGION ? 'green' : 'yellow');
  log(`   AWS_ACCESS_KEY_ID: ${process.env.AWS_ACCESS_KEY_ID?.substring(0, 10) || 'NOT SET'}...`,
      (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_ACCESS_KEY_ID !== 'your_access_key') ? 'green' : 'yellow');

  logSection('STAGE 2: Riot API Service Initialization');

  log('\n3. Creating axios instance with API key...', 'blue');
  const axiosInstance = axios.create({
    headers: {
      'X-Riot-Token': riotApiKey,
    },
  });
  log('   ✓ Axios instance created successfully', 'green');
  log(`   ✓ X-Riot-Token header: ${riotApiKey.substring(0, 15)}...`, 'green');

  logSection('STAGE 3: Testing Riot API - Platform Status (No Auth Required)');

  try {
    log('\n4. Testing platform status endpoint...', 'blue');
    const statusUrl = 'https://na1.api.riotgames.com/lol/status/v4/platform-data';
    const statusResponse = await axiosInstance.get(statusUrl);
    log('   ✓ Platform status endpoint SUCCESS', 'green');
    log(`   ✓ Status: ${statusResponse.data.name}`, 'green');
  } catch (error) {
    log('   ❌ Platform status endpoint FAILED', 'red');
    log(`   Error: ${error.response?.data?.status?.message || error.message}`, 'red');
    if (error.response?.status === 403) {
      log('   ⚠️  403 Forbidden - API key may be invalid or expired', 'yellow');
    }
  }

  logSection('STAGE 4: Testing Riot ID Account Endpoint');

  try {
    log('\n5. Testing Riot ID account lookup (Doublelift#NA1)...', 'blue');
    const accountUrl = 'https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/Doublelift/NA1';
    log(`   URL: ${accountUrl}`, 'blue');
    const accountResponse = await axiosInstance.get(accountUrl);
    log('   ✓ Riot ID account endpoint SUCCESS', 'green');
    log(`   ✓ PUUID: ${accountResponse.data.puuid}`, 'green');
    log(`   ✓ Game Name: ${accountResponse.data.gameName}`, 'green');
    log(`   ✓ Tag Line: ${accountResponse.data.tagLine}`, 'green');

    // Store PUUID for next test
    const puuid = accountResponse.data.puuid;
    const gameName = accountResponse.data.gameName;
    const tagLine = accountResponse.data.tagLine;

    logSection('STAGE 5: Testing Summoner Endpoint (by-puuid)');

    try {
      log('\n6. Testing summoner by-puuid endpoint...', 'blue');
      const summonerUrl = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
      log(`   URL: ${summonerUrl}`, 'blue');
      const summonerResponse = await axiosInstance.get(summonerUrl);
      log('   ✓ Summoner by-puuid endpoint SUCCESS', 'green');
      log(`   ✓ PUUID: ${summonerResponse.data.puuid}`, 'green');
      log(`   ✓ Summoner Name: ${summonerResponse.data.name || 'UNDEFINED'}`, summonerResponse.data.name ? 'green' : 'red');
      log(`   ✓ Summoner Level: ${summonerResponse.data.summonerLevel}`, 'green');
      log(`   ✓ Profile Icon ID: ${summonerResponse.data.profileIconId}`, 'green');

      log('\n   📋 Full Response Data:', 'blue');
      console.log(JSON.stringify(summonerResponse.data, null, 2));

      if (!summonerResponse.data.name) {
        log('\n   ⚠️  WARNING: Summoner name is undefined!', 'yellow');
        log('   ℹ️  This is the issue causing "Player found: undefined"', 'yellow');
        log(`   ℹ️  Suggestion: Use Riot ID directly (${gameName}#${tagLine})`, 'yellow');
      }

    } catch (error) {
      log('   ❌ Summoner by-puuid endpoint FAILED', 'red');
      log(`   Error: ${error.response?.data?.status?.message || error.message}`, 'red');
      log(`   Status Code: ${error.response?.status}`, 'red');
      if (error.response?.status === 403) {
        log('   ⚠️  403 Forbidden - This endpoint may be restricted', 'yellow');
      }
      if (error.response?.data) {
        log('\n   📋 Full Error Response:', 'blue');
        console.log(JSON.stringify(error.response.data, null, 2));
      }
    }

    logSection('STAGE 6: Testing Match History Endpoint');

    try {
      log('\n7. Testing match history endpoint...', 'blue');
      const matchUrl = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=5`;
      log(`   URL: ${matchUrl}`, 'blue');
      const matchResponse = await axiosInstance.get(matchUrl);
      log('   ✓ Match history endpoint SUCCESS', 'green');
      log(`   ✓ Found ${matchResponse.data.length} recent matches`, 'green');
      if (matchResponse.data.length > 0) {
        log(`   ✓ First match ID: ${matchResponse.data[0]}`, 'green');
      }
    } catch (error) {
      log('   ❌ Match history endpoint FAILED', 'red');
      log(`   Error: ${error.response?.data?.status?.message || error.message}`, 'red');
      log(`   Status Code: ${error.response?.status}`, 'red');
    }

  } catch (error) {
    log('   ❌ Riot ID account endpoint FAILED', 'red');
    log(`   Error: ${error.response?.data?.status?.message || error.message}`, 'red');
    log(`   Status Code: ${error.response?.status}`, 'red');
    if (error.response?.status === 403) {
      log('   ⚠️  403 Forbidden - API key may be invalid or expired', 'yellow');
    }
    if (error.response?.data) {
      log('\n   📋 Full Error Response:', 'blue');
      console.log(JSON.stringify(error.response.data, null, 2));
    }
  }

  logSection('STAGE 7: Summary');

  log('\n✓ Checks completed!', 'green');
  log('\nKey Findings:', 'blue');
  log('• RIOT_API_KEY is properly loaded from .env', 'green');
  log('• API key is being sent in X-Riot-Token header', 'green');
  log('• Check the results above for endpoint-specific issues', 'yellow');

  return true;
}

// Run the tests
testRiotApiKey().catch(error => {
  log('\n❌ Unexpected error during testing:', 'red');
  console.error(error);
  process.exit(1);
});
