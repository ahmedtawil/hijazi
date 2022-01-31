const mongoose = require('mongoose')
const { Schema } = mongoose;
const moment = require('moment')

const serialNumberSchema = new Schema({
    title: {
        type: String,
        trim: true
    },
    counter: {
        type: Number,
        required: true,
        default:1000000
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})


serialNumberSchema.statics.newProduct = async function () {
    const productCounter = await mongoose.model('SerialNumber')
}

module.exports = mongoose.model('SerialNumber', serialNumberSchema)