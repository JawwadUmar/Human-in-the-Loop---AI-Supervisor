const { AccessToken } = require('livekit-server-sdk');
const livekit = require('../config/livekit');

exports.generateOperatorToken = (req, res) => {
  const { roomName, identity } = req.body;
  
  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    { identity }
  );
  
  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true
  });
  
  res.json({ token: token.toJwt() });
};