const express = require('express')
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
// const restaurant = require('./models/restaurant')
const Restaurant = require('./models/restaurant')//載入Restaurant model
// const res = require('express/lib/response')
const methodOverride = require('method-override')


mongoose.connect('mongodb://localhost/restaurant')

//取得資料庫連線狀態
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

const app = express()

//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//setting static files
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

//setting router
//瀏覽全部餐廳
app.get('/', (req, res) => {
  Restaurant.find()//拿出Restaurant model所有東西
    .lean()
    .sort({ name: 'asc' })
    .then(restaurants => res.render('index', { restaurants: restaurants }))
    .catch(err => {
      console.error(error)
      res.render('errorPage', { error: '無法瀏覽首頁' })
    })
})

//瀏覽一家餐廳詳細資訊
app.get('/restaurant/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant: restaurant }))
    .catch(err => {
      console.error(error)
      res.render('errorPage', { error: '無法瀏覽此餐廳資訊' })
    })
})

//編輯一家餐廳資訊的頁面
app.get('/restaurant/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant: restaurant }))
    .catch(err => {
      console.error(error)
      res.render('errorPage', { error: '無法呈現編輯頁面' })
    })
})

//更新餐廳資訊
app.put('/restaurant/:id', (req, res) => {
  const id = req.params.id
  const { name, category, location, phone, description } = req.body
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
    .catch(err => {
      console.error(error)
      res.render('errorPage', { error: '無法新增餐廳資訊' })
    })
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
    .catch(err => {
      console.error(error)
      res.render('errorPage', { error: '無法新增餐廳資訊' })
    })
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
    .catch(err => {
      console.error(error)
      res.render('errorPage', { error: '無法搜尋餐廳資訊' })
    })
})

//刪除特定餐廳資料
app.delete('/restaurant/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(err => {
      console.error(error)
      res.render('errorPage', { error: '無法刪除餐廳資訊' })
    })
})


//start and listen on the express server 
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})