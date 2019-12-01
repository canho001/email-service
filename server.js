"use strict";

const Glue = require("@hapi/glue");
const manifest = require("./config/manifest");

const env = process.env.NODE_ENV || "development";
const isProduction = env !== "production";
if (!isProduction) {
  manifest.register.plugins.push({
    plugin: "blipp"
  });
}

exports.startServer = async function startServer() {
  try {
    const server = await Glue.compose(manifest, { relativeTo: __dirname });
    await server.start();
    console.log(
      `✅ Server is listening on  ${server.info.uri.toLowerCase()}, environment "${env}"`
    );
    return server;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
