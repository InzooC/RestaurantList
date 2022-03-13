const express = require('express') //引入express
const router = express.Router() //引入express的路由器

const Restaurant = require('../../models/restaurant')//載入Restaurant model

//定義首頁路由
router.get('/', (req, res) => {
  Restaurant.find()//拿出Restaurant model所有東西
    .lean()
    .sort({ name: 'asc' })
    .then(restaurants => res.render('index', { restaurants: restaurants }))
    .catch(err => {
      console.error(error)
      res.render('errorPage', { error: '無法瀏覽首頁' })
    })
})

router.get('/search', (req, res) => {
  const rawKeyword = req.query.keyword
  const keyword = req.query.keyword.toLowerCase().trim()
  if (!rawKeyword) {
    res.redirect('/')
  }
  Restaurant.find({})
    .lean()
    .then(restaurantData => {
      const filterRestaurants = restaurantData.filter(
        data =>
          data.name.toLowerCase().includes(keyword) || data.category.toLowerCase().includes(keyword)
      )
      res.render('index', { restaurants: filterRestaurants, rawKeyword })
    })
    .catch(err => {
      console.error(error)
      res.render('errorPage', { error: '無法搜尋餐廳資訊' })
    })
})



//匯出路由器
module.exports = router