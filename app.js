const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Restaurant = require('./models/restaurant')//載入Restaurant model
const methodOverride = require('method-override')
const routes = require('./routes/index')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

//資料庫連線
require('./config/mongoose')

const app = express()
const port = 3000

//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//setting static files
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)

//start and listen on the express server 
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})