const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
    if (!user) {
        return res.status(404).send({ error: 'Authentication failed' })
    }
    req.user = user
    req.token = token
    next()
}

module.exports = auth