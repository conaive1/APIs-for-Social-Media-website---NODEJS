const express = require("express");
const authControler = require("../../Controller/authController");
const { baseAuht } = require("../../middleware/baseAuth");
const { Mongoupload } = require("../../middleware/mongoUpload");
const Router = express.Router();
Router.post(
  "/register",
  baseAuht,
  Mongoupload.single("avartar"),
  authControler.register
);
Router.post("/login", baseAuht, authControler.login);
Router.post("/register/:token", baseAuht, authControler.updateStatus);
Router.post("/resetPassword", baseAuht, authControler.ResetPassword);
Router.post("/resetPassword/:token", baseAuht, authControler.updatePassword);
module.exports = Router;
