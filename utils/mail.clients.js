const EventEmitter = require("events");
const rp = require("request-promise");
const { mailers } = require("../config/mailers.js");
const { ObjectNotInitializedError } = require("./errors");

class MailClient extends EventEmitter {
  constructor() {
    super();
    this._configured = false;
  }
  configure(config) {
    this.config = config;
    this._configured = true;
    return this;
  }
  async send({ from, to, subject, cc = [], bcc = [], text = "" } = {}) {
    if (!this._configured) {
      throw new ObjectNotInitializedError(`Mail client not configured yet`);
    }
    const {
      apiKey,
      url,
      name,
      transform = input => input,
      buildHeaders,
      dataProp,
      ...additionalProps
    } = this.config;
    const body = transform({
      from,
      to,
      subject: subject + " " + name,
      text,
      cc,
      bcc
    });
    const headers = buildHeaders({ apiKey });
    try {
      const result = await rp({
        uri: url,
        headers,
        method: "POST",
        [dataProp]: body,
        ...additionalProps
      });
      this.emit("mail_sent_success", name);
      return result;
    } catch (e) {
      this.emit("mail_sent_error", e, name);
      throw e;
    }
  }
  getName() {
    if (!this._configured) {
      throw new ObjectNotInitializedError(`Mail client not configured yet`);
    }
    return this.config.name;
  }
}

const clients = mailers.map(mailer => new MailClient().configure(mailer));

exports.clients = clients;
exports.MailClient = MailClient;
