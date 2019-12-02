const {
  RemoteEmailServerError,
  ServerError
} = require("../../../utils/errors");
const { sendMail } = require("../send.email.svc");
const { clientManager } = require("../../../utils/client.manager.js");

describe("send.email.svc", () => {
  it("should throw error if no email client found", async () => {
    const nextMock = jest.spyOn(clientManager, "next");
    nextMock.mockImplementation(() => null);
    await expect(sendMail({})).rejects.toThrow(ServerError);
    expect(clientManager.next).toHaveBeenCalledTimes(1);
    nextMock.mockClear();
  });

  it("should not retry if it is not mail server error", async () => {
    const nextMock = jest.spyOn(clientManager, "next");
    nextMock.mockImplementation(() => ({
      async send() {
        throw new Error({
          statusCode: 400
        });
      }
    }));
    await expect(sendMail({})).rejects.toThrow(
      new Error({
        statusCode: 400
      })
    );
    expect(clientManager.next).toHaveBeenCalledTimes(1);
    nextMock.mockClear();
  });
  it("should retry and able to send mail successfully if one of mail server is down", async () => {
    const nextMock = jest.spyOn(clientManager, "next");
    nextMock
      .mockImplementationOnce(() => ({
        async send() {
          throw {
            statusCode: 500 // emulate server error
          };
        },
        getName() {
          return "failed-emailer";
        }
      }))
      .mockImplementationOnce(() => ({
        async send() {
          return true;
        },
        getName() {
          return "good-emailer";
        }
      }));
    await sendMail({});

    expect(clientManager.next).toHaveBeenCalledTimes(2);
    nextMock.mockClear();
  });
  it("should throw error if all mail servers are down", async () => {
    const nextMock = jest.spyOn(clientManager, "next");
    nextMock
      .mockImplementationOnce(() => ({
        async send() {
          throw {
            statusCode: 500 // emulate server error
          };
        },
        getName() {
          return "failed-emailer1";
        }
      }))
      .mockImplementationOnce(() => ({
        async send() {
          throw {
            statusCode: 500 // emulate server error
          };
        },
        getName() {
          return "failed-emailer2";
        }
      }));
    await expect(sendMail({})).rejects.toThrow(RemoteEmailServerError);
    //await expect(sendMail({})).rejects.toThrow(ServerError);
    expect(clientManager.next).toHaveBeenCalledTimes(2);
    nextMock.mockClear();
  });
  it("should be able to send mail successfully on the first try", async () => {
    const nextMock = jest.spyOn(clientManager, "next");
    nextMock.mockImplementation(() => ({
      send() {
        return 1;
      }
    }));
    const result = await sendMail({});
    expect(result).toBe(true);
    nextMock.mockClear();
  });
});
