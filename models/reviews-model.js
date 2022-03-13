const { Schema, model } = require("mongoose");

const session = require("express-session");

const reviewSchema = new Schema({
    key: String,
    bookTitle: String,
    authorBook: String,
    review: String,
    user: { type: Schema.Types.ObjectId, ref: "User"},
    // book: { type: Schema.Types.ObjectId, ref: "book red"}
    // Revamp model :
    book: { type: Schema.Types.ObjectId, ref: "book"}
  });
  

const Review = model("reviews", reviewSchema);


module.exports = Review;
