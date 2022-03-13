const express = require('express') //引入express
const router = express.Router() //引入express的路由器

//引入home模組
const home = require('./modules/home')
const restaurant = require('./modules/restaurant')

//網址符合  /  的req導向home模組
router.use('/', home)
router.use('/restaurant', restaurant)


//匯出路由器
module.exports = router