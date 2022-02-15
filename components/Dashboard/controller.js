const mongoose = require('mongoose')
const ErrorHandler = require('../../utils/errorHandler');
const catchAsyncErrors = require('../../middlewares/catchAsyncErrors');
const priceCalc = require('../../utils/priceCalc')

// get new Program page 

exports.getDashboard = catchAsyncErrors(async (req, res , next) => {
  res.render('dashboard/cpanel')
  //res.render('item/list')
})
