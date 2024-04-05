const express = require('express')
const mongoose = require('mongoose')
const saltRounds = 10;
const auth = require('./auth')
const bcrypt = require('bcrypt')
const axios = require('axios')
const db = require('../Database/schema')
var passport = require('passport')
const router = express.Router()
router.use(passport.initialize())
router.use(passport.session())

router.get('/error', (req,res) => {
    res.status(500).json({message: "Could not authenticate user!"})
})

router.post('/login',passport.authenticate('local',{failureRedirect: '/auth/error'}), (req,res) => {
    res.status(200).json(req.user._id.toString())
})

router.post('/register',async (req,res) => {
    await bcrypt.hash(req.body.password,saltRounds,async (err,hash) => {
        console.log(err)
        console.log(hash)
        if(!err){
            let newUser = {
                user_id: req.body.id,
                username: req.body.user_name,
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                password: hash,
                role: 'Member'
            }
            let newDocument = new db.User(newUser)
            await newDocument.save().then(dbRes => {
                console.log(dbRes)
                res.json({user_id: dbRes._id.toString()})
            })
        }
        else{
            res.status(500).json({message: err})
        }
    })
})

router.post('/getUserId', async(req,res) => {
    let givenUser = req.body.id
    let id = new mongoose.Types.ObjectId(givenUser)
    await db.User.findOne({_id: id}).then((user,err) => {
        if(!err){
            res.status(200).json(user)
        }
        else{
            res.status(404).json({message: "User could not be found!"})
        }
    })
})

module.exports = router;