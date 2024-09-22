const winston = require('winston');
const path = require('path');
const logfiles = 'C:/Users/JeswinWilson/Desktop/logfiles';
const DailyRotateFile = require('winston-daily-rotate-file');

const appLogFile = path.join(logfiles, 'app.log');
const meterLogFile = path.join(logfiles, 'meter.log');

// Create a logger for application logs
const appLogger = winston.createLogger({
  level: 'info', // Set the minimum log level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, filename, functionname }) => {
      return `${timestamp} [${level}] | Message: ${message} | File: ${filename} | Function: ${functionname} `;
    })
  ),
  transports: [
    // new winston.transports.Console(), // Log to the console
    // new winston.transports.File({ filename: appLogFile }) // Log to a file
    new DailyRotateFile({  
      filename: path.join(logfiles, 'contacts_app.log%DATE%.log'), // Include %DATE% in the filename  
      datePattern: 'YYYY-MM-DD', // Use date pattern for daily rotation  
      zippedArchive: true,  
      maxSize: '20m', // Max size of each log file  
      maxFiles: null,  
      json: false  

    })  
  ],
});

// Create a logger for metered logs
const meteredLogger = winston.createLogger({
  level: 'info', // Set the minimum log level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, filename, functionname, startDate, endDate, duration }) => {
      return `${timestamp} [${level}] | Message: ${message} | File: ${filename} | Function: ${functionname} | Start: ${startDate} | End: ${endDate} | Duration (ms): ${duration} `;
    })
  ),
  transports: [
    // new winston.transports.Console(), // Log to the console
    // new winston.transports.File({ filename: meterLogFile }) // Log to a different file
    new DailyRotateFile({
      filename: path.join(logfiles, 'contacts-Metering.log%DATE%.log'), // Include %DATE% in the filename
      datePattern: 'YYYY-MM-DD', // Use date pattern for daily rotation
      zippedArchive: true,
      maxSize: '20m', // Max size of each log file
      maxFiles: null,
      
      json: false

    })
  ],
});

module.exports = { appLogger, meteredLogger };
