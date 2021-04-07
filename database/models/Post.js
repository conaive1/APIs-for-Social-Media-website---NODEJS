const mongoose = require("mongoose");
const { Schema } = mongoose;
mongoose.set("runValidators", true);
const PostScheam = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    content: {
      type: String,
    },
    picture: {
      type: [String],
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: "Comment",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Post", PostScheam, "Post");
