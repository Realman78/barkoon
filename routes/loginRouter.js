const express = require('express')
const router = express.Router()
const User = require('../schemas/User')
const {returnToHomeIfLoggedIn} = require('../middleware')


router.get('/', returnToHomeIfLoggedIn, (req,res)=>{
    res.render('login')
})
router.post('/', async (req,res)=>{
    if (!req.body.loginTerm || !req.body.password) return res.sendStatus(401)
    const user = await User.findOne({$or: [{username: req.body.loginTerm},{email: req.body.loginTerm}]}).catch(e=> console.log(e))
    if (!user) return res.sendStatus(401)
    if (user.password == req.body.password){
        req.session.user = user
        return res.sendStatus(200)
    }
    return res.sendStatus(401)
})

module.exports = router