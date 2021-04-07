const mongoose = require("mongoose");
const { Schema } = mongoose;
mongoose.set("runValidators", true);
const FriendsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    friendslist: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    waitinglist: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Friends", FriendsSchema, "Friends");
