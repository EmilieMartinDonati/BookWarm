const { Schema, model } = require("mongoose");

const bookRedSchema = new Schema ({
    key: String,
    otherKey: String,
    title: String, 
    first_publish_year: Number,
    publish_year: [Number],
    number_of_pages_median: Number,
    isbn: [String],
    lccn: [String],
    publisher: [String],
    author_name: [String], 
    subject: [String],
    cover_i : Number,
    first_sentence: [String],
    author_alternative_name: [String],
    author_key : [String],
    author_name :  [String],
    rating: Number,
    reviews: [{ type: Schema.Types.ObjectId, ref: "reviews" }],
    image: {
        type: String,
        default: `https://www.publishersweekly.com/images/cached/ARTICLE_PHOTO/photo/000/000/073/73607-v1-600x.JPG`},
    user: { type: Schema.Types.ObjectId, ref: "User"},
    date: Date,
    })

const bookRedModel = model("book red", bookRedSchema);


module.exports = bookRedModel;

