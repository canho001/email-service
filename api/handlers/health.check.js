// @TODO: do real health check, maybe call one of email servers
// No email servers' health check api found so far
exports.healthCheck = function healthCheck() {
    return { status: 'ok' };
};
