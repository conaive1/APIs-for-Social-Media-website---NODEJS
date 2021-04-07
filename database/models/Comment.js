const mongoose = require("mongoose");
const { Schema } = mongoose;
mongoose.set("runValidators", true);
const CommentSchema = new Schema(
  {
    idPost: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Comment", CommentSchema, "Comment");
