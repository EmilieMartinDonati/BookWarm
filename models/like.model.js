const { Schema, model } = require("mongoose");

const likeSchema = new Schema({
    type: Number,
    review: { type: Schema.Types.ObjectId, ref: "reviews"},
    user: { type: Schema.Types.ObjectId, ref: "User"},
    book: { type: Schema.Types.ObjectId, ref: "book red"}
  });

const likeModel = model("like", likeSchema);

module.exports = likeModel;