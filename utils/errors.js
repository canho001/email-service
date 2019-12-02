class BaseError extends Error {
  constructor(message) {
    super(message);
    // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
class RemoteEmailServerError extends BaseError {}
class ServerError extends BaseError {}
class BadUserInputError extends BaseError {}

class ObjectNotInitializedError extends BaseError {}

module.exports = {
  RemoteEmailServerError,
  ServerError,
  BadUserInputError,
  ObjectNotInitializedError
};
