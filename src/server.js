// Configures and starts the server, listening on the specified port.
const express = require('express');
const app = express();

const logger = require('./utils/logger');

const entry = require('./index')

entry.entry()

app.listen(process.env.PORT, function(){
    logger.info("Web server listening on port " + process.env.PORT)
})