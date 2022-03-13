const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  userName: String,
  password: String,
  image: String,
  // Revamp models : ajouts.
  wishlist: [{ type: Schema.Types.ObjectId, ref: "book" }],
  read: [{ type: Schema.Types.ObjectId, ref: "book" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "reviews" }],
  commentsLiked: [{type: Schema.Types.ObjectId, ref: "reviews"}],
  essays: [{type: Schema.Types.ObjectId, ref: "essays"}],
  followers: [{type: Schema.Types.ObjectId, ref: "User"}],
  following: [{type: Schema.Types.ObjectId, ref: "User"}],
});

const User = model("User", userSchema);

module.exports = User;
