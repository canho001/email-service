const rp = require("request-promise");
const { mailers } = require("../config/mailers.js");
const { pick, required } = require("../utils/");

const pickGen = pick(mailers);
/**
 * Send email using one of configured email items
 * @param from
 * @param to
 * @param subject
 */
exports.sendMail = async function sendMail({
  from = required("from"),
  to = required("to"),
  subject = required("subject"),
  cc = [],
  bcc = [],
  text = ""
} = {}) {
  const {
    apiKey,
    url,
    name,
    transform = input => input,
    buildHeaders,
    dataProp,
    ...additionalProps
  } = pickGen.next().value;
  try {
    console.log("sending email using ", name, url);
    const body = transform({
      from,
      to,
      subject: subject + " " + name,
      text,
      cc,
      bcc
    });
    const headers = buildHeaders({ apiKey });
    const p = await rp({
      uri: url,
      headers,
      method: "POST",
      [dataProp]: body,
      ...additionalProps
    });
    return p;
  } catch (e) {
    console.log(e);
  }
};
