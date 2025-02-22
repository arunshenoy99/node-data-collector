const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const serverAuth = require('../utils/serverAuth')
const multer = require('multer')
const sharp = require('sharp')

const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.cookie('token', token, { expires: new Date(Date.now() + 900000), httpOnly: true}).status(201).send({ user, token })
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        if (!user) {
            return res.status(404).send({ error: 'Please check your username or password and try again' })
        }
        const token = await user.generateAuthToken()
        res.cookie('token', token, { expires: new Date(Date.now() + 900000), httpOnly: true}).send()
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const allowedUpdates = ['name', 'email', 'password', 'avatar']
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send()
    }
    updates.forEach((update) => {
        req.user[update] = req.body[update]
    })
    try {
        await req.user.save()
        res.status(200).send({ user: req.user })
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token != req.token)
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logout-all', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
            cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    try {
        await req.user.save()
        res.redirect('/users/me')
    } catch (e) {
        res.status(500).send()
    }
}, (error, req, res, next) => {
    if (error) {
        res.status(400).send({ error: error.message })
    }
})

router.get('/users/me/avatar', auth, async (req, res) => {
    try {
        if (!req.user.avatar) {
            return res.status(404).send()
        }
        res.set('Content-Type', 'image/png')
        res.send(req.user.avatar)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/login', async (req, res) => {
    let notLoggedIn = true
    if (req.cookies.token) {
        const auth = await serverAuth(req.cookies.token)
        if (auth) {
        notLoggedIn = false
        }
    }
    res.render('login', {
        title: 'Login',
        notLoggedIn
    })
})
  
router.get('/users/me', auth, async (req, res) => {
    let avatar = '/img/user.png'
    if (req.user.avatar) {
        avatar = `http://${req.get('host')}/users/me/avatar`
    }
    await req.user.populate('forms').execPopulate()
    let forms = []
    let noForm = false
    req.user.forms.forEach((form) => {
        const data = []
        const fields = Object.keys(form.data)
        fields.forEach((field) => {
            data.push({ field, value: form.data[field] })
        })
        forms.push({ name: form.name.replace(' ', '-'), data, reward: form.reward })
    })
    if (forms.length === 0) {
        noForm = true
    }
    res.render('profile', {
        name: req.user.name,
        email: req.user.email,
        _id: req.user._id,
        active4: 'active',
        forms,
        noForm,
        avatar
    })
})

module.exports = router