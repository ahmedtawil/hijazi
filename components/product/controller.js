const mongoose = require('mongoose')
const ErrorHandler = require('../../utils/errorHandler');
const catchAsyncErrors = require('../../middlewares/catchAsyncErrors');
const uploadFile = require('../../configs/firebase');
const deleteFile = require('../../utils/deleteFile');
const Item = require('../../models/Item')


exports.getProductsPage = catchAsyncErrors(async (req, res) => {
  res.render('product/list')
})

exports.getProductsData = catchAsyncErrors(async (req, res) => {
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

  const productsCount = await Item.estimatedDocumentCount()
  const productsFillterCount = await Item.find(queryObj).countDocuments()
  const products = await Item.find(queryObj).limit(parseInt(query.length)).skip(parseInt(query.start))

  return res.json({
    recordsTotal: productsCount,
    recordsFiltered: productsFillterCount,
    products
  })


})


// post new Program

exports.newProduct = catchAsyncErrors(async (req, res) => {
  let title = req.body.title;
  let files = req.files;
  let colorsTitle = req.body.colorTitle ;
  const colors = [];
  
 console.log(colorsTitle.length);
 for (let i = 0; i < colorsTitle.length; ++i)
      {
        console.log("tiiiiiiiiitle")
        const object = {}
        object.color = colorsTitle[i];
        if (files[i] !== undefined )
        {
            console.log("fiiiiiiiiiiiles")
            console.log(files[i]);
            let fileURL = await uploadFile(
              i + '',
              `colorImage/files/${files[i].filename}`,
              files[i].mimetype,
              files[i].path
            );
            object.image = fileURL ;
            colors.push(object)
            console.log(colors) 
            deleteFile(files[i].path);
          
        }
      }
  let item = new Item({
    title:title,
    colors:colors
  });
  item.save()

 
  
  res.end()
})
// post editPage 

exports.editProduct = catchAsyncErrors(async (req, res) => {
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

exports.getProductByQuery = catchAsyncErrors(async (req, res) => {
  const query = req.query
  const product = await Product.findOne(query)
  res.send({success:true , product})
})





