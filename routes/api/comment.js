const express = require("express");
const commentController = require("../../Controller/commentController");
const { jwtAuth } = require("../../middleware/jwtAuth");
const Router = express.Router();
Router.post("/create/:idPost", jwtAuth, commentController.CreateComment);
Router.delete(
  "/create/:idComment",
  jwtAuth,
  commentController.DeleteCommentById
);
Router.patch(
  "/create/:idComment",
  jwtAuth,
  commentController.UpdateCommentById
);
module.exports = Router;
