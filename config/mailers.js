exports.mailers = [
  {
    name: "mailgun",
    url: "<mailgun end point>",
    apiKey: "<mailgun api ky>",
    buildHeaders: ({ apiKey, userName = "api" }) => {
      const h = Buffer.from(`${userName}:${apiKey}`).toString("base64");
      return {
        Authorization: `Basic ${h}`,
        "Content-Type": "application/x-www-form-urlencoded"
      };
    },
    dataProp: "form"
  },

  {
    name: "sendgrid",
    url: "<sendgrid endpoint>",
    apiKey: "<sendgrid api key>",
    transform: ({ to, from, subject, text, cc, bcc }) => {
      const toList = Array.isArray(to) ? to : [to];
      const ccList = convert(cc);
      const bccList = convert(bcc);
      return {
        personalizations: [
          {
            to: [...toList.map(t => ({ email: t }))],
            ...ccList,
            ...bccList
          }
        ],
        from: {
          email: from
        },
        subject,
        content: [
          {
            type: "text/plain",
            value: text
          }
        ]
      };
    },
    buildHeaders: ({ apiKey }) => {
      return {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      };
    },
    dataProp: "body",
    json: true
  }
];
function convert(arr) {
  const items = Array.isArray(arr) ? arr : [arr];
  return items.length > 0 ? { cc: [...items.map(t => ({ email: t }))] } : {};
}
