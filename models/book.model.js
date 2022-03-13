const mongoose = require("mongoose");
const {Schema , model } = require("mongoose");

const bookSchema = new Schema ({
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
    cover_i : Number,
    first_sentence: [String],
    author_alternative_name: [String],
    author_key : [String],
    author_name :  [String],
    totalRate: {
        type: Number,
        default: 0},
    nbRates: {
        type: Number,
        default: 0},
    avgRate: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        default: `https://www.publishersweekly.com/images/cached/ARTICLE_PHOTO/photo/000/000/073/73607-v1-600x.JPG`},
    readBy: [{ type: Schema.Types.ObjectId, ref: "User"}],
    wishedBy: [{ type: Schema.Types.ObjectId, ref: "User"}],
    date: Date,
    genre: [String],
})

const book = model("book", bookSchema);

module.exports = book;
