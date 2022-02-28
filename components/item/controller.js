const mongoose = require('mongoose')
const ErrorHandler = require('../../utils/errorHandler');
const catchAsyncErrors = require('../../middlewares/catchAsyncErrors');
const uploadFile = require('../../configs/firebase');
const deleteFile = require('../../utils/deleteFile');
const Item = require('../../models/Item')
const Color = require('../../models/Color');
const Unit = require('../../models/Unit');

const { units } = require('../../data/constants')


exports.getItemsPage = catchAsyncErrors(async (req, res) => {
  const colors = await Color.find()
  const items = await Item.find().populate('colors.color')
  //const units = await Unit.find()
  //res.render('item/table', { colors })

  res.render('item/list', { colors, items, units, unitsArr: Object.keys(units) })
})
exports.getItemsAdminPage = catchAsyncErrors(async (req, res) => {
  const colors = await Color.find()
  const units = await Unit.find()
  res.render('item/table', { colors })

})


exports.getItemsData = catchAsyncErrors(async (req, res) => {
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

  const itemsCount = await Item.estimatedDocumentCount()
  const itemsFillterCount = await Item.find(queryObj).countDocuments()
  const items = await Item.find(queryObj).limit(parseInt(query.length)).skip(parseInt(query.start))

  return res.json({
    recordsTotal: itemsCount,
    recordsFiltered: itemsFillterCount,
    items
  })


})


// post new Program

exports.newItem = catchAsyncErrors(async (req, res) => {
  let title = req.body.title;
  let files = req.files;
  let colorsTitle = req.body.colorTitle;
  if (!Array.isArray(colorsTitle)) {
    colorsTitle = [colorsTitle]
  }
  const colors = [];

  const promises = files.map(async (file, i) => {
    const object = {}
    if (file !== undefined) {
      let fileURL = await uploadFile(
        i + '',
        `colorImage/files/${file.filename}`,
        file.mimetype,
        file.path
      );
      object.color = colorsTitle[i];
      object.image = fileURL;
      colors.push(object)
      return deleteFile(file.path);
    }
  })

  await Promise.all(promises)
  let item = new Item({
    title: title,
    colors: colors
  });

  await item.save()

  res.end()
})
// post editPage 

exports.editItem = catchAsyncErrors(async (req, res) => {
  if (req.access.can(req.user.role).updateAny('program').granted) {

    let program = null
    const id = req.params.id

    if (!mongoose.isValidObjectId(id)) return next(new ErrorHandler('', 404))
    program = await Program.findById(id)
    if (!program) return next(new ErrorHandler('', 404))

    let data = JSON.parse(req.body.payload)
    _.assign(program, data)
    await program.save()
    res.send(program)
  } else {
    next(new ErrorHandler('unauthrized!', 403))
  }

})
exports.getItemById = catchAsyncErrors(async (req, res) => {
  const id = req.params.id
  const item = await Item.findById(id).populate('colors.color')
  res.json(item)
})



exports.getItemByQuery = catchAsyncErrors(async (req, res) => {
  const query = req.query
  const item = await Item.findOne(query)
  res.send({ success: true, item })
})





