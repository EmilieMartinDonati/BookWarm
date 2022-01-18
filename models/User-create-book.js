const { Schema, model } = require("mongoose");

const usercreatebookSchema = new Schema ({
    title: String, 
    author_name: [String], 
})

const usercreatebookModel = model("user create book", usercreatebookSchema;

module.exports = usercreatebookModel;

