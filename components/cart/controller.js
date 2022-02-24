const mongoose = require('mongoose')
const ErrorHandler = require('../../utils/errorHandler');
const catchAsyncErrors = require('../../middlewares/catchAsyncErrors');

const moment = require('moment')
const _ = require('lodash')

const { units } = require('../../data/constants')

const Customer = require('../../models/User')
const User = require('../../models/User')

const priceCalc = require('../../utils/priceCalc')



exports.addToCart = catchAsyncErrors(async (req, res) => {
  const user = req.user
  const { _id, title, color, img, qty, size } = req.body
  let { height_size, height_unit, width_size, width_unit } = req.body

  if (size != 'custom') {
    height_size = Math.sqrt(size),
      width_size = height_size
    height_unit = 'yard'
    width_unit = height_unit
  }

  const price = priceCalc({ unit: height_unit, size: height_size }, { unit: width_unit, size: width_size })
  let newItem = {
    _id,
    title,
    img,
    color,
    price: parseInt(price),
    qty: parseInt(qty),
    totalAmount: price * qty,
    size: parseFloat(size),
    height: {
      unit: height_unit,
      size: parseFloat(height_size)
    },
    width: {
      unit: width_unit,
      size: parseFloat(width_size)
    }
  }
  if (user.cart == 'undefined' || _.isEmpty(user.cart)) {

    const newCart = {
      user: user._id,
      items: [newItem],
      paymentMethod:null,
      discount: 0,
      paidAmount: 0,
      createdAt: moment(),
      createdBy: user._id
    }
    calcTotals(newCart)

    user.cart = newCart
    console.log('cart not exist');

    user.save()

  } else if (Object.keys(user.cart).length > 0) {
    const cart = { ...user.cart }
    console.log(_id);
    const index = cart.items.findIndex(item => (item._id === _id && item.color._id == color && _.isEqual(item.height, newItem.height) && _.isEqual(item.width, newItem.width)))
    if (index < 0) {
      cart.items.push(newItem)
      calcTotals(cart)
      user.cart = cart
      console.log('cart exist - item not exist');
    } else {
      cart.items[index].qty += newItem.qty
      cart.items[index].totalAmount += newItem.totalAmount
      calcTotals(cart)
      user.cart = cart
      console.log('cart exist - item exist');
    }
    user.save()
  }

  res.end()

})

exports.deleteItemFromCart = catchAsyncErrors(async (req, res, next) => {
  const itemIndex = req.params.id
  const user = req.user

  const items = user.cart.items
  const removed = items.splice(itemIndex, 1);
  if(items.length==0){
    user.cart.paymentMethod = null
    user.cart.paidAmount = 0
  }

  user.cart.items = items
  user.cart.totalAmount -= removed[0].totalAmount
  user.cart.finalAmount -= removed[0].totalAmount
  await User.updateOne({ _id: user._id }, { $set: { cart: user.cart } })
  res.send({ success: true })
})


exports.getCartPage = catchAsyncErrors(async (req, res) => {
  res.render('cart/view', { units, unitsArr: Object.keys(units) })
})
exports.getCartTotalsData = catchAsyncErrors(async (req, res) => {
  const cart = { ...req.user.cart }
  delete cart.items
  return res.json(cart)
})


exports.getCartItemByIndex = catchAsyncErrors(async (req, res, next) => {
  const itemIndex = req.params.index
  const user = req.user
  const item = user.cart.items[itemIndex]
  res.send(item)
})


const calcTotals = (cart) => {
  let totalAmount = 0
  let discount = cart.discount
  let paidAmount = cart.paidAmount
  let finalAmount = 0
  cart.items.forEach(item => {
    totalAmount += item.totalAmount
  });
  cart.totalAmount = totalAmount
  cart.finalAmount = totalAmount - discount
}


exports.editCartItemByIndex = catchAsyncErrors(async (req, res, next) => {
  const itemIndex = req.params.index
  const { _id, title, color, img, qty, size } = req.body

  const user = req.user
  const cart = { ...user.cart }
  const items = [...cart.items]
  let { height_size, height_unit, width_size, width_unit } = req.body

  if (size != 'custom') {
    height_size = Math.sqrt(size),
      width_size = height_size
    height_unit = 'yard'
    width_unit = height_unit
  }

  const price = priceCalc({ unit: height_unit, size: height_size }, { unit: width_unit, size: width_size })
  let newItem = {
    _id,
    title,
    img,
    color,
    price: parseInt(price),
    qty: parseInt(qty),
    totalAmount: price * qty,
    size: parseFloat(size),
    height: {
      unit: height_unit,
      size: parseFloat(height_size)
    },
    width: {
      unit: width_unit,
      size: parseFloat(width_size)
    }
  }
  // if new item equal an existing item
  const index = items.findIndex(item => (item._id === _id && item.color._id == color && _.isEqual(item.height, newItem.height) && _.isEqual(item.width, newItem.width)))
  if (index >= 0 && index != itemIndex) {
    console.log(1);
    items[index].qty += newItem.qty
    items[index].totalAmount += newItem.totalAmount
    items.splice(itemIndex, 1)
    cart.items = items
  } else {
    console.log(2);
    const exsistItem = { ...items[itemIndex] }
    items[itemIndex] = newItem
    console.log(exsistItem);
    console.log(items[itemIndex]);
    cart.items = items
  }
  calcTotals(cart)


  const resd = await User.updateOne({ _id: user._id }, { $set: { cart: cart } })
  res.send({ success: true })



})


exports.updateCartTotalsData = catchAsyncErrors(async (req, res, next) => {
  const { totalAmount = 0, discount = 0, paidAmount = 0 , paymentMethod=null } = req.body
  const user = req.user
  const cart = user.cart
  cart.paymentMethod = paymentMethod 
  cart.totalAmount = totalAmount 
  cart.discount = discount 
  cart.paidAmount = paidAmount 

  await User.updateOne({ _id: user._id }, { $set: { cart: cart} })

  return res.json({paymentMethod , totalAmount , discount , paidAmount})
})
