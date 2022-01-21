const { Schema, model } = require("mongoose");

const likeSchema = new Schema({
    // type: String,
    // review: { type: Schema.Types.ObjectId, ref: "reviews"},
    // user: { type: Schema.Types.ObjectId, ref: "User"},
    // book: { type: Schema.Types.ObjectId, ref: "book red"},
    type: String,
    review: String
  });

const likeModel = model("like", likeSchema);

module.exports = likeModel;

// Chaque fois qu'on va clicker, créer un nouveau like : LikeSchema.create. 

// Au moment de créer ce like, on fait = like.create({code: {req.body}})    

// On se retrouve avec un like avec un champ code qui comprend le contenu de la revue.

// Au moment de display la page oneBook, on fait un likeSchema.find({review})

// On stocke le résultat du find dans un tableau. 

// ce qu'on affiche sur la page, c'est : ce tableau.length.


