const router = require('express').Router()
const {  newColor , getColorsPage , getColorsData} = require('./controller')

router.get('/colors/page/get' ,getColorsPage )
router.get('/colors/data/get' ,getColorsData )

router.post('/color/new' ,newColor )



module.exports = router