const { clients } = require("./mail.clients");
const logger = require("./logger");

const RETRY_AFTER_MS = 2 * 60 * 1000; // 2 minutes

class ClientManager {
  //@TODO: validate clients: array of event emitters
  constructor(clients) {
    this.clients = clients;
    this.errorMap = {};
    this.successMap = {};
    this.curIdx = -1;
    this.retryAfterMs = RETRY_AFTER_MS;
    clients.map(client => {
      this.successMap[client.getName()] = {
        count: 0,
        lastEventAt: null
      };
      this.errorMap[client.getName()] = {
        count: 0,
        lastEventAt: null
      };
      client.on("mail_sent_error", this.handleError.bind(this));
      client.on("mail_sent_success", this.handleSucess.bind(this));
    });
  }
  handleError(err, clientName) {
    this._update("errorMap", clientName);
    logger.info("error ", this.errorMap);
  }
  handleSucess(clientName) {
    this._update("successMap", clientName);
    logger.info("success ", this.successMap);
  }
  next() {
    return this._find(this.clients.length);
  }
  updateRetryAfterMs(retryAfterMs) {
    this.retryAfterMs = retryAfterMs;
  }
  _update(map, name) {
    const o = this[map][name];
    o.count = o.count + 1;
    o.lastEventAt = Date.now();
  }
  _find(count) {
    if (count === 0) {
      return null;
    }
    this.curIdx++;
    if (this.curIdx === this.clients.length) {
      this.curIdx = 0;
    }
    const c = this.clients[this.curIdx];
    const errorInfo = this.errorMap[c.getName()];
    const successInfo = this.successMap[c.getName()];
    if (errorInfo.count === 0) {
      return c;
    }
    if (
      successInfo.count > 0 &&
      successInfo.lastEventAt >= errorInfo.lastEventAt
    ) {
      return c;
    }
    if (Date.now() - errorInfo.lastEventAt > this.retryAfterMs) {
      return c;
    }

    return this._find(count - 1);
  }
}

module.exports.clientManager = new ClientManager(clients);
module.exports.ClientManager = ClientManager;
