const { AccessToken } = require('livekit-server-sdk');
const livekit = require('../config/livekit');

// Use environment variables (NEVER hardcode secrets!)
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY; // Set in .env
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET; // Set in .env

const generateOperatorToken = async (participantName, roomName = 'support') => { // ✅ Fixed spelling
  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: participantName, // Now correctly referenced
    ttl: '10m', // Token expires after 10 minutes
  });

  at.addGrant({ 
    roomJoin: true, 
    room: roomName,
    roomCreate: true,
    roomList: true,
    roomRecord: true
  });

  return await at.toJwt();
};

module.exports = generateOperatorToken;