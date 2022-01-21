const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  userName: String,
  password: String,
  image: String,
  // timestamps: true,
});

const User = model("User", userSchema);

module.exports = User;
