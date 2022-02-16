const router = require('express').Router()
const { addToCart , getCart } = require('./controller')

router.route('/cart/add').post(addToCart)
router.route('/cart/get').get(getCart)



module.exports = router