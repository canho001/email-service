const envKey = key => {
  const env = process.env.NODE_ENV || "development";

  const configuration = {
    development: {
      host: "localhost",
      port: 3000
    },
    test: {
      host: "localhost",
      port: 8010
    },
    // These should match environment variables on hosted server
    production: {
      host: process.env.HOST,
      port: process.env.PORT
    }
  };

  return configuration[env][key];
};

const manifest = {
  server: {
    host: envKey("host"),
    port: envKey("port"),
    routes: {
      cors: true
    },
    router: {
      stripTrailingSlash: true
    }
  },
  register: {
    plugins: [
      {
        plugin: "./api",
        routes: { prefix: "/api" }
      }
    ]
  }
};

module.exports = manifest;
