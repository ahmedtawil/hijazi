const mongoose = require('mongoose')
const { Schema } = mongoose;
const colorSchema = new Schema({
    name: {
        type: String,
        required:true
    },
    hex: {
        type: String,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})
module.exports = mongoose.model('Color', colorSchema)