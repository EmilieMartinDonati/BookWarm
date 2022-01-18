const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
    key: String,
    bookTitle: String,
    authorBook: String,
    review: String,
  });
  
// const review = mongoose.model('Review', {
//   title: String,
//   bookTitle: String
// });

const Review = model("reviews", reviewSchema);


module.exports = Review;
