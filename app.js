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
app.get('/', (req, res) => { //瀏覽全部餐廳
  Restaurant.find()//拿出Restaurant model所有東西
    .lean()
    .then(restaurants => res.render('index', { restaurants: restaurants }))
    .catch(error => console.log(error))
})

app.get('/restaurant/:id', (req, res) => { //瀏覽一家餐廳詳細資訊
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant: restaurant }))
    .catch(error => console.log(error))
})

app.get('/restaurant/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant: restaurant }))
    .catch(error => console.log(error))
})

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

app.get('/add', (req, res) => { //新增餐廳頁面
  res.render('add')
})

app.post('/add', (req, res) => { //從這邊開始寫！！！！！！！！！
  res.render('index')
  // const id = req.params.id
  // const name = req.body.name
  // const category = req.body.category
  // const location = req.body.location
  // const phone = req.body.phone
  // const description = req.body.description
  // return Restaurant.findById(id)
  //   .then(restaurant => {
  //     restaurant.name = name
  //     restaurant.category = category
  //     restaurant.location = location
  //     restaurant.phone = phone
  //     restaurant.description = description
  //     return restaurant.save()
  //   })
  //   .then(() => res.redirect(`/restaurant/${id}`))
  //   .catch(error => console.log(error))
})


// app.get('/search', (req, res) => {
//   const restaurants = restaurantList.results.filter(restaurant => {
//     return restaurant.name.toLowerCase().includes(req.query.keyword.toLowerCase().trim()) || restaurant.category.toLowerCase().includes(req.query.keyword.toLowerCase().trim())
//   })
//   const keyword = req.query.keyword
//   res.render('index', { restaurantList: restaurants, keyword: keyword })
// })

//start and listen on the express server 
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})