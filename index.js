const { startServer } = require("./server");
const logger = require("./utils/logger");

startServer();

process.on("uncaughtException", err => {
  logger.error("uncaughtException", err);
  process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
  logger.warn("Unhandled Rejection at:", promise, "reason:", reason);
});
