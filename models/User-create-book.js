const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usercreatebookSchema = new Schema ({
    title: String, 
    author_name: [String], 
    picture:{
        type:String,
    //changer mettre une immage avec ecrit ADD A PICTURE 
        default:"./../public/images/image-becoming-Michelle-Obama.jpeg"
    },
    first_sentence:[String],


})

const UsercreateModel = mongoose.model("Usercreate", usercreatebookSchema);

module.exports = UsercreateModel;

