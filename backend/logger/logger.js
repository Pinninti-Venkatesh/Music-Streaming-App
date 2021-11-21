const { createLogger, format, transports } = require('winston');
const { combine, colorize, timestamp, printf } = format;

const loggerFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
    level:"debug",
    format: combine(
        colorize(),
        timestamp(),
        loggerFormat
    ),
    transports: [new transports.File({ filename: "logs.log" })]
});

module.exports = logger;