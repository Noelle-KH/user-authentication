const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const checkUser = require('./models/check-user')

const app = express()
const port = 3000

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
  const { email, password } = req.body
  const user = checkUser(email, password)
  if (user) {
    const firstName = user.firstName
    res.render('login', { firstName })
  } else {
    const wrongMessage = 'Incorrect email or password'
    res.render('index', { wrongMessage })
  }
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})