const mongoose = require('mongoose')
const { Schema } = mongoose;
const { errors } = require('../data/staticData');

const { objToEnumArr, sex, socialState, citizen, governorate, days } = require('../data/enumeration');

const customerSchema = new Schema({
    name: {
        type: String,
        required: [true, errors.name.ar],
    },
    formalID: {
        type: String,
        maxlength: [9, errors.formalID[1].ar],
        minlength: [9, errors.formalID[1].ar],
        required: [true, errors.formalID[0].ar],
        validate:
            [
                {
                    validator: async function (formalID) {
                        const user = await this.constructor.findOne({ formalID });
                        if (user) {

                            if (this.id == user.id) {
                                return true;
                            }
                            return false;
                        }
                        return true
                    },
                    message: errors.formalID[2].ar
                }, {
                    validator: function (formalID) {
                        return !isNaN(Number(formalID)) && formalID.indexOf('0') != 0

                    },
                    message: errors.formalID[3].ar
                }
            ],
        trim: true
    },
    phoneNumber: {
        type: String,
        maxlength: [10, errors.phoneNumber[1].ar],
        minlength: [10, errors.phoneNumber[1].ar],
        required: [true, errors.phoneNumber[0].ar],
        validate: {
            validator: function (v) {
                return !isNaN(Number(v)) && (v.indexOf('059') == 0 || v.indexOf('056') == 0)
            },
            message: errors.phoneNumber[2].ar
        },
        trim: true
    },
    address: {
        type: String,
        required: [true, 'عنوان الزبون مطلوب'],
    },
    email: {
        type:String,
        required:[true , errors.email.ar]
    },
    password:{
        type:String,
        default:'123456789'
    },
    balance: {
        type: Number,
        default:0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})
module.exports = mongoose.model('Customer', customerSchema)