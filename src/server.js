// Configures and starts the server, listening on the specified port.
const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const logger = require('./utils/logger');
const { entry, init } = require('./index');


app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));

entry(); // Connect to the database
init(app); // Initialize routes

app.listen(process.env.PORT, function () {
    logger.info("Web server listening on port " + process.env.PORT);
});