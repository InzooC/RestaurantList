if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')
const Restaurant = require('../restaurant')
const User = require('../user')
const bcrypt = require('bcryptjs')

const restaurantList = require('../../restaurant.json').results

const seedUsers = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678',
    restaurantsSerial: [1, 2, 3]
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678',
    restaurantsSerial: [4, 5, 6]
  }]

db.once('open', () => {
  return Promise.all( //第一層建立兩個user資料
    seedUsers.map(seedUser => {
      return bcrypt.genSalt(10)  //先把密碼做出來
        .then(salt => bcrypt.hash(seedUser.password, salt))
        .then(hash => User.create({
          name: seedUser.name,
          email: seedUser.email,
          password: hash
        }))
        .then(user => {
          const _id = user._id
          //把屬於特定user的餐廳篩出來
          const restaurants = restaurantList.filter(item =>
            seedUser.restaurantsSerial.includes(item.id)
          )
          //第二層，把userId放進餐廳資料後，建立資料
          return Promise.all(restaurants.map(item => {
            item.userId = _id
            return Restaurant.create(item)
          }))
        })

    })
  )
    .then(() => {
      console.log('restaurant seeder create done!')
      process.exit()
    })
    .catch(err => console.log(err))
})