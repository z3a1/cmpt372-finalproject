const express = require('express')
const mongoose = require('mongoose')
const saltRounds = 10;
const auth = require('./auth')
const bcrypt = require('bcrypt')
const axios = require('axios')
const db = require('../Database/schema')
var passport = require('passport')
const session = require('express-session')
const router = express.Router()
const MongoStore = require('connect-mongo')

let Schema = mongoose.Schema
const SessionSchema = new Schema({_id: String}, {strict: false, versionKey: false})
const Session = mongoose.model('sessions', SessionSchema, "sessions")
const expirationDate = new Date(Date.now() + 3600000)

router.use(session({
    secret: process.env.APP_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {secure: true},
    store: MongoStore.create({
        mongoUrl: process.env.CONNECTION_SECRET,
        maxAge: 3600000,
    })
}))
router.use(passport.authenticate('session'));

router.use(passport.initialize())
router.use(passport.session())

router.get('/error', (req,res) => {
    res.status(500).json({message: "Could not authenticate user!"})
})

router.post('/login',passport.authenticate('local',{failureRedirect: '/auth/error', failureMessage: true}), (req,res) => {
    req.session.cookie.expires = expirationDate
    res.status(200).json({userId: req.user._id, sessionId: req.session.id})
})

router.post('/register',async (req,res) => {
    await bcrypt.hash(req.body.password,saltRounds,async (dbErr,hash) => {
        if(!dbErr){
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
            await newDocument.save().then(async dbRes => {
                req.session.cookie.expires = expirationDate
                req.session.passport = {user : dbRes}
                res.status(200).json({user_id: req.session.id})
            })
            .catch(err => {
                res.status(500).json(err)
            })
        }
        else{
            res.status(500).json(dbErr)
        }
    })
})

router.post('/getSessionById', async(req,res) => {
    let id = req.body.id
    Session.findById({_id: id}).then(dbRes => {
        let foundSession = JSON.parse(dbRes.session)
        req.session.cookie = foundSession.cookie
        req.session.user = foundSession.passport.user
        res.status(200).json(foundSession.passport.user)
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

router.post('/getUserId', async(req,res) => {
    let givenUser = req.body.id
    let id = new mongoose.Types.ObjectId(givenUser)
    await db.User.findOne(id).then((user,err) => {
        if(!err){
            res.status(200).json(user)
        }
        else{
            res.status(404).json({message: "User could not be found!"})
        }
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

module.exports = router;