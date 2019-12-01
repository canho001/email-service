const Joi = require("@hapi/joi");
const { sendMail } = require("../services/send.email.svc");
/**
 * Send email using one of configured email items
 * @param from
 * @param to
 * @param subject
 */
exports.sendMailHandler = function sendMailHandler(req, h) {
  return sendMail(req.payload);
};

exports.emailSchema = Joi.object({
  from: Joi.string().email(),
  to: Joi.alternatives()
    .try(
      Joi.array()
        .items(Joi.string().email())
        .min(1),
      Joi.string().email()
    )
    .required(),
  cc: Joi.alternatives()
    .try(
      Joi.array()
        .items(Joi.string().email())
        .min(1),
      Joi.string().email()
    )
    .optional(),
  bcc: Joi.alternatives()
    .try(
      Joi.array()
        .items(Joi.string().email())
        .min(1),
      Joi.string().email()
    )
    .optional(),
  subject: Joi.string().required(),
  text: Joi.string().optional()
});
