const mongoose = require('mongoose')
const { Schema } = mongoose;
const SerialNumber = require('./serialNumber')
const moment = require('moment')

const orderSchema = new Schema({
    
})
orderSchema.pre('save', async function (next) {
    if(!this.serialNumber){
        if (this.isNew) {
            const counter = await SerialNumber.newOrder()
            this.serialNumber = counter
        }
    }
    next()
})



module.exports = mongoose.model('Order', orderSchema)