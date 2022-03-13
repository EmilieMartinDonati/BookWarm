const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  userName: String,
  password: String,
  image: String,
  wishlist: [{ type: Schema.Types.ObjectId, ref: "book" }],
  read: [{ type: Schema.Types.ObjectId, ref: "book" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "reviews" }],
  commentsLiked: [{type: Schema.Types.ObjectId, ref: "reviews"}],
  booksRated: [{type: Schema.Types.ObjectId, ref: "reviews"}],
  essays: [{type: Schema.Types.ObjectId, ref: "essays"}],
  followers: [{type: Schema.Types.ObjectId, ref: "User"}],
  following: [{type: Schema.Types.ObjectId, ref: "User"}],
});

const User = model("User", userSchema);

module.exports = User;
