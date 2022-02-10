const router = require('express').Router()
const { getProductsData,getProductsPage , newProduct } = require('./controller')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/product/new' ,upload.array('image' , 12),newProduct )
router.route('/products/page/get').get(getProductsPage)
router.route('/products/data/get').get(getProductsData)



module.exports = router