// responseError.js
class ResponseError extends Error {
  constructor(status = 500, message, errors = null) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends ResponseError {
  constructor(message = "Validation Error", errors = null) {
    super(400, message, errors);
  }
}

class NotFoundError extends ResponseError {
  constructor(message = "Resource Not Found", errors = null) {
    super(404, message, errors);
  }
}

class UnauthorizedError extends ResponseError {
  constructor(message = "Unauthorized Access", errors = null) {
    super(401, message, errors);
  }
}
const handleError = (error) => {
  if (error instanceof ResponseError) {
    throw error;
  }
  throw new ResponseError(500, error.message || 'Internal server error');
};


module.exports = {
  ResponseError,
  ValidationError,
  NotFoundError,
  handleError,
  UnauthorizedError
};