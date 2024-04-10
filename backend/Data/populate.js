const express = require('express')
const mongoose = require('mongoose')
const saltRounds = 10;
const auth = require('../Authentication/auth')
const bcrypt = require('bcrypt')
const axios = require('axios')
const db = require('../Database/schema')
const router = express.Router()
const MongoStore = require('connect-mongo')
const fs = require("fs")
const {faker} = require("@faker-js/faker")


router.get('/populateUsersDB', async (req,res) => {
    let users = []
    let passwords = []
    for(let i = 0; i < 50; i++){
        let firstName = faker.person.firstName()
        let lastName = faker.person.lastName({firstName: firstName})
        let email = faker.internet.email({firstName: firstName, lastName: lastName, allowSpecialCharacters: false})
        let userName = faker.internet.userName({firstName: firstName, lastName: lastName})
        let password = faker.internet.password({memorable: true, length: 12})
        passwords.push({username: userName, password: password})
        let newUser = {
            fname: firstName,
            lname: lastName,
            username: userName,
            email: email,
            password: ""
        }
        await bcrypt.hash(password,saltRounds).then(hash => {
            newUser.password = hash
            users.push(newUser)
        })
    }
    db.User.insertMany(users).then( dbRes => {
        console.table(dbRes)
        fs.writeFileSync('./passwords.txt',JSON.stringify(passwords))
        res.status(200).json("Done!")
    })
    .catch(err => {
        console.log(err)
        res.status(500).json("Error!")
    })
})


module.exports = router;