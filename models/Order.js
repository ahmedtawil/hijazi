const mongoose = require('mongoose')
const { Schema } = mongoose;
const SerialNumber = require('./serialNumber')
const moment = require('moment')

const orderSchema = new Schema({
    serialNumber: {
        type: String,
        required: [true, errors.name.ar],
    },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    items: [{
        _id: { type: Schema.Types.ObjectId, ref: 'Item' },
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
    }]
    ,
    discount: {
        type: Number
    },
    totalAmount: {
        type: Number
    },
    finalAmount: {
        type: Number
    },
    paidAmount: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },

})
orderSchema.pre('save', async function (next) {
    if (!this.serialNumber) {
        if (this.isNew) {
            const counter = await SerialNumber.newOrder()
            this.serialNumber = counter
        }
    }
    next()
})



module.exports = mongoose.model('Order', orderSchema)