
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// Define the log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Create the logger
const logger = createLogger({
  format: combine(
    colorize(),            // Colorize the output
    timestamp(),           // Add timestamp to the log messages
    logFormat              // Use the custom log format
  ),
  transports: [
    // Console transport: Logs to the console
    new transports.Console(),
    // File transport: Logs to a file
    new transports.File({ filename: 'logs/combined.log' }),
    // Error file transport: Logs errors to a separate file
    new transports.File({ filename: 'logs/error.log', level: 'error' })
  ]
});

module.exports = logger;
