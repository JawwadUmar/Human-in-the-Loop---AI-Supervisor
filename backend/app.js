const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const ticketRoutes = require('./routes/ticketRoutes')

const app = express();

app.use(cors()); //Middleware
app.use(bodyParser.json());

app.use('/api', ticketRoutes);
module.exports = app;
