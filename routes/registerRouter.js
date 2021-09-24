const express = require('express')
const router = express.Router()
const User = require('../schemas/User')
const {returnToHomeIfLoggedIn} = require('../middleware')

router.get('/',returnToHomeIfLoggedIn, (req,res)=>{
    res.render('register')
})

router.post('/', async (req,res)=>{
    if (!req.body.username || !req.body.email || !req.body.password) return res.sendStatus(401)
    const userBody = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }
    const checkUser = await User.findOne({$or: [{username: userBody.username},{email: userBody.email}]}).catch(e=> console.log(e))
    if (checkUser) return res.sendStatus(409)
    const user = await User.create(userBody).catch(e=>console.log(e))
    if (user) req.session.user = user
    res.sendStatus(201)
})

module.exports = router