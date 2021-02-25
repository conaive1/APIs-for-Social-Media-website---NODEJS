const User = require("../database/models/User");
const SucessResponse = require("../model/SucessResponse");
const { asyncMiddleware } = require("../middleware/asyncMiddleware");
const validator = require("validator");
const ErrorResponse = require("../model/errorResponse");
const jwt = require("jsonwebtoken");
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
  res.status(201).json(new SucessResponse(201, saveUser));
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
      const token = jwt.sign(
        {
          name: isExistEmail.name,
          avartar: isExistEmail.avartar,
          gender: isExistEmail.gender,
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
