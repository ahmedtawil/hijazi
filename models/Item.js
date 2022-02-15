const mongoose = require('mongoose')
const { Schema } = mongoose;
const itemSchema = new Schema({
    title: {
        type: String,
        required:true
    },
    colors:[{
        _id: false,
        color:{
            type: Schema.Types.ObjectId, ref: 'Color',
            required: true
        },
        image:{
            type:String,
            required:true
        }
    }],
    isUsed:{
        type:Boolean,
        default:true
    },   
    createdAt: {
        type: Date,
        default: Date.now
    },
})
module.exports = mongoose.model('Item', itemSchema)