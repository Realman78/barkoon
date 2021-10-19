const express = require('express')
const router = express.Router()
const {requestLogin} = require('../middleware')

router.get('/',requestLogin, (req,res)=>{
    res.render('settings')
})


module.exports = router