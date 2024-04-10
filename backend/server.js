const express = require("express")
const cors = require("cors")
require('dotenv').config()
const axios = require("axios")
axios.defaults.withCredentials = true
const app = express()
const db = require('./Database/schema')

// CORS
const corsOptions = cors({
    origin: [
        "https://backend-tmmf5kaaqa-uw.a.run.app",
        "http://localhost:8080",
        "http://localhost:3000",
        "http://146.148.99.120",
        "http://35.188.178.185"
    ],
    allowedHeaders: ["*"],
    credentials: true,
    // sameSite: "none" 
})
app.use(corsOptions);
app.options('*', corsOptions)
app.use(express.urlencoded({extended: true}))
app.use(express.json())

const MongoStore = require('connect-mongo')
const session = require('express-session')

var passport = require('passport')

// Initialize passport authentication functions
const initialize = require('./Authentication/auth')
initialize(passport)

// Set up session and passport
app.use(session({
    secret: process.env.APP_SECRET,
    resave: false,
    saveUninitialized: true,
    httpOnly: false,
    store: MongoStore.create({
        mongoUrl: process.env.CONNECTION_SECRET,
        maxAge: 3600000,
    })
}))
app.use(passport.authenticate('session'));
app.use(passport.initialize())
app.use(passport.session())

// User Auth and Account Login,Creation
const UserAuth = require('./Authentication/user')
app.use('/auth',UserAuth)

//Youtube videos
const videos = require('./Videos/videos')
app.use('/videos', videos)

// Google maps
const googleMaps = require('./GoogleMaps/googleMaps')
app.use('/maps', googleMaps)

// Events
const events = require('./Events/events')
app.use('/events', events)

// Friends List 
const friends = require('./FriendsList/friendsRouter');
app.use('/friends', friends);

// Data population for testing
const Data = require('./Data/populate')
app.use('/data', Data)

// Database
db.initializeDB()

app.listen(process.env.PORT, () => {
    console.log("Server is up and running on specified port")
})
