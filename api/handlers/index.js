const { healthCheck } = require("./common");
const { sendMailHandler, emailSchema } = require("./send.email");
module.exports = {
  healthCheck,
  sendMailHandler,
  emailSchema
};
