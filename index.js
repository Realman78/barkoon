const express = require('express')
const app = express()
const path = require('path')
require('./db')
const {requestLogin} = require('./middleware')
var session = require('express-session')
app.use(session({
  secret: 'heok',
  resave: true,
  saveUninitialized: false
}))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

const PORT = process.env.PORT || 3000

const viewsPath = path.join(__dirname, './views')
const publicDirPath = path.join(__dirname, './public')

app.use(express.static(publicDirPath))
app.set('view engine', 'hbs')
app.set('views', viewsPath)

const registerRouter = require('./routes/registerRouter')
const loginRouter = require('./routes/loginRouter')
const logoutRoute = require('./routes/logout')

app.use('/login', loginRouter)
app.use('/register', registerRouter)
app.use('/logout', logoutRoute)

const tasksApiRoute = require('./routes/api/tasks')
app.use('/tasks', tasksApiRoute)
const usersApiToute = require('./routes/api/users')
app.use('/users', usersApiToute)

app.get('/', requestLogin, (req,res)=>{
    const payload = {
        user: req.session.user,
        userJS: JSON.stringify(req.session.user)
    }
    res.render('index', payload)
})

app.listen(PORT, ()=>{
    console.log(`Server is up and running on port ${PORT}`)
})