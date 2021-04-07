const express = require("express");
const Router = express.Router();
const FriendsController = require("../../Controller/friendsController");
const { jwtAuth } = require("../../middleware/jwtAuth");
Router.post("/:idFriends", jwtAuth, FriendsController.AddFriends);
Router.post("/comfirm/:idFriends", jwtAuth, FriendsController.ConfirmFriends);
Router.delete("/:idFriends", jwtAuth, FriendsController.DeleteFriends);
module.exports = Router;
