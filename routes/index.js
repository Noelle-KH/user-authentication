const express = require('express')
const router = express.Router()

const home = require('./module/home')
const logout = require('./module/logout')

router.use('/', home)
router.use('/logout', logout)

module.exports = router