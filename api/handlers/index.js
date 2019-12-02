const { healthCheck } = require("./common");
const { sendMailHandler, emailSchema } = require("./send.email.handler");
module.exports = {
  healthCheck,
  sendMailHandler,
  emailSchema
};
