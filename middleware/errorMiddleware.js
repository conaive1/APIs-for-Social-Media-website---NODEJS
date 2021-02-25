const ErrorResponse = require("../model/errorResponse");

const errorMiddleware = (err, req, res, next) => {
  let errors = { ...err };
  if (!err.code && err.message) {
    errors.code = 500;
    errors.message = err.message;
  }
  //mogo DuppLicate
  if (err.code === 11000) {
    errors = new ErrorResponse(400, err.keyValue);
    for (let i in errors.message) {
      errors.message[i] = `${i} is already exist`;
    }
  }
  if (err.name === "CastError") {
    errors.code = 400;
    errors.message = "Id in invalid";
  }
  //mogo validator
  if (err.name === "ValidationError") {
    errors = new ErrorResponse(400, err.errors);
    for (let i in errors.message) {
      errors.message[i] = errors.message[i].message;
    }
  }
  res.status(errors.code || 500).json({
    success: false,
    code: errors.code || 500,
    message: errors.message || "server Error",
  });
  next();
};
module.exports = errorMiddleware;
