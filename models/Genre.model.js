const { Schema, model } = require("mongoose");

// Model for the genre

const genreSchema = new Schema({
    // subject_facet: [String] = (les genres généraux)
    subject: [String]
    })
    
    const genreModel = model("genre", genreSchema)

    module.exports = genreModel;