const Joi = require("@hapi/joi");
const Boom = require("@hapi/boom");

const mailSvc = require("../services/send.email.svc");
const logger = require("../../utils/logger");

/**
 * Send email using one of configured email items
 * @param from
 * @param to
 * @param subject
 */
exports.sendMailHandler = async function sendMailHandler(req, h) {
  try {
    await mailSvc.sendMail(req.payload);
    return {
      statusCode: 200,
      message: "Email sent successfully"
    };
  } catch (e) {
    logger.error(e);
    return Boom.badImplementation();
  }
};

exports.emailSchema = Joi.object({
  from: Joi.string()
    .email()
    .required(),
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
        .min(1)
        .max(100),
      Joi.string().email()
    )
    .optional(),
  bcc: Joi.alternatives()
    .try(
      Joi.array()
        .items(Joi.string().email())
        .min(1)
        .max(100),
      Joi.string().email()
    )
    .optional(),
  subject: Joi.string().required(),
  text: Joi.string().optional()
});
