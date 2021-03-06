//import httpStatus from 'http-status';

class ExtendableError extends Error {
  constructor(message, status, isPublic) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    this.isPublic = isPublic;
    this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
    Error.captureStackTrace(this, this.constructor.name);
  }
}

module.exports = class APIError extends ExtendableError {
  constructor(message, status = 500/*httpStatus.INTERNAL_SERVER_ERROR*/, isPublic = false) {
    super(message, status, isPublic);
  }
}

