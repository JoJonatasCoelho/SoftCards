const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (!(err instanceof ApiError)) {
    statusCode = 500;
    message = "Ocorreu um erro inesperado no servidor.";
    console.error(err);
  }
  const response = {
    error: {
      message: message,
    },
  };
  if (err.details) {
    response.error.details = err.details;
  }
  if (process.env.NODE_ENV === 'development') {
    response.error.stack = err.stack;
  }
  res.status(statusCode).json(response);
};

module.exports = errorHandler;