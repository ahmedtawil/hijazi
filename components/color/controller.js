const mongoose = require('mongoose')
const ErrorHandler = require('../../utils/errorHandler');
const catchAsyncErrors = require('../../middlewares/catchAsyncErrors');
const Color = require('../../models/Color')


exports.getColorsPage = catchAsyncErrors(async (req, res) => {
  res.render('color/list')
})
exports.newColor = catchAsyncErrors(async (req, res) => {
  const data = req.body
  const newColor = new Color(data)
  newColor.save()
  res.end()
})

exports.getColorsData = catchAsyncErrors(async (req, res) => {
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

  const colorsCount = await Color.estimatedDocumentCount()
  const colorsFillterCount = await Color.find(queryObj).countDocuments()
  const colors = await Color.find(queryObj).limit(parseInt(query.length)).skip(parseInt(query.start))

  return res.json({
    recordsTotal: colorsCount,
    recordsFiltered: colorsFillterCount,
    colors
  })


})





