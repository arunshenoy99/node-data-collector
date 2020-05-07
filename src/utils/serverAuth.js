const jwt = require('jsonwebtoken')
const User = require('../models/user')

const serverAuth = async (token) => {
   const decoded = jwt.verify(token, process.env.JWT_SECRET)
   const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
   if (!user) {
       return false
   }
   return true
}

module.exports = serverAuth