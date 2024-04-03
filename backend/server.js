const express = require("express")
const cors = require("cors")
require('dotenv').config()
const axios = require("axios")
const app = express()
const db = require('./Database/schema')
const session = require('express-session')
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
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//Youtube videos
const videos = require('./Videos/videos')
app.use('/videos', videos)

// Google maps
const googleMaps = require('./GoogleMaps/googleMaps')
app.use('/maps', googleMaps)

// Events
const events = require('./Events/events')
app.use('/events', events)

// User Auth and Account Login,Creation
const UserAuth = require('./Authentication/user')
app.use('/auth',UserAuth)

db.initializeDB()

app.listen(process.env.PORT, () => {
    console.log("Server is up and running on specified port")
})
