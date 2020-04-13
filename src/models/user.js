const mongoose = require('mongoose')
const brcypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minlength: 1 
    },
    email:{
        type: String,
        trim: true,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)){
                throw new Error('Please provide a valid email address')
            }
        }
    },
    password: {
        type: String,
        trim: true,
        minlength: 6,
        required: true
    },
    avatar: {
        type: Buffer
    },
    tokens:[{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await brcypt.hash(user.password, 8)
    }
    next()
})

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        return null
    }
    isSuccess = await brcypt.compare(password, user.password) 
    if (isSuccess) {
        return user
    } else {
        return null
    }
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.avatar
    delete userObject.tokens
    return userObject
}

const User = mongoose.model('User', userSchema)

module.exports = User
