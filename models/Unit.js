const mongoose = require('mongoose')
const { Schema } = mongoose;
const { errors } = require('../data/staticData');


const unitSchema = new Schema({
    title: {
        type: String,
        required: [true, errors.name.ar],
    },
    weight: {
        type: Number,
        required: [true, errors.name.ar],
    },
})

module.exports = mongoose.model('Unit', unitSchema)