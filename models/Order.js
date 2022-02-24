const mongoose = require('mongoose')
const { Schema } = mongoose;
const SerialNumber = require('./serialNumber')
const moment = require('moment')

const orderSchema = new Schema({
    serialNumber: {
        type: String,
    },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    items: [{
        _id: {
            type: Schema.Types.ObjectId, ref: 'Item',
            required: true
        },
        color: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        qty: {
            type: Number,
            required: true
        },
        totalAmount: {
            type: Number,
            required: true
        },
        width: {
            size: {
                type: Number,
                required: true
            },
            unit: {
                type: String,
                required: true
            }
        },
        height: {
            size: {
                type: Number,
                required: true
            },
            unit: {
                type: String,
                required: true
            }
        },
    }]
    ,
    discount: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    finalAmount: {
        type: Number,
        required: true
    },
    paidAmount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },

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