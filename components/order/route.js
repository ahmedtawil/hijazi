const router = require('express').Router()
const { getOrdersPage , getOrdersData , getOrder , setStatusOrder , getPrintOrder , getOrdersForCustomer} = require('./controller')

router.route('/orders/page/get').get(getOrdersPage)
router.route('/orders/data/get').get(getOrdersData)
router.get('/order/print', getPrintOrder)
router.route('/order/:id').get(getOrder)
// router.route('/order/print/:id').get(getOrder)
router.route('/order/status').post(getPrintOrder)
router.route('/orders/data/customer/get/:customerID').get(getOrdersForCustomer)



module.exports = router