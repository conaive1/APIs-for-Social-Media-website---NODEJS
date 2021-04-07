const User = require("../database/models/User");
const SucessResponse = require("../model/SucessResponse");
const { asyncMiddleware } = require("../middleware/asyncMiddleware");
const validator = require("validator");
const ErrorResponse = require("../model/errorResponse");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const MailService = require("../common/mail");
const Token = require("../database/models/Token");
const { findOne } = require("../database/models/User");
const Friends = require("../database/models/Friends");
exports.register = asyncMiddleware(async (req, res, next) => {
  const { name, gender, email, password } = req.body;
  const newUser = new User({
    name,
    gender,
    email,
    password,
    avartar: req.file.filename,
  });
  const saveUser = await newUser.save();
  await Friends({ userId: saveUser._id }).save();
  //tao token
  const token = crypto.randomBytes(30).toString("hex");
  //hash token roi luu vao db
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  // su dung fileoneandUpdate-->update doc neu ton tai,taomoi neu ko ton tai
  const newToken = await Token.findOneAndUpdate(
    { email },
    {
      email,
      token: hashedToken,
      expired: Date.now() + 1000 * 60 * process.env.RESETTOKEN_EXPIRED,
    },
    { upsert: true, new: true }
  );
  await MailService.sendMail(
    process.env.EMAIL,
    email,
    "an vao link duoi de kich hoat tai khoan",
    `<a href="http://localhost:3000/api/auth/register/${token}">http://localhost:3000/api/auth/register/${token}</a>`
  );
  res.status(200).json(new SucessResponse(200, `please check your email `));
});
exports.updateStatus = asyncMiddleware(async (req, res, next) => {
  const { token } = req.params;
  //hash token tu email roi so sanh voi db
  const hashtoken = crypto.createHash("sha256").update(token).digest("hex");
  //check token in db
  //$gt:greater than
  const dbtoken = await Token.findOne({
    token: hashtoken,
    expired: { $gt: Date.now() },
  });
  if (!dbtoken) {
    return next(new ErrorResponse(400, "Invalid Token"));
  }
  //neu token ton tai trong db va con han
  const user = await User.findOneAndUpdate(
    { email: dbtoken.email },
    { $set: { isActive: true } },
    { new: true }
  );
  if (!user) {
    return next(new ErrorResponse(404, "User is not found"));
  }
  res.status(200).json(new SucessResponse(200, "user is kich hoat"));
});
exports.login = asyncMiddleware(async (req, res, next) => {
  const { email, password } = req.body;
  const isExistEmail = await User.findOne({ email });
  if (isExistEmail) {
    const isMatchPassword = await User.comparePassword(
      password,
      isExistEmail.password
    );
    if (isMatchPassword) {
      //kiem tra tk da isActive chua
      if (!isExistEmail.isActive) {
        return next(
          new ErrorResponse(
            404,
            "Your account is inactive or locked, please contact your administrator"
          )
        );
      }
      const token = jwt.sign(
        {
          _id: isExistEmail.id,
          name: isExistEmail.name,
          avartar: isExistEmail.avartar,
          gender: isExistEmail.gender,
          email: isExistEmail.email,
        },
        process.env.JWT_KEY
      );
      return res.status(200).json(new SucessResponse(200, token));
    } else {
      return next(new ErrorResponse(400, "password is incore"));
    }
  } else {
    //404 la http status code khi k tim thay tai nguyen
    return next(new ErrorResponse(404, "Email is not found"));
  }
});
exports.ResetPassword = asyncMiddleware(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorResponse(400, "User is not found"));
  }
  //tao token
  const token = crypto.randomBytes(30).toString("hex");
  //hash token roi luu vao db
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  // su dung fileoneandUpdate-->update doc neu ton tai,taomoi neu ko ton tai
  const newToken = await Token.findOneAndUpdate(
    { email },
    {
      email,
      token: hashedToken,
      expired: Date.now() + 1000 * 60 * process.env.RESETTOKEN_EXPIRED,
    },
    { upsert: true, new: true }
  );
  await MailService.sendMail(
    process.env.EMAIL,
    email,
    "an vao link duoi de doi mat khau",
    `<a href="http://localhost:3000/api/auth/resetPassword/${token}">http://localhost:3000/api/auth/resetPassword/${token}</a>`
  );
  res.status(200).json(new SucessResponse(200, `please check your email `));
});
exports.updatePassword = asyncMiddleware(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;
  //hash token tu email roi so sanh voi db
  const hashtoken = crypto.createHash("sha256").update(token).digest("hex");
  //check token in db
  //$gt:greater than
  const dbtoken = await Token.findOne({
    token: hashtoken,
    expired: { $gt: Date.now() },
  });
  if (!dbtoken) {
    return next(new ErrorResponse(400, "Invalid Token"));
  }
  //neu token ton tai trong db va con han
  const user = await User.findOne({ email: dbtoken.email });
  if (!user) {
    return next(new ErrorResponse(404, "User is not found"));
  }
  user.password = password;
  await user.save();
  res.status(200).json(new SucessResponse(200, "Your Password is updated"));
});
