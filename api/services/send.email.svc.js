const logger = require('../../utils/logger');
const { clientManager } = require('../../utils/client.manager');
const { ServerError, RemoteEmailServerError } = require('../../utils/errors');

/**
 * Send email using one of configured email items
 * @param from required - from email
 * @param to required - email or an array of emails
 * @param subject required - string
 * @param cc optional - array of emails
 * @param bcc optional - array of emails
 * @param text optional - body of email
 */

exports.sendMail = async function sendMail({
    from,
    to,
    subject,
    cc = [],
    bcc = [],
    text = ''
} = {}) {
    return sendMailWithTry({ from, to, subject, cc, bcc, text });
};

async function sendMailWithTry(
    { from, to, subject, cc, bcc, text } = {},
    tryCount = 2
) {
    if (tryCount === 0) {
        throw new RemoteEmailServerError('Failed to send email after retrying');
    }
    const client = clientManager.next();
    if (!client) {
        throw new ServerError('Unable to find mail client');
    }
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
        if (e.statusCode >= 500) {
            // only retry with other client when error is on the server end
            logger.debug(
                `Failed to send email using mail client ${client.getName()}. Retrying...`,
                e
            );
            return sendMailWithTry(
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
        } else {
            throw e;
        }
    }
}
