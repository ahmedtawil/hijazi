const router = require('express').Router()
const { calculatePrice  } = require('./controller')

router.route('/price/calculate').post(calculatePrice)



module.exports = router