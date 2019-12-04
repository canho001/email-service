const { healthCheck } = require('./health.check');
const { sendMailHandler, emailSchema } = require('./send.email.handler');
module.exports = {
    healthCheck,
    sendMailHandler,
    emailSchema
};
