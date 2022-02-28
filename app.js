const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')

//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//setting static files
app.use(express.static('public'))

//setting router
app.get('/', (req, res) => {
  res.render('index', { restaurantList: restaurantList.results })
})

//start and listen on the express server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})