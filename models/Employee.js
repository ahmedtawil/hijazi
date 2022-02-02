const mongoose = require('mongoose')
const { Schema } = mongoose;
const { errors } = require('../data/staticData');
const jwt = require('jsonwebtoken')

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
employeeSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}
module.exports = mongoose.model('Employee', employeeSchema)