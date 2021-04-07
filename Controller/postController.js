const { ConnectMongo } = require("../database/ConnecDB");
const Post = require("../database/models/Post");
const { asyncMiddleware } = require("../middleware/asyncMiddleware");
const ErrorResponse = require("../model/errorResponse");
const SucessResponse = require("../model/SucessResponse");

exports.CreatePost = asyncMiddleware(async (req, res, next) => {
  const { title, content } = req.body;
  const arr = req.files.map((val) => {
    return val.filename;
  });
  // console.log(req.user);
  const newPost = new Post({
    userId: req.user._id,
    title,
    content,
    picture: arr,
  });
  const savePost = await newPost.save();
  res.status(200).json(new SucessResponse(200, savePost));
});
exports.GetPost = asyncMiddleware(async (req, res, next) => {
  const { idPost } = req.params;
  const post = await Post.findById(idPost);
  if (!post) {
    return next(new ErrorResponse(404, "Id is not found"));
  }
  // lay hinh anh
  // const filename = post.picture[0];
  // const file = ConnectMongo.gfs.find({ filename }).toArray((err, files) => {
  //   if (!files || !files.length) {
  //     return next(new ErrorResponse(404, "file is not found"));
  //   }
  //   ConnectMongo.gfs.openDownloadStreamByName(filename).pipe(res);
  // });
  res.status(200).json(new SucessResponse(200, post));
});
exports.DeletePostById = asyncMiddleware(async (req, res, next) => {
  const { idPost } = req.params;
  const post = await Post.findById(idPost);
  if (!post) {
    return next(new ErrorResponse(404, "IdPost is not found"));
  }
  if (post.userId.toString() !== req.user._id) {
    return next(
      new ErrorResponse(404, "You do not have permission to delete this post")
    );
  }
  await Post.findByIdAndDelete(idPost);
  res
    .status(200)
    .json(new SucessResponse(200, "User has deleted the post successfully"));
});
exports.UpdatePostById = asyncMiddleware(async (req, res, next) => {
  const { idPost } = req.params;
  const { title, content } = req.body;
  const post = await Post.findById(idPost);
  if (!post) {
    return next(new ErrorResponse(404, "IdPost is not found"));
  }
  if (post.userId.toString() !== req.user._id) {
    return next(
      new ErrorResponse(404, "You do not have permission to update this post")
    );
  }
  const arr = req.files.map((val) => {
    return val.filename;
  });
  const newPost = await Post.findOneAndUpdate(
    { _id: idPost },
    {
      title,
      content,
      picture: arr,
    },
    { upsert: true, new: true }
  );
  res
    .status(200)
    .json(new SucessResponse(200, "User has update the post successfully"));
});
exports.likePost = asyncMiddleware(async (req, res, next) => {
  const { idPost } = req.params;
  const post = await Post.findById(idPost);
  if (!post) {
    return next(new ErrorResponse(404, "IdPost is not found"));
  }
  //neu da like thi xoa like
  if (!post.likes.includes(req.user._id)) {
    post.likes.push(req.user._id);
    const rs = await post.save();
    res.status(200).json(new SucessResponse(200, rs));
  } else {
    post.likes.pop(req.user._id);
    const rs = await post.save();
    res.status(200).json(new SucessResponse(200, rs));
  }
});
