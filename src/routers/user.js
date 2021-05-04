const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account')

const router = express.Router()

router.post('/users', async (req, res) => {
    const myUser = new User(req.body)
    try {
        await myUser.save()
        sendWelcomeEmail(myUser.email, myUser.name)
        const token = await myUser.generateAuthToken()
        res.status(201).send({ myUser, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        //res.send({ user: user.getPublicProfile(), token}) //short hand syntax for object properties
        res.send({ user, token}) 
    }catch(e) {
        res.status(400).send(e)
    }
})

// router.get('/users', auth, async (req, res) => {
//     try {
//         const users = await User.find({})
//         res.send(users)
//     } catch (e) {
//         res.status(500).send(e);
//     }
// })

router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter( (token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// router.get('/users/:id', async (req, res) => {
//     console.log(req.params);
//     const _id = req.params.id;
//     try {
//         const user = await User.findById(_id)
//         if (!user) {
//               return res.status(404).send();
//         }
//         res.send(user);
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })

router.patch('/users/me', auth, async (req, res) => {
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const updates = Object.keys(req.body)

    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send('Error : not valid updates')

    }
    try {
        //const user = await User.findByIdAndUpdate(req.user._id);
        updates.forEach( (update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        
        ////const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        // if (!user) {
        //     return res.status(400).send('user not found')
        // }
        res.send(req.user)
    }
    catch (e) {
        res.status(400).send(e)
    } 
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // if (!user) {
        //     return res.status(400).send('No user found with this id')
        // }

        await req.user.remove()
        sendCancellationEmail(req.user.email, req.user.name)
        res.send(req.user)
    }
    catch (e) {
        res.status(500).send(e)
    }
})

const upload = multer( {
    //dest: 'avatars',
    limits: {
        fileSize: 1000000 //1mb
    },
    fileFilter(req, file, cb) {

        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('File must be a image'))
        }
        cb(undefined, true)
    }
})

//Creating & Updating avatar
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res) => {
    //req.user.avatar = req.file.buffer

    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
    
}, (error, req,res,next) => {
    res.status(400).send({error: error.message})
})

//Delete the avatar
router.delete('/users/me/avatar', auth, async(req,res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

//Fetch avatar
router.get('/users/:id/avatar', async (req,res) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch(e) {
        res.status(404).send()
    }
})

module.exports = router

// app.post('/users', (req,res) => {
//     const myUser = new User(req.body)
//     myUser.save().then( () => {
//         res.status(201).send(myUser)
//     }).catch( (error) => {
//         res.status(400).send(error)
//     })
// })

// app.get('/users', (req, res) => {
//     User.find({}).then( (users)=> {
//         res.send(users)
//     }).catch( (error) => {
//         res.status(500).send();
//     })
// })

// app.get('/users/:id', (req, res) => {
//     const _id = req.params.id;
//     User.findById(_id).then( (user) => {
//         if(!user) {
//             return res.status(404).send();
//         }
//         res.send(user);
//     }).catch((error) => {
//         res.status(500).send(error);
//     })
// })