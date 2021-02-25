const ErrorResponse = require("../model/errorResponse");
const jwt = require("jsonwebtoken");
const User = require("../database/models/User");
const jwtAuth = async (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;

  if (!token) {
    return next(new ErrorResponse(401, "Unauthorization"));
  }
  //kiem tra token
  try {
    //neu verify thanh cong ,tra ve thong tin trong payload
    const payload = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findOne({ email: payload.email });
    if (user) {
      req.user = payload;
      next();
    } else {
      return next(new ErrorResponse(401, "Unauthorization"));
    }
  } catch (error) {
    return next(new ErrorResponse(401, "Unauthorization"));
  }
};
exports.jwtAuth = jwtAuth;
