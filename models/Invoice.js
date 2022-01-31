const mongoose = require('mongoose')
const { Schema } = mongoose;
const SerialNumber = require('./serialNumber')
const moment = require('moment')

const invoiceSchema = new Schema({
    serialNumber: {
        type: String
    },
    type: {
        type: String,
        enum: ['order', 'import', 'batch', 'return', 'extra', 'exchange']
    },

    invoiceModelType: {
        type: String,
        enum: ['Order', 'Import']
    },
    forModelType: {
        type: Schema.Types.ObjectId,
        refPath: 'ObjType'
    },

    invoiceModel: {
        type: String,
        enum: ['Customer', 'Supplier']
    },
    for: {
        type: Schema.Types.ObjectId,
        refPath: 'forType'
    },
    amount: {
        type: Number,
    },
    oldBalance: {
        type: Number,
    },
    newBalance: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },


})
module.exports = mongoose.model('Invoice', invoiceSchema)