const winston = require('winston')
const winstonRotator = require('winston-daily-rotate-file')
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

module.exports = logger
