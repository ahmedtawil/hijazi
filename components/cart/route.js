const router = require('express').Router()
const ErrorHandler = require('../../utils/errorHandler');
const catchAsyncErrors = require('../../middlewares/catchAsyncErrors');

const User = require('../../models/User')
const { addToCart, getCartPage, getCartTotalsData ,deleteItemFromCart  , getCartItemByIndex , editCartItemByIndex , updateCartTotalsData} = require('./controller')

const getCartDataMiddleware = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate({ path: 'cart.items.color', model: "Color" })
    req.user = user
    req.app.locals.cart = user.cart
    next()
})

router.route('/cart/add').post(getCartDataMiddleware, addToCart)
router.route('/cart/page/get').get(getCartDataMiddleware, getCartPage)
router.route('/cart/totals/data/get').get(getCartDataMiddleware, getCartTotalsData)
router.route('/cart/totals/data/update').post(getCartDataMiddleware, updateCartTotalsData)

router.route('/cart/item/index/get/:index').get(getCartDataMiddleware, getCartItemByIndex)
router.route('/cart/item/index/edit/:index').post(getCartDataMiddleware, editCartItemByIndex)

router.route('/cart/delete/item/:id').get(getCartDataMiddleware, deleteItemFromCart)



module.exports = router