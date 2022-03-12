const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const restaurant = require('./models/restaurant')
const Restaurant = require('./models/restaurant')//載入Restaurant model

mongoose.connect('mongodb://localhost/restaurant')

//取得資料庫連線狀態
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//setting static files
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))


//setting router
//瀏覽全部餐廳
app.get('/', (req, res) => {
  Restaurant.find()//拿出Restaurant model所有東西
    .lean()
    .then(restaurants => res.render('index', { restaurants: restaurants }))
    .catch(error => console.log(error))
})

//瀏覽一家餐廳詳細資訊
app.get('/restaurant/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant: restaurant }))
    .catch(error => console.log(error))
})

//編輯一家餐廳資訊
app.get('/restaurant/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant: restaurant }))
    .catch(error => console.log(error))
})

//更新餐廳資訊
app.post('/restaurant/:id/edit', (req, res) => {
  const id = req.params.id
  const name = req.body.name
  const category = req.body.category
  const location = req.body.location
  const phone = req.body.phone
  const description = req.body.description
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = name
      restaurant.category = category
      restaurant.location = location
      restaurant.phone = phone
      restaurant.description = description
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurant/${id}`))
    .catch(error => console.log(error))
})

//新增餐廳頁面
app.get('/add', (req, res) => {
  res.render('add')
})

//新增一間餐廳資訊
app.post('/add', (req, res) => {
  const newRestaurant = req.body
  Restaurant.create(newRestaurant)
    .then(() => {
      console.log('mongodb create a new data!')
      res.redirect('/')
    })
    .catch(error => console.log(error))
})

//搜尋特定餐廳
app.get('/search', (req, res) => {
  const rawKeyword = req.query.keyword
  const keyword = req.query.keyword.toLowerCase().trim()
  if (!keyword) {
    res.redirect('/')
  }
  Restaurant.find()
    .lean()
    .then(restaurantData => {
      const filterRestaurants = restaurantData.filter(
        data =>
          data.name.toLowerCase().includes(keyword) || data.category.toLowerCase().includes(keyword)
      )
      res.render('index', { restaurants: filterRestaurants, rawKeyword })
    })
    .catch(error => console.log(error))
})



// const restaurants = restaurantList.results.filter(restaurant => {
//   return restaurant.name.toLowerCase().includes(req.query.keyword.toLowerCase().trim()) || restaurant.category.toLowerCase().includes(keyword)
// })

// const keyword = req.query.keyword
// res.render('index', { restaurantList: restaurants, keyword: keyword })


//start and listen on the express server 
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})