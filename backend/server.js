const express = require("express")
const cors = require("cors")
require('dotenv').config()
const axios = require("axios")
const app = express()

// Parsing body
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

// Google maps
const googleMaps = require('./GoogleMaps/googleMaps')
app.use('/maps', googleMaps)


app.listen(process.env.PORT, () => {
    console.log("Server is up and running on specified port")
})