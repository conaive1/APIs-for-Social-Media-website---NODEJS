const mongoose = require("mongoose");
const { Schema } = mongoose;
const TokenSchema = new Schema({
  email: String,
  token: String,
  expired: String,
});
module.exports = mongoose.model("Token", TokenSchema);
