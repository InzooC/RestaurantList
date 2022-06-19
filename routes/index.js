const express = require('express') //引入express
const router = express.Router() //引入express的路由器

//引入home模組
const home = require('./modules/home')
const restaurant = require('./modules/restaurant')
const user = require('./modules/users')
const auth = require('./modules/auth')

const { authenticator } = require('../middleware/auth')

//網址符合  /  的req導向home模組
router.use('/users', user)
router.use('/restaurant', authenticator, restaurant)
router.use('/auth', auth)
router.use('/', authenticator, home)


//匯出路由器
module.exports = router