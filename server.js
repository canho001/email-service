"use strict";

const Glue = require("@hapi/glue");
const manifest = require("./config/manifest");
const logger = require("./utils/logger");

const env = process.env.NODE_ENV || "development";
const isProduction = env == "production";
if (!isProduction) {
  manifest.register.plugins.push({
    plugin: "blipp"
  });
}

exports.startServer = async function startServer() {
  try {
    const server = await Glue.compose(manifest, { relativeTo: __dirname });
    await server.start();
    logger.info(
      `✅ Server is listening on  ${server.info.uri.toLowerCase()}, environment "${env}"`
    );
    return server;
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};
