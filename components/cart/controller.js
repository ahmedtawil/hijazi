const mongoose = require('mongoose')
const ErrorHandler = require('../../utils/errorHandler');
const catchAsyncErrors = require('../../middlewares/catchAsyncErrors');

const moment = require('moment')
const _ = require('lodash')

const Customer = require('../../models/Customer')
const Employee = require('../../models/Employee')

const priceCalc = require('../../utils/priceCalc')



exports.addToCart = catchAsyncErrors(async (req, res) => {
  const userID = req.user._id
  const { _id, color, qty, size } = req.body
  let { height_size, height_unit, width_size, width_unit } = req.body

  if (size != 'custom') {
    height_size = Math.sqrt(size),
    width_size = height_size
    height_unit = 'yard'
    width_unit = height_unit
  }

  const customer = await Employee.findById(userID)
  const price = priceCalc({ unit: height_unit, size: height_size }, { unit: width_unit, size: width_size }) * qty
  let newItem = {
    _id,
    color,
    price:parseInt(price),
    qty: parseInt(qty),
    totalAmount: price * qty,
    size:parseFloat(size),
    height: {
      unit: height_unit,
      size: parseFloat(height_size)
    },
    width: {
      unit: width_unit,
      size: parseFloat(width_size)
    }
  }
  if(customer.cart == 'undefined' || _.isEmpty(customer.cart)){
    
    const newCart = {
      customer: customer._id,
      items: [newItem],
      discount: 0,
      totalAmount: newItem.totalAmount,
      finalAmount: newItem.totalAmount,
      paidAmount: 0,
      createdAt: moment(),
      createdBy: customer._id
  
  
    }
    customer.cart = newCart
    console.log('cart not exist');

    customer.save()
  
  }else if(Object.keys(customer.cart).length > 0){
    const cart = {...customer.cart}
    const index = cart.items.findIndex(item=>(item._id === _id && item.color == color && _.isEqual(item.height ,newItem.height ) && _.isEqual(item.width ,newItem.width )))
    if(index < 0){
      cart.items.push(newItem)
      cart.totalAmount += newItem.totalAmount
      cart.finalAmount += newItem.totalAmount
      customer.cart = cart
      console.log('cart exist - item not exist');
    }else{
      cart.items[index].qty += newItem.qty
      cart.items[index].totalAmount += newItem.totalAmount
      cart.totalAmount += newItem.totalAmount
      cart.finalAmount += newItem.totalAmount
      customer.cart = cart
      console.log('cart exist - item exist');
    }
    customer.save()
  }

  res.end()

})



exports.getCart = catchAsyncErrors(async (req, res) => {
res.render('cart/view')
})

