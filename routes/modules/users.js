const express = require('express') //引入express
const router = express.Router() //引入express的路由器

//定義首頁路由
router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})


//匯出路由器
module.exports = router