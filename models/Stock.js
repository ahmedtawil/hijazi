const mongoose = require('mongoose')
const { Schema } = mongoose;
const { errors } = require('../data/staticData');


const stockSchema = new Schema({
    item:{ type: Schema.Types.ObjectId, ref: 'Item', required: true },
    qty: {
        type: Number,
    },
})

module.exports = mongoose.model('Stock', stockSchema)