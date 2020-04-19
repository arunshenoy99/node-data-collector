const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.redirect('/users/login')
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
    if (!user) {
        return res.render('404page.hbs')
    }
    req.user = user
    req.token = token
    next()
}

module.exports = auth