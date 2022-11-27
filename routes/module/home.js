const express = require('express')
const User = require('../../models/user-model')
const router = express.Router()

router.get('/', (req, res) => {
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

router.post('/', (req, res) => {
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


module.exports = router