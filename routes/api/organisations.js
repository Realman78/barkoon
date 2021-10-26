const express = require('express')
const router = express.Router()
const Organisation = require('../../schemas/Organisation')

router.get('/get',async (req,res)=>{
    const orgs = await Organisation.find({users: { $elemMatch: {$eq: req.session.user._id} }})
    res.send(orgs)
})
router.post('/create',async (req,res)=>{
    if (!req.body.name) return res.sendStatus(401)
    const body = {
        name: req.body.name,
        users: [req.session.user._id]
    }
    const org = await Organisation.create(body).catch((e)=>{
        console.log(e)
    })
    res.send(org)
})

module.exports = router