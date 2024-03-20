const express = require("express")
const cors = require("cors")
require('dotenv').config()
const axios = require("axios")
const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

require("dotenv").config();
const apiKey = process.env.YOUTUBE_KEY;
const baseApiUrl = "https://www.googleapis.com/youtube/v3";

app.get("/", async (req, res, next) => {
  try {
    const searchQuery = req.query.q;

    //Searching is 100 quota units per request
    const url = `${baseApiUrl}/search?key=${apiKey}&type=video&part=id&fields=items(id)&maxResults=3&q=${searchQuery}`;
    //axios has the whole response in json format (automatically parses it into json), interested in data property in the response json
    const response = await axios.get(url);
    console.log(response)
    const videoIds = response.data.items.map((item) => item.id.videoId);

    /*
      TESTING PURPOSES BELOW
      MUST REMOVE THIS RES.SEND BEFORE UNCOMMENTING THE REST
    */
    // const videoIds = ["xNRJwmlRBNU", "jb-cDp5StCw", "SqcY0GlETPk"];
    // console.log(searchQuery);

    res.send(videoIds);
  } catch (err) {
    next(err);
  }
});

app.listen(process.env.PORT, () => {
    console.log("Server is up and running on specified port")
})