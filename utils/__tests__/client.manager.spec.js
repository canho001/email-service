const { ClientManager } = require("../client.manager");
const { MailClient } = require("../mail.clients");
describe("client.manager", () => {
  it("should be able to create clientManager", async () => {
    const clients = [];
    const cm = new ClientManager(clients);
    expect(cm).toBeInstanceOf(ClientManager);
    expect(cm.clients).toBe(clients);
  });
  it("should return client in round robin fashion when calling .next", () => {
    const c1 = new MailClient().configure({ name: "c1" });
    const c2 = new MailClient().configure({ name: "c2" });
    const c3 = new MailClient().configure({ name: "c3" });

    const cm = new ClientManager([c1, c2, c3]);
    expect(cm.next().getName()).toBe(c1.getName());
    expect(cm.next().getName()).toBe(c2.getName());
    expect(cm.next().getName()).toBe(c3.getName());
  });
  it("should be able to handle events from mail clients", () => {
    const c1 = new MailClient().configure({ name: "c1" });
    const c2 = new MailClient().configure({ name: "c2" });

    const cm = new ClientManager([c1, c2]);
    expect(cm.successMap[c1.getName()].count).toBe(0);
    c1.emit("mail_sent_success", c1.getName());
    expect(cm.successMap[c1.getName()].count).toBe(1);

    expect(cm.errorMap[c1.getName()].count).toBe(0);
    c1.emit("mail_sent_error", null, c1.getName());
    expect(cm.errorMap[c1.getName()].count).toBe(1);
  });
  it("should return mail client if latest event is sucessful", () => {
    const c1 = new MailClient().configure({ name: "c1" });
    const c2 = new MailClient().configure({ name: "c2" });

    const cm = new ClientManager([c1, c2]);
    c1.emit("mail_sent_error", null, c1.getName());
    c1.emit("mail_sent_success", c1.getName());
    expect(cm.next()).toBe(c1);
  });
  it("should return mail client if a configured amount of time ellapsed since the last failed event", async () => {
    const c1 = new MailClient().configure({ name: "c1" });
    const c2 = new MailClient().configure({ name: "c2" });

    const cm = new ClientManager([c1, c2]);
    cm.updateRetryAfterMs(100);
    c1.emit("mail_sent_error", null, c1.getName());
    await delay(1000); // delay 1s
    expect(cm.next()).toBe(c1);
  });

  it("should return null if all mail servers have errors within a time frame", async () => {
    const c1 = new MailClient().configure({ name: "c1" });
    const c2 = new MailClient().configure({ name: "c2" });

    const cm = new ClientManager([c1, c2]);
    cm.updateRetryAfterMs(100);

    c1.emit("mail_sent_error", null, c1.getName());
    c2.emit("mail_sent_error", null, c2.getName());
    expect(cm.next()).toBe(null);
  });
});

function delay(ms) {
  return new Promise(function(r) {
    setTimeout(r, ms);
  });
}
