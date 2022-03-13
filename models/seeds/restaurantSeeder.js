const restaurantList = require('../../restaurant.json').results
const Restaurant = require('../restaurant')  //載入restaurant model
const db = require('../../config/mongoose')
//取得資料庫連線狀態
db.once('open', () => {
  console.log('running restaurant script...')
  Restaurant.create(restaurantList)
    .then(() => {
      console.log('seeder create done!')
      db.close()
    })
    .catch(error => console.log(error))
    .finally(() => process.exit())
})