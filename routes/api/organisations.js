const express = require('express')
const router = express.Router()
const Organisation = require('../../schemas/Organisation')
const Task = require('../../schemas/Task')

router.get('/get',async (req,res)=>{
    const orgs = await Organisation.find({users: { $elemMatch: {$eq: req.session.user._id} }})
    res.send(orgs)
})
router.get('/get/:id',async (req,res)=>{
    const org = await Organisation.findById(req.params.id)
    res.send(org)
})
router.post('/create',async (req,res)=>{
    if (!req.body.name) return res.sendStatus(401)
    const body = {
        name: req.body.name,
        users: [req.session.user._id],
        admin: req.session.user._id
    }
    const org = await Organisation.create(body).catch((e)=>{
        console.log(e)
    })
    res.send(org)
})
router.delete('/:id/delete', async (req,res)=>{
    const id = req.params.id
    const orgToDelete = await Organisation.findById(id).catch(e=>console.log(e))
    console.log(orgToDelete)
    if (orgToDelete.admin.toString() !== req.session.user._id) return res.sendStatus(403)
    Task.deleteMany({organisation: orgToDelete._id})
    orgToDelete.delete()
    res.send(orgToDelete)
})
module.exports = router