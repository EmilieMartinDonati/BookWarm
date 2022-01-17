const { Schema, model } = require("mongoose");


const reviewSchema = Schema({
    title: String,
    bookTitle: String,
    authorBook:String,
  });
  
const review = mongoose.model('Review', {
  title: String,
  bookTitle: String
});

const Review = mongoose.model("review", reviewSchema);


module.exports = Review;
