const express = require('express')
const hbs = require('hbs')
const path = require('path')
const cookieParser = require('cookie-parser')

const userRouter = require('./routers/users')
const formRouter = require('./routers/forms')
require('./db/mongoose')
const auth = require('./middleware/auth')

const app = express()

const viewsPath = path.join(__dirname, '../templates/views')
const publicPath = path.join(__dirname, '../public')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.json())
app.use(express.static(publicPath))
app.use(cookieParser())
app.use(userRouter)
app.use(formRouter)

app.get('', (req, res) => {
  let notLoggedIn = true
  if (req.cookies.token) {
    notLoggedIn = false
  }
  res.render('index', {
    title: 'NDC',
    active1: 'active',
    notLoggedIn
  })
})


app.get('*', (req, res) => {
    res.render('404page', {
      title: 'OOPS'
    })
})


const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log('Server is running on port ' + port)
})