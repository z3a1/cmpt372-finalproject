const express = require("express")
const cors = require("cors")
require('dotenv').config()
const axios = require("axios")
const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

//Youtube videos
const videos = require('./Videos/videos')
app.use('/videos', videos)

app.listen(process.env.PORT, () => {
    console.log("Server is up and running on specified port")
})