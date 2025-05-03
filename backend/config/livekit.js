const {RoomServiceClient} = require('livekit-server-sdk');

const livekit = new RoomServiceClient(
    process.env.LIVEKIT_HOST,
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET
);

module.exports = livekit;
