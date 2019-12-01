const { sendMailHandler, healthCheck, emailSchema } = require("./handlers");

exports.plugin = {
  name: "api",
  version: "1.0.0",
  register: function register(server, options) {
    server.route([
      { method: "GET", path: "/health_check", handler: healthCheck },
      {
        method: "POST",
        path: "/send_mail",
        handler: sendMailHandler,
        options: {
          validate: {
            payload: emailSchema
          }
        }
      }
    ]);
  }
};
