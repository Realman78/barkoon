const express = require('express')
const router = express.Router()
const Task = require('../../schemas/Task')

let deleteTimeout;

//Read iz databaze sve taskove koji nisu completeani te njihovo slanje (res.send) da se mogu koristit u frontendu
router.get('/getall',async (req,res)=>{
    const tasks = await Task.find({completed: false}).catch(e=> console.log(e))
    res.send(tasks)
})

router.get('/get/:orgId', async (req,res)=>{
    const tasks = await Task.find({organisation: req.params.orgId})
    res.send(tasks)
})
//DOdavanje novog taska, možes poslat sta god oces ja sam bzvz stavio Success
router.post('/add', async (req,res)=>{
    if (!req.body.description || !req.body.user || !req.body.organisation){
        return res.sendStatus(400)
    }
    const body = {
        description: req.body.description,
        user: req.body.user._id,
        stage: 1,
        organisation: req.body.organisation
    }
    const task = await Task.create(body).catch(e=>console.log(e))
    res.send(task)
})

router.patch('/update/:id', async (req,res)=>{
    if (!req.params.id || !req.body.description || !req.body.stage) return res.sendStatus(404)
    if (req.body.stage != 4){
        clearTimeout(deleteTimeout)
    }
    const task = await Task.findByIdAndUpdate(req.params.id, {description: req.body.description, stage: req.body.stage}, {new: true}).catch(e=>console.log(e))
    if (!task) return res.sendStatus(400)
    res.status(200).send(task)
})

router.delete('/delete/:id', (req,res)=>{
    deleteTimeout = setTimeout(async ()=>{
        const task = await Task.findByIdAndDelete(req.params.id).catch(e=>console.log(e))
        if (!task){
            return res.sendStatus(400)
        }
        res.send(task)
    }, 5000)
})
module.exports = router