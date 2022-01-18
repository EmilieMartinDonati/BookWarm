const { Schema, model } = require("mongoose");

const session = require("express-session");

const reviewSchema = new Schema({
    key: String,
    bookTitle: String,
    authorBook: String,
    review: String,
    user: { type: Schema.Types.ObjectId, ref: "User"},
    book: { type: Schema.Types.ObjectId, ref: "book red"}
  });
  
// const review = mongoose.model('Review', {
//   title: String,
//   bookTitle: String
// });

const Review = model("reviews", reviewSchema);


module.exports = Review;
