const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  id: {
    type: Number,
    require: true
  },
  name: {
    type: String,
    require: false
  },
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Restaurant', restaurantSchema)

// email: user1@example.com
// password: 12345678
// 擁有 #1, #2, #3 號餐廳