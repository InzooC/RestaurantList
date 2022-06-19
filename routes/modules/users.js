const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../../models/user')

//定義首頁路由
router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!email || !password || !confirmPassword) {
    errors.push({ massage: 'email ＆ 密碼都需要填寫' })
  }
  if (password !== confirmPassword) {
    errors.push({ massage: '密碼與驗證密碼不相同！' })
  }
  if (errors.length) {
    return res.render('register', {
      errors, name, email, password, confirmPassword
    })
  }

  User.findOne({ email })
    .then(user => {
      if (user) {
        errors.push({ massage: '這個email已註冊過' })
        return res.render('register', {
          errors, name, email, password
        })
      }
      // return User.create({
      //   name,
      //   email,
      //   password
      // })
      //   .then(res.redirect('/users/login'))
      //   .catch(err => console.log(err))

      //還沒有成功加入雜湊密碼
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({
          name,
          email,
          password: hash
        }))
        .then(res.redirect('/users/login'))
        .catch(err => console.log(err))
    })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

//匯出路由器
module.exports = router