const express = require("express");
const authControler = require("../../Controller/authControler");
const { baseAuht } = require("../../middleware/baseAuth");
const { Mongoupload } = require("../../middleware/mongoUpload");
const Router = express.Router();
Router.post(
  "/register",
  baseAuht,
  Mongoupload.single("avartar"),
  authControler.register
);
Router.post("/login", authControler.login);
module.exports = Router;
