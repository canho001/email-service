const { clients } = require("./mail.clients");

const RETRY_AFTER_MS = 2 * 60 * 1000; // 2 minutes

class ClientManager {
  constructor(clients) {
    this.clients = clients;
    this.errorMap = {};
    this.successMap = {};
    this.curIdx = -1;
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
    //this.errorMap[clientName] = this.errorMap[clientName] + 1;
    this._update("errorMap", clientName);
    console.log("error ", this.errorMap);
  }
  handleSucess(clientName) {
    //this.successMap[clientName] = this.successMap[clientName] + 1;
    this._update("successMap", clientName);
    console.log("success ", this.successMap);
  }
  next() {
    return this._find(this.clients.length - 1);
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
      successInfo.lastEventAt > errorInfo.lastEventAt
    ) {
      return c;
    }
    if (Date.now() - errorInfo.lastEventAt > RETRY_AFTER_MS) {
      return c;
    }

    return this._find(count - 1);
  }
}

module.exports.clientManager = new ClientManager(clients);
