const ErrorResponse = require("../model/errorResponse");

exports.baseAuht = async (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;
  if (!token) {
    return next(new ErrorResponse(401, "base token is required"));
  }
  const decode = new Buffer.from(token, "base64").toString();
  if (
    `${process.env.BASEAUTH_USER}:${process.env.BASEAUTH_PASSWORD}` === decode
  ) {
    next();
  } else {
    return next(new ErrorResponse(401, "base token is invalid"));
  }
};
