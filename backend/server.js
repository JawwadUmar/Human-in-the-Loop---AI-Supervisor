// require('../.env').config();
require('dotenv').config({ path: '../.env' });

const app = require('./app')
const PORT = process.env.PORT || 3001;

app.listen(PORT, ()=>{
    console.log(`Server Running on port ${PORT}`);
    console.log(`LiveKit host: ${process.env.LIVEKIT_HOST}`);
});