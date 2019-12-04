const Boom = require('@hapi/boom');
const { sendMailHandler, healthCheck, emailSchema } = require('./handlers');

exports.plugin = {
    name: 'api',
    version: '1.0.0',
    register: function register(server, options) {
        server.route([
            { method: 'GET', path: '/health_check', handler: healthCheck },
            {
                method: 'POST',
                path: '/send_mail',
                handler: sendMailHandler,
                options: {
                    validate: {
                        payload: emailSchema,
                        options: {
                            abortEarly: false
                        },
                        failAction: errorHandler
                    }
                }
            }
        ]);
    }
};

const errorHandler = async (request, h, err) => {
    const error = Boom.badRequest('Invalid request payload input');
    error.output.statusCode = 400; // Assign a custom error code
    error.reformat();
    if (err.isJoi && Array.isArray(err.details) && err.details.length > 0) {
        const { message } = err.details[0];
        error.output.payload.reason = err.details.map(d => d.message);
    }
    throw error;
};
