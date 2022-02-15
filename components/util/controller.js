const mongoose = require('mongoose')
const ErrorHandler = require('../../utils/errorHandler');
const catchAsyncErrors = require('../../middlewares/catchAsyncErrors');

const priceCalc = require('../../utils/priceCalc')



exports.calculatePrice = catchAsyncErrors(async (req, res) => {
  const payload = req.body
  const price = priceCalc(...payload)
  res.json(price)
})




