const { Schema, model } = require("mongoose");

const bookWishlistSchema = new Schema ({
    key: String,
    title: String, 
    first_publish_year: Number,
    publish_year: [Number],
    number_of_pages_median: Number,
    isbn: [String],
    lccn: [String],
    publisher: [String],
    author_name: [String], 
    subject: [String],
    cover_i: Number,
    first_sentence: [String],
    author_alternative_name: [String],
    author_key: [String],
    image: String,
    author_name:  [String],
    })

const bookWishlistModel = model("wishlist", bookWishlistSchema);


module.exports = bookWishlistModel;