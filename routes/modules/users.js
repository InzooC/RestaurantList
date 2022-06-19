const express = require('express') //引入express
const router = express.Router() //引入express的路由器
const User = require('../../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')

//定義首頁路由
router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/register'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post(('/register'), (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []  //errors功能還沒寫
  if (!email || !password || !confirmPassword) {
    errors.push({ massage: 'email ＆ 密碼都需要填寫' })
  }
  if (password !== confirmPassword) {
    errors.push({ massage: '密碼與驗證密碼不相同！' })
  }
  if (errors.length) {
    return res.render('register', {
      errors, name, email, password
    })
  }

  User.findOne({ email })
    .then(user => {
      if (user) {
        errors.push({ massage: '這個email已註冊過' })
        res.render('register', {
          errors, name, email, password
        })
      }
      return User.create({
        name,
        email,
        password
      })
        .then(res.redirect('/users/login'))
        .catch(err => console.log(err))

      //還沒有成功加入雜湊密碼
      // bcrypt.getSalt(10)
      //   .then(salt => bcrypt.hash(password, salt))
      //   .then(hash => User.create({
      //     name,
      //     email,
      //     password: hash
      //   })
      //     .then(res.redirect('/users/login'))
      //     .catch(err => console.log(err))
      //   )
    })
    .catch(err => console.log(err))
})

router.get('/logout', (req, res) => {
  req.logout() //Passport.js提供的函示
  res.redirect('/users/login')
})

//匯出路由器
module.exports = router