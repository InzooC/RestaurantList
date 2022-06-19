const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const routes = require('./routes/index')

const usePassport = require('./config/passport')
require('./config/mongoose')

const app = express()
const port = 3000

//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(session({
  secret: 'thisIsMySecret',
  resave: false,
  saveUninitialized: true
}))


//setting static files
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

usePassport(app)

app.use(routes)

//start and listen on the express server 
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})