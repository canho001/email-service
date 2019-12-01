const rp = require("request-promise");
const Joi = require("@hapi/joi");
const { pick } = require("../../utils/");
const { clientManager } = require("./client.manager");

//const pickGen = pick(clients);

// const proxySend = createProxy(send);
/**
 * Send email using one of configured email items
 * @param from
 * @param to
 * @param subject
 */

exports.sendMail = async function sendMail(
  { from, to, subject, cc = [], bcc = [], text = "" } = {},
  tryCount = 2
) {
  if (tryCount === 0) {
    throw new Error("Failed to send");
  }
  const client = clientManager.next();
  try {
    await client.send({
      from,
      to,
      subject,
      cc,
      bcc,
      text
    });
    return true;
  } catch (e) {
    console.log(
      `Failed to send email using mail client ${client.getName()}. Retrying...`
    );
    sendMail(
      {
        from,
        to,
        subject,
        cc,
        bcc,
        text
      },
      tryCount - 1
    );
  }
};

async function send(options) {
  return rp(options);
}

function createProxy(fn, monitor) {
  return new Proxy(fn, {
    apply: async function(target, thisArg, argumentsList) {
      console.log("calling target function", argumentsList);
      const start = process.hrtime();
      try {
        const result = await Reflect.apply(target, thisArg, argumentsList);
        const end = process.hrtime(start);
        console.log("execution time %dms", end[1] / 1000000);
      } catch (e) {
        //monitor.update()
      }
    }
  });
}

function monitor(mailers) {
  return {
    get: function get() {
      //return next healthy mail service
    },
    mon: function() {},
    err: function() {}
  };
}
