const express = require('express') //引入express
const router = express.Router() //引入express的路由器

const Restaurant = require('../../models/restaurant')//載入Restaurant model

//新增餐廳頁面
router.get('/add', (req, res) => {
  res.render('add')
})

//新增一間餐廳資訊
router.post('/', (req, res) => {
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

//瀏覽一家餐廳詳細資訊
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant: restaurant }))
    .catch(error => {
      console.log(error)
      res.render('errorPage', { error: '無法瀏覽此餐廳資訊' })
    })
})

//編輯一家餐廳資訊的頁面
router.get('/:id/edit', (req, res) => {
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
router.put('/:id', (req, res) => {
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

//刪除特定餐廳資料
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(err => {
      console.error(error)
      res.render('errorPage', { error: '無法刪除餐廳資訊' })
    })
})

//匯出路由器
module.exports = router