const bunyan = require("bunyan");

const logger = bunyan.createLogger({
  name: "email-service",
  streams: [
    {
      level: "info",
      stream: process.stdout // log INFO and above to stdout
    },
    {
      level: "error",
      type: "rotating-file",
      path: "./logs/app.log",
      period: "1d", // daily rotation
      count: 3 // keep 3 back copies
    }
  ]
});

module.exports = logger;
