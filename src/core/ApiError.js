class ApiError extends Error {
  constructor({ statusCode = 500, clientMessage = 'Something went wrong', error }) {
    let errorMessage = '';
    errorMessage += error.name ? '[ ' + error.name + ' ]' : '';
    errorMessage += error.message ? '[ ' + error.message + ' ]' : '';
    super(errorMessage);

    this.success = false;
    this.statusCode = statusCode;
    this.clientMessage = clientMessage;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
