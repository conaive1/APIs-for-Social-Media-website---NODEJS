const { asyncMiddleware } = require("../middleware/asyncMiddleware");
const Comment = require("../database/models/Comment");
const SucessResponse = require("../model/SucessResponse");
const Post = require("../database/models/Post");
const ErrorResponse = require("../model/errorResponse");
exports.CreateComment = asyncMiddleware(async (req, res, next) => {
  const { idPost } = req.params;
  const { content } = req.body;
  const post = await Post.findById(idPost);
  if (!post) {
    return next(new ErrorResponse(404, "Id is not found"));
  }
  const newComment = new Comment({
    idPost,
    content,
    userId: req.user._id,
  });
  const saveComment = await newComment.save();
  post.comments.push(saveComment._id);
  const savePost = await post.save();
  res.status(200).json(new SucessResponse(200, saveComment));
});
exports.DeleteCommentById = asyncMiddleware(async (req, res, next) => {
  const { idComment } = req.params;
  const comment = await Comment.findById(idComment);
  if (!comment) {
    return next(new ErrorResponse(404, "IdComment is not found"));
  }
  const post = await Post.findById(comment.idPost);
  if (!post) {
    return next(new ErrorResponse(404, "IdPost is not found"));
  }
  if (post.userId.toString() !== req.user._id) {
    return next(
      new ErrorResponse(
        404,
        "You do not have permission to delete this comment"
      )
    );
  }
  post.comments.pop(idComment);
  await post.save();
  await Comment.findByIdAndDelete(idComment);
  res
    .status(200)
    .json(new SucessResponse(200, "User has deleted the comment successfully"));
});
exports.UpdateCommentById = asyncMiddleware(async (req, res, next) => {
  const { idComment } = req.params;
  const { content } = req.body;
  const comment = await Comment.findById(idComment);
  if (!comment) {
    return next(new ErrorResponse(404, "Id is not found"));
  }
  if (comment.userId.toString() !== req.user._id) {
    return next(
      new ErrorResponse(
        404,
        "You do not have permission to update this comment"
      )
    );
  }
  await Comment.findOneAndUpdate(
    { _id: idComment },
    { content },
    { upsert: true }
  );
  res
    .status(200)
    .json(new SucessResponse(200, "User has update the comment successfully"));
});
