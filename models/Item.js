const mongoose = require('mongoose')
const { Schema } = mongoose;
const itemSchema = new Schema({

    serialNumber: {
        type: String,
        required: [true, errors.name.ar],
    },
    title: {
        type: String,
        required: [true, errors.name.ar],
    },
    manualPrice: {
        type: Boolean
    },
    price: {
        type: Number
    },
    manualSize: {
        type: Boolean
    },
    size: {
        type: Number
    },
    unit: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
    createdAt: {
        type: Date,
        default: new Date()
    },
})
module.exports = mongoose.model('Item', itemSchema)