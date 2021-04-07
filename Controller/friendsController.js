const User = require("../database/models/User");
const Friends = require("../database/models/Friends");
const { asyncMiddleware } = require("../middleware/asyncMiddleware");
const ErrorResponse = require("../model/errorResponse");
const SucessResponse = require("../model/SucessResponse");

exports.AddFriends = asyncMiddleware(async (req, res, next) => {
  const { idFriends } = req.params;
  // tim user muon ket ban
  const friends = await User.findById(idFriends);
  if (!friends) {
    return next(new ErrorResponse(404, "IdFriends is not found"));
  }
  //neu co thi them vao danh sach  chờ
  const userFriends = await Friends.findOne({ userId: req.user._id });
  if (!userFriends.waitinglist.includes(idFriends)) {
    userFriends.waitinglist.push(idFriends);
    const rs = await userFriends.save();
    res.status(200).json(new SucessResponse(200, rs));
  } else {
    res
      .status(200)
      .json(new SucessResponse(200, "you have sent your friend request"));
  }
});
exports.ConfirmFriends = asyncMiddleware(async (req, res, next) => {
  const { idFriends } = req.params;
  const friends = await User.findById(idFriends);
  if (!friends) {
    return next(new ErrorResponse(404, "IdFriends is not found"));
  }
  const userFriends = await Friends.findOne({ userId: req.user._id });
  if (!userFriends.waitinglist.includes(idFriends)) {
    return next(
      new ErrorResponse(
        400,
        "This person is not on the waiting list for confirmation"
      )
    );
  }
  if (!userFriends.friendslist.includes(idFriends)) {
    userFriends.friendslist.push(idFriends);
    //xoa khoi danh sach chờ
    userFriends.waitinglist.pop(idFriends);
    const rs = await userFriends.save();
    res.status(200).json(new SucessResponse(200, rs));
  } else {
    res
      .status(200)
      .json(new SucessResponse(200, "This person is already your friend"));
  }
});
exports.DeleteFriends = asyncMiddleware(async (req, res, next) => {
  const { idFriends } = req.params;
  const friends = await User.findById(idFriends);
  if (!friends) {
    return next(new ErrorResponse(404, "IdFriends is not found"));
  }
  const userFriends = await Friends.findOne({ userId: req.user._id });
  if (userFriends.friendslist.includes(idFriends)) {
    userFriends.friendslist.pop(idFriends);
    const rs = await userFriends.save();
    res.status(200).json(new SucessResponse(200, rs));
  } else {
    res
      .status(200)
      .json(new SucessResponse(400, "This person is not your friend yet"));
  }
});
