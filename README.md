#### Prerequisites

Node latest version. Node >= 10 should work too

#### Mail client configuration

All the mail clients are configured in config/mailers

**warning**: It's not a good practice to store sensitive data like `apiKey`, `service url` in config file. In `production`, all of these sensitive data should be retrieved from `process.env` which is populated by deployment infrastructure. Currently, storing these data in config file for convenience

• name: short name of the mail service

• apiKey

• url

• buildHeaders: customized the headers before sending the request (depend on the mail service)

• transform: how to transform the user input to the required payload (depend on the mail service)

#### Installation

• `npm i` to install dependencies

• `npm start` to start the service

• `npm test` to run the tests

#### Improvements

• Health check: should call one of email servers' health check api (couldn't find one so far)

• Dockerize the app

• Be able to configure `weight` on each email service

• Use swagger for documentation

#### How the api works

• Signature
• url: /api/send_email

    • method: 'POST'

    • payload:

    ```
    {
        "from": 'abc@test.com',
        "to": ["email1@test.com", "email2@test.com"] // or just "email@test.com",
        "subject": "sample subject"
        "text": "sample message body",
        "cc": [...], // max emails: 100
        "bcc": [....] // max emails: 100
    }
    ```

• The api will pick the email service prodiver in round-robin fashion (no weight supported so far) and try to send email with selected provider. If (after sending the request) it detects that the selected provider is down (~ error code >=500), it will select another healthy provider. If the healthy provide is down at the time the request is made, the service will stop searching and immediately reponds with `server error`. An unhealthy server is considered to be `healthy` again if the last error time reported by that server has ellapsed a configurable amount of time (for now 2 minutes).

• Errors related the `apiKey` reported by email providers (kind of configuration error) such as:

    • Max credits reached

    • Api key not found

    • ...

are the issue of the service itself and will be translated into the service error and thus the api will not try to select another healthy email provider. Instead, the service will fail immediately.
