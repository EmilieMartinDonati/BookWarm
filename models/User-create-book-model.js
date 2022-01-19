const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usercreatebookSchema = new Schema ({
    title: String, 
    author_name: [String], 
    picture: {
        type: String,
        default: "./../public/images/image-becoming-Michelle-Obama.jpeg"
    },
    first_sentence: [String],
    user: { type: Schema.Types.ObjectId, ref: "User"}
})

const UsercreateModel = mongoose.model("Usercreate", usercreatebookSchema);

module.exports = UsercreateModel;

