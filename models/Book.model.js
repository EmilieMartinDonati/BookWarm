const { Schema, model } = require("mongoose");

const authorSchema = new Schema ({
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
    })

const authorModel = model("author", authorSchema);

// Model for the genre

const genreSchema = newSchema({
// subject_facet: [String] = (les genres généraux)
subject_facet: [String]
})

const genreModel = model("genre", genreSchema)

module.exports = {authorModel, genreModel};