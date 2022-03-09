const restaurantList = require('../../restaurant.json').results
const mongoose = require('mongoose')
const Restaurant = require('../restaurant')  //載入restaurant model
mongoose.connect('mongodb://localhost/restaurant')

//取得資料庫連線狀態
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('running restaurant script...')

  Restaurant.create(restaurantList)
    .then(() => {
      console.log('mongodb connected!')
    })
    .catch(error => console.log(error))
})