const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./models/user-model')
const cookieParser = require('cookie-parser')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URL)

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

const app = express()
const port = 3000

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/', (req, res) => {
  const id = req.cookies.userId
  User.findById(id)
    .lean()
    .then(user => {
      if (user) {
        const firstName = user.firstName
        res.render('login', { firstName })
      } else {
        res.render('index')
      }
    })
})

app.post('/', (req, res) => {
  const { email, password } = req.body
  User.findOne({ email, password })
    .lean()
    .then(user => {
      if (user) {
        const firstName = user.firstName
        const userId = user._id.toString()
        res.cookie('userId', userId)
        res.render('login', { firstName })
      } else {
        const wrongMessage = 'Incorrect email or password'
        res.render('index', { wrongMessage })
      }
    })
    .catch(error => console.log(error))
})

app.get('/logout', (req, res) => {
  res.clearCookie('userId')
  res.redirect('/')
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})