const { request } = require('express')
const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = express.Router()

router.post('/tasks', auth, async (req, res) => {
    //const myTask = new Task(req.body)
    
    const myTask = new Task({
        ...req.body, 
        owner: req.user._id
    })
    try {
        await myTask.save()
        res.status(201).send(myTask)
    } catch (e) {
        res.status(400).send(e)
    }
})

//WITHOUT FILTERING
// router.get('/tasks', auth, async (req, res) => {
//     try {
//         //~1st approach //const tasks = await Task.find({owner: req.user._id})
//         //~2nd approach
//         await req.user.populate('tasks').execPopulate()
//         res.send(req.user.tasks)
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })

// WITH Filtering,Pagination, Sorting
// GET /tasks/completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt_asc

router.get('/tasks', auth, async (req, res) => {
    const match = {}
    if(req.query.completed)
    {
        match.completed = req.query.completed === 'true'
    }

    const sort = {}
    if(req.query.sortBy) //should happen only if sort query is provided
    {
        const parts = req.query.sortBy.split('_')
        sort[parts[0]] = parts[1] === 'desc'? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match, //property shorthand
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        //const task = await Task.findById(_id)
        const task = await Task.findOne({ _id, owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const allowedUpdates = ['description', 'completed']
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if (!isValidOperation) {
        return res.status(400).send('Error : invalid updates')
    }
    try {
        // const task = await Task.findByIdAndUpdate(req.params.id)
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!task) {
            return res.status(400).send('Task not found with given id')
        }

        updates.forEach( (update) => {
            task[update] = req.body[update]
        })
        await task.save()

        res.send(task)
    }
    catch (e) {
        res.status(500).send(e)
    }
})

router.delete( '/tasks/:id', auth, async(req,res) => {
    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        if(!task) {
            return res.status(400).send('No task found with this id')
        }
        res.send(task)
    }
    catch(e) {
        res.status(500).send(e)
    }
})

module.exports = router

// app.post('/tasks', (req, res) => {
//     const myTask = new Task(req.body)
//     myTask.save().then( () => {
//         res.status(201).send(myTask)
//     }).catch( (error) => {
//         res.status(400).send(error)
//     })
// })

// app.get('/tasks', async (req, res) => {
//     try {
//         const tasks = await Task.find({})
//         res.send(tasks)
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })

// app.get('/tasks/:id', async (req, res) => {
//     const _id = req.params.id;
//     try {
//         const task = await Task.findById(_id)
//         if (!task) {
//             return res.status(404).send()
//         }
//         res.send(task)
//     } catch (e) {
//         res.status(500).send(e)
//     }

// })