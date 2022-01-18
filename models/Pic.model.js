const { Schema, model } = require("mongoose");



const picSchema = new Schema({
    image: String
    })
    
    const picModel = model("pic", picSchema)

    module.exports = picModel;