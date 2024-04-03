const express = require("express")
const cors = require("cors")
require('dotenv').config()
const axios = require("axios")
var passport = require('passport')
const app = express()
const db = require('./Database/schema')
const auth = require('./Authentication/auth')
const bcrypt = require('bcrypt')
const session = require('express-session')
const mongoose = require('mongoose')
const saltRounds = 10;
app.use(passport.initialize())
app.use(session({
    secret: process.env.APP_SECRET,
    resave: true,
    saveUninitialized: true
}))

// CORS
const corsOptions = cors({
    origin: ["https://backend-tmmf5kaaqa-uw.a.run.app", "http://localhost:8080", "http://localhost:3000", "http://146.148.99.120"],
    allowedHeaders: ["*"],
    credentials: true, 
})
app.use(corsOptions);
app.options('*', corsOptions)

app.use(passport.session())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.post('/login',passport.authenticate('local',{failureRedirect: '/login'}), (req,res) => {
    res.status(200).json(req.user._id.toString())
})

//Youtube videos
const videos = require('./Videos/videos')
app.use('/videos', videos)

// Google maps
const googleMaps = require('./GoogleMaps/googleMaps')
app.use('/maps', googleMaps)

app.post('/register',async (req,res) => {
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

app.post('/getUserId', async(req,res) => {
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

db.initializeDB()

app.listen(process.env.PORT, () => {
    console.log("Server is up and running on specified port")
})
