const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;
// mongoose.set("runValidators", true);
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    avartar: {
      type: String,
    },
    gender: {
      type: ["male", "female", "gay"],
      default: "gay",
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [8, "pass must be at least 6 charcters"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
UserSchema.pre("save", async function (next) {
  const Salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, Salt);
  next();
});
UserSchema.statics.comparePassword = async function (password, hashedpassword) {
  return await bcrypt.compare(password, hashedpassword);
};
module.exports = mongoose.model("User", UserSchema, "User");
