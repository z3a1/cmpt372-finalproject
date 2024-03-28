const express = require("express")
const cors = require("cors")
require('dotenv').config()
const axios = require("axios")
var passport = require('passport')
const app = express()
const db = require('./Database/schema')
const auth = require('./Authentication/auth')
const session = require('express-session')
app.use(passport.initialize())
app.use(session({
    secret: process.env.APP_SECRET,
    resave: true,
    saveUninitialized: true
}))
app.use(passport.session())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

app.post('/login',passport.authenticate('local',{failureRedirect: '/login'}), (req,res) => {
    console.log("It works?")
    console.log(req.user)
})

//Youtube videos
const videos = require('./Videos/videos')
app.use('/videos', videos)

// Google maps
const googleMaps = require('./GoogleMaps/googleMaps')
app.use('/maps', googleMaps)

app.post('/register',async (req,res) => {
    console.log(req.body)
    let newUser = {
        user_id: req.body.id,
        username: req.body.userName,
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: req.body.password,
        role: 'Member'
    }
    let newDocument = new db.User(newUser)
    await newDocument.save().then(res => {
        console.log(res)
    })
})

// app.get('/mongo', (req, res) => {
//     db.initializeDB()
//     res.send("mongo")
// })

// app.listen(process.env.PORT, () => {
//     console.log("Server is up and running on specified port")
// })

try {
    db.initializeDB()
    app.listen(process.env.PORT, () => {
        console.log("Server is up and running on specified port", process.env.PORT)
    })
} catch (err) {
    console.error("shit", err)
}
