const express = require("express")
const cors = require("cors")
require('dotenv').config()
const axios = require("axios")
axios.defaults.withCredentials = true
const app = express()
const http = require("http");
const socketio = require('socket.io'); 
const db = require('./Database/schema')
const messageRouter = require('./messages/messageRouter');
const session = require('express-session')
app.use(session({
    secret: process.env.APP_SECRET,
    resave: true,
    saveUninitialized: true,
}))

// CORS
const corsOptions = cors({
    origin: ["https://backend-tmmf5kaaqa-uw.a.run.app", "http://localhost:8080", "http://localhost:3000", "http://35.188.43.243",'https://cmpt372-finalproject-8h4cbn3ub-z3a1s-projects.vercel.app'
,'https://cmpt372-finalproject-z3a1s-projects.vercel.app'],
    // allowedHeaders: ["*"],
    credentials: true, 
    optionSuccessStatus:200,
})
app.use(corsOptions);
app.options('*', corsOptions)
app.use(express.urlencoded({extended: true}))
app.use(express.json())

const MongoStore = require('connect-mongo')
// const session = require('express-session')

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

// Friends List 
const friends = require('./FriendsList/friendsRouter');
app.use('/friends', friends);

// Events
const events = require('./Events/events')
app.use('/events', events)

// Data population for testing
const Data = require('./Data/populate')
app.use('/data', Data)

// Messaging 
// const messaging = require('./messages/messages'); 
// app.use('/messaging', messaging);

app.use('/messages', messageRouter);

const initializeSocket = require('./messages/messages');
const server = http.createServer(app); 
// const io = socketio(server);

const io = require("socket.io")(server, {
    cors: {
        origin: ["https://backend-tmmf5kaaqa-uw.a.run.app", "http://localhost:8080", "http://localhost:3000", "http://35.188.43.243",'https://cmpt372-finalproject-8h4cbn3ub-z3a1s-projects.vercel.app'],
        allowedHeaders: ['*'],
        credentials: true, 
        optionSuccessStatus:200
    }
});

// console.log('server', server)

// console.log("io object:", io);
initializeSocket(io);

// Database
db.initializeDB()

// app.listen(process.env.PORT, () => {
//     console.log("Server is up and running on specified port")
// })

server.listen(process.env.PORT, () => {
    console.log("Server is up and running on specified port");
});

exports.app = app