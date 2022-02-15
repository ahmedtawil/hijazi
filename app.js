const express = require('express');
require('dotenv').config({ path: './configs/config.env' })
const path = require('path')
const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middlewares/errors')
const ErrorHandler = require('./utils/errorHandler');
const {isAuthenticatedUser} = require('./middlewares/auth')
const expressLayouts = require('express-ejs-layouts');


const item = require('./components/item/route')
const unit = require('./components/unit/route')
const color = require('./components/color/route')

const customerRoute = require('./components/customer/route')
const dashboardRoute = require('./components/Dashboard/route')
const authRoute = require('./components/auth/route')


const util = require('./components/util/route')


const app = express();
app.use(expressLayouts)
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use('/' , authRoute)
//app.use(isAuthenticatedUser)
app.use(async(req, res, next) => {
    res.locals.user = req.user
    next()
})
app.use('/', unit)
app.use('/', color)

app.use('/', dashboardRoute)
app.use('/', customerRoute)
app.use('/', item)


app.use('/', util)











app.get((req, res, next) => {
    next(new ErrorHandler('dfdf', 404))
})

// Middleware to handle errors
app.use(errorMiddleware);


module.exports = app

