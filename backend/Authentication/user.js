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
const SessionSchema = new Schema({_id: String})
const Session = mongoose.model('sessions', SessionSchema)
const expirationDate = new Date(Date.now() + 3600000)

router.use(session({
    secret: process.env.APP_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {secure: true},
    store: MongoStore.create({
        mongoUrl: process.env.CONNECTION_SECRET,
        autoRemove: 'native',
        autoRemoveInterval: 100,
        touchAfter: 24 * 3600
    })
}))
router.use(passport.authenticate('session'));

router.use(passport.initialize())
router.use(passport.session())

router.get('/error', (req,res) => {
    res.status(500).json({message: "Could not authenticate user!"})
})

router.post('/login',passport.authenticate('local',{failureRedirect: '/auth/error', failureMessage: true}), (req,res) => {
    console.log(req.session.id)
    req.session.cookie.expires = expirationDate
    console.log(req.session)
    res.status(200).json({userId: req.user._id, sessionId: req.session.id})
})

router.post('/register',(req,res) => {
    req.session.save(async (err) => {
        if(err){
            console.log(err)
            res.status(500).json(err)
        }
        else{
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
                    await newDocument.save().then(dbRes => {
                        console.log(dbRes)
                        console.log(req.session.id)
                        req.session.cookie.expires = expirationDate
                        console.log(req.session)
                        console.log(new Date(Date.now()))
                        let newSession = {
                            _id: req.session.id,
                            expires: expirationDate,
                            session: JSON.stringify({cookie: req.session, passport: {user: dbRes}})
                        }
                        let newSessionDoc = new Session(newSession)
                        newSessionDoc.save().then(sessionRes => {
                            console.log(sessionRes)
                        })
                    })
                }
                else{
                    res.status(500).json({message: err})
                }
            })
        }
    })
})

router.post('/getSessionById', async(req,res) => {
    let id = req.body.id
    console.log(req.session)
    Session.findById({_id: id}).then(dbRes => {
        console.log(dbRes)
        //console.log(JSON.parse(dbRes.session))
        let foundSession = JSON.parse(dbRes.session)
        console.log(foundSession)
        req.session.cookie = foundSession.cookie
        req.session.user = foundSession.passport.user
        res.status(200).json(req.session.user)
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