const errorMessages = require('../utils/error-messages');

module.exports.error = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({ message: statusCode === 500 ? errorMessages.ServerError : message });
  next();
};
