const express = require("express")
const axios = require("axios")
const router = express.Router()

require("dotenv").config();
const youtbeApiKey = process.env.YOUTUBE_KEY;
const youtubeApiUrl = "https://www.googleapis.com/youtube/v3";

router.get("/", async (req, res, next) => {
  try {
     //const searchQuery = req.query.q;

    // //Searching is 100 quota units per request
    // const url = `${youtubeApiUrl}/search?key=${youtbeApiKey}&type=video&part=id&fields=items(id)&maxResults=3&q=${searchQuery}`;

    // const response = await axios.get(url);
    // console.log(response)
    // const videoIds = response.data.items.map((item) => item.id.videoId);

    /*
      TESTING PURPOSES BELOW
      MUST REMOVE THIS RES.SEND BEFORE UNCOMMENTING THE REST
    */
    const videoIds = ["xNRJwmlRBNU", "jb-cDp5StCw", "SqcY0GlETPk"];


    res.send(videoIds);
  } catch (err) {
    next(err);
  }
});

module.exports = router;