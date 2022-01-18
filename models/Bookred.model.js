const { Schema, model } = require("mongoose");

const bookRedSchema = new Schema ({
    key: String,
    title: String, 
    first_publish_year: Number,
    publish_year: [Number],
    number_of_pages_median: Number,
    ISBN : [String] || String,
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
    })

const bookRedModel = model("book red", bookRedSchema);


module.exports = bookRedModel;

