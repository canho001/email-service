exports.mailers = [
  {
    name: "mailgun",
    url:
      "https://api.mailgun.net/v3/sandbox1e07a05c44b5401087d5b11b7357ba40.mailgun.org/messages",
    apiKey: "316ea1fe00f30893c8c9823050179c69-e470a504-ae53fac3",
    weight: 0.5,
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
    name: "mailgun000000000",
    url: "https:/fake.co",
    apiKey: "316ea1fe00f30893c8c9823050179c69-e470a504-ae53fac3",
    weight: 0.5,
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
    url: "https://api.sendgrid.com/v3/mail/send",
    apiKey:
      "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",
    weight: 0.5,
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
