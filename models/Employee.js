const mongoose = require('mongoose')
const { Schema } = mongoose;
const { errors } = require('../data/staticData');
const employeeSchema = new Schema({
    name: {
        type: String,
        required: [true, errors.name.ar],
    },
    email: {
        type:String,
        required:[true , errors.email.ar]
    },
    password:{
        type:String,
        default:'123456789'
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
})

module.exports = mongoose.model('Employee', employeeSchema)