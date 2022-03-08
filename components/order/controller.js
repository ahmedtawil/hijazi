const mongoose = require('mongoose')
const Order = require('../../models/Order');
const User = require('../../models/User')

const ErrorHandler = require('../../utils/errorHandler');
const catchAsyncErrors = require('../../middlewares/catchAsyncErrors');
const { units } = require('../../data/constants')
const moment = require('moment')



exports.getOrdersData = catchAsyncErrors(async (req, res) => {
  const query = req.query

  const queryValue = (req.query.search.value == '') ? {} : JSON.parse(query.search.value)
  let queryObj = {}

  if (queryValue.filter) {
    queryObj.$and = [queryValue.filter]
  }

  if (queryValue.search) {
    let val = queryValue.search
    const qu = {
      $regex: val,
      $options: 'i'
    }
    const searchQuery = { $or: [{ formalID: qu }, { name: qu }, { phoneNumber: qu }] }
    if (queryValue.filter) {
      queryObj.$and.push(searchQuery)
    } else {
      queryObj = searchQuery
    }
  }

  const OrdersCount = await Order.estimatedDocumentCount()
  const OrdersFillterCount = await Order.find(queryObj).countDocuments()
  const Orders = await Order.find(queryObj).populate('customer').limit(parseInt(query.length)).skip(parseInt(query.start))

  return res.json({
    recordsTotal: OrdersCount,
    recordsFiltered: OrdersFillterCount,
    Orders
  })


})

exports.getOrdersPage = catchAsyncErrors(async (req, res) => {
  res.render('order/list' , { units, unitsArr: Object.keys(units)})
})

/// get Order by id 
exports.getOrder = catchAsyncErrors(async (req, res) => {
    const id = req.params.id
    if (!mongoose.isValidObjectId(id)) return next(new ErrorHandler('', 404))
    let order = await Order.findById(id).populate('customer').populate('items.color').lean()
    if (!order) return next(new ErrorHandler('لا يوجد طلبية', 404))
    res.render('order/orderPage', {order , moment , units, unitsArr: Object.keys(units)})
})
/// set status Order by id 
exports.setStatusOrder = catchAsyncErrors(async (req, res , next) => {
  const data = req.body
  let customer
  let order = await Order.findById(data.orderId)
  if (!order) return next(new ErrorHandler('لا يوجد طلبية', 404))
  if (data.status == order.status) return res.status(400).json({error: "لم يتم تغيير الحالة"})
  switch (data.status) {
    case "pending":
      order.status = "pending";
      break;
    case "approved":
      customer = await User.findById(order.customer)
      console.log(customer);
      customer.balance =+ order.totalAmount ;
      order.status = "approved";
        break; 
    case "rejected":
      order.status = "rejected";
        break;
    case "recived":
       order.status = "recived";
        break;  
  }
  await customer.save()
  await order.save()
  res.send()

})
exports.getOrdersForCustomer = catchAsyncErrors(async (req, res, next) => {
  const query = req.query
  const customerID = req.params.customerID

  if (!mongoose.isValidObjectId(customerID)) return next(new ErrorHandler('', 404))
  const customer = await User.findById(customerID)
  if (!customer) return next(new ErrorHandler('', 404))


  const queryValue = (req.query.search.value == '') ? {} : JSON.parse(query.search.value)
  let queryObj = {}

  if (queryValue.filter) {
    queryObj.$and = [queryValue.filter]
  }

  if (queryValue.search) {
    let val = queryValue.search
    const qu = {
      $regex: val,
      $options: 'i'
    }
    const customersIDs = await User.find({ name: qu }, { _id: 1 })
    const searchQuery = { $or: [{ serialNumber: qu }, { customer: { $in: customersIDs } }] }
    if (queryValue.filter) {
      queryObj.$and.push(searchQuery)
    } else {
      queryObj = searchQuery
    }
  }

  const ordersCount = await Order.countDocuments({ customer: customerID })
  const orders = await Order.find({ customer: customerID }).find(queryObj).sort({ createdAt: -1 }).limit(parseInt(query.length)).skip(parseInt(query.start))
  return res.json({
    recordsTotal: ordersCount,
    recordsFiltered: orders.length,
    orders
  })


})

/// get Order by id 
exports.getPrintOrder = catchAsyncErrors(async (req, res , next) => {
  const query = req.query
  console.log(query);
  let order = await Order.findOne(query).sort({createdAt:-1}).populate('customer').populate('items.color')
  if (!order) return next(new ErrorHandler('لا يوجد طلبية', 404))
  res.render('order/printOrder', {order , moment , units, unitsArr: Object.keys(units) , layout: false})
})
