const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
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

//setting router
app.get('/', (req, res) => {
  Restaurant.find()//拿出Restaurant model所有東西
    .lean()
    .then(restaurants => res.render('index', { restaurants: restaurants }))
    .catch(error => console.log(error))
})

app.get('/restaurant/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant: restaurant }))
    .catch(error => console.log(error))
})

// app.get('/search', (req, res) => {
//   const restaurants = restaurantList.results.filter(restaurant => {
//     return restaurant.name.toLowerCase().includes(req.query.keyword.toLowerCase().trim()) || restaurant.category.toLowerCase().includes(req.query.keyword.toLowerCase().trim())
//   })
//   const keyword = req.query.keyword
//   res.render('index', { restaurantList: restaurants, keyword: keyword })
// })

//start and listen on the express server> 
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})