const { startServer } = require("../../../server");
const sendMailSvc = require("../../services/send.email.svc");

describe("server", () => {
  let server;

  beforeEach(async () => {
    server = await startServer();
  });

  afterEach(async () => {
    await server.stop();
  });
  it("should return not found when invalid route", async () => {
    const res = await server.inject({
      method: "get",
      url: "/"
    });
    expect(res.statusCode).toBe(404);
  });
  it("should return error when invalid payload submitted", async () => {
    //empty
    let res = await server.inject({
      method: "post",
      url: "/api/send_mail",
      payload: {},
      headers: {
        "Content-Type": "application/json"
      }
    });
    expect(res.statusCode).toBe(400);

    // only from address
    res = await server.inject({
      method: "post",
      url: "/api/send_mail",
      payload: {
        from: "tester@gmail.com"
      },
      headers: {
        "Content-Type": "application/json"
      }
    });
    expect(res.statusCode).toBe(400);

    // only from address
    res = await server.inject({
      method: "post",
      url: "/api/send_mail",
      payload: {
        from: "tester@gmail.com"
      },
      headers: {
        "Content-Type": "application/json"
      }
    });
    expect(res.statusCode).toBe(400);
    // invalid from address
    res = await server.inject({
      method: "post",
      url: "/api/send_mail",
      payload: {
        from: "tester@"
      },
      headers: {
        "Content-Type": "application/json"
      }
    });
    expect(res.statusCode).toBe(400);

    // without subject
    res = await server.inject({
      method: "post",
      url: "/api/send_mail",
      payload: {
        from: "tester@gmail.com",
        to: "to@gmail.com"
      },
      headers: {
        "Content-Type": "application/json"
      }
    });
    expect(res.statusCode).toBe(400);
  });
  it("should throw error when failed to send email", async () => {
    const mock = jest.spyOn(sendMailSvc, "sendMail");
    mock.mockImplementation(() => {
      throw new Error("ssss");
    });
    let res = await server.inject({
      method: "post",
      url: "/api/send_mail",
      payload: {
        from: "ab@gmail.com",
        to: "cd@gmail.com",
        subject: "Hello"
      },
      headers: {
        "Content-Type": "application/json"
      }
    });
    expect(res.statusCode).toBe(500);
    expect(mock).toHaveBeenCalledTimes(1);
    mock.mockClear();
  });
  it("should be able to send email successfully", async () => {
    const mock = jest.spyOn(sendMailSvc, "sendMail");
    mock.mockImplementation(() => true);
    let res = await server.inject({
      method: "post",
      url: "/api/send_mail",
      payload: {
        from: "ab@gmail.com",
        to: "cd@gmail.com",
        subject: "Hello"
      },
      headers: {
        "Content-Type": "application/json"
      }
    });
    expect(mock).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(200);
    mock.mockClear();
  });
});
