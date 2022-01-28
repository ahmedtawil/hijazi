const router = require('express').Router()
const { getDashboard} = require('./controller')

router.route('/').get(getDashboard)

module.exports = router