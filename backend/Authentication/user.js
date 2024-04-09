const express = require('express')
const mongoose = require('mongoose')
const saltRounds = 10;
const bcrypt = require('bcrypt')
const db = require('../Database/schema')
var passport = require('passport')
const router = express.Router()

let Schema = mongoose.Schema
const SessionSchema = new Schema({_id: String}, {strict: false, versionKey: false})
const Session = mongoose.model('sessions', SessionSchema, "sessions")
const expirationDate = new Date(Date.now() + 3600000)

router.get('/error', (req,res) => {
    res.status(500).json({message: "Could not authenticate user!"})
})

router.post('/login',passport.authenticate('local',{failureRedirect: '/auth/error', failureMessage: true}), (req,res) => {
    req.session.cookie.expires = expirationDate
    req.session.save()
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
                req.session.save()
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

router.post('/changeInfo', async (req,res) => {
    let id = req.body.id
    let givenPassword = req.body.password
    if(!req.body.inputData) res.status(404).json({message: "The new change field is empty!"});

    await db.User.findById({_id: id}).then(async (user) => {
        console.log(user)
        await bcrypt.compare(givenPassword,user.password).then(async result => {
            if(result){
                let changeSetting = req.body.status
                if(changeSetting == 'username'){
                    await db.User.findOneAndUpdate({_id: id}, {username: req.body.inputData}, {new: true})
                    .then(newUser => {
                        req.session.passport.user = newUser
                        req.session.save()
                        res.status(200).json(newUser)
                    })
                }
                if(changeSetting == 'email'){
                    await db.User.findOneAndUpdate({_id: id}, {email: req.body.inputData}, {new: true})
                    .then(newUser => {
                        req.session.passport.user = newUser
                        req.session.save()
                        res.status(200).json(newUser)
                    })
                }

            }
            else{
                res.status(200).json({message: "The password is invalid!"})
            }
        })
        .catch(err => {
            console.log(err)
            res.status(404).json(err)
        })
    })
    .catch(err => {
        res.status(404).json(err)
    })
})

module.exports = router;