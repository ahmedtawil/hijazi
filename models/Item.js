const mongoose = require('mongoose')
const { Schema } = mongoose;
const itemSchema = new Schema({
    title: {
        type: String,
        required:true
    },
    colors:[{
        color:{
            type:String,
            required:true
        },
        image:{
            type:String,
            required:true
        }
    }],   
    createdAt: {
        type: Date,
        default: Date.now
    },
})
module.exports = mongoose.model('Item', itemSchema)