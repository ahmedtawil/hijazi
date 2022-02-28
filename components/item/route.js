const router = require('express').Router()
const { getItemsData,getItemsPage ,getItemsAdminPage, newItem  , getItemById} = require('./controller')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/item/new' ,upload.array('image' , 12),newItem )
router.get('/item/get/:id' , getItemById)

router.route('/items/page/get').get(getItemsPage)
router.route('/admin/items/page/get').get(getItemsAdminPage)

router.route('/items/data/get').get(getItemsData)



module.exports = router