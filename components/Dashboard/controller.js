const mongoose = require('mongoose')
const ErrorHandler = require('../../utils/errorHandler');
const catchAsyncErrors = require('../../middlewares/catchAsyncErrors');

// get new Program page 

exports.getDashboard = catchAsyncErrors(async (req, res , next) => {
  res.render('dashboard/cpanel')
})
