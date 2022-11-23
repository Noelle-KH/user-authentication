const userData = require('./user-data')

function checkUser(email, password) {
  const user = userData.find(user => user.email === email && user.password === password)
  return user
}

module.exports = checkUser
