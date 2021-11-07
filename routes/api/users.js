const express = require('express')
const router = express.Router()
const User = require('../../schemas/User')

router.put('/update/username', async (req,res)=>{
    const username = req.body.username
    const password = req.body.password
    const body = {
        username,
        password
    }
    if (!username && !password) return res.sendStatus(400)
    if (!password) delete body.password
    if (!username) delete body.username
    const userToUpdate = await User.findByIdAndUpdate(req.session.user._id, body).catch(e=>console.log(e))
    res.send(userToUpdate)
})


module.exports = router