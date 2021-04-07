const express = require("express");
const Router = express.Router();
const PostController = require("../../Controller/postController");
const { jwtAuth } = require("../../middleware/jwtAuth");
const { Mongoupload } = require("../../middleware/mongoUpload");
Router.post(
  "/create",
  jwtAuth,
  Mongoupload.array("picture", 3),
  PostController.CreatePost
);
Router.get("/:idPost", PostController.GetPost);
Router.delete("/:idPost", jwtAuth, PostController.DeletePostById);
Router.patch(
  "/:idPost",
  jwtAuth,
  Mongoupload.array("picture", 3),
  PostController.UpdatePostById
);
Router.post("/like/:idPost", jwtAuth, PostController.likePost);
module.exports = Router;
