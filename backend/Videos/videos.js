const express = require("express");
const axios = require("axios");
const router = express.Router();

require("dotenv").config();
const youtbeApiKey = process.env.YOUTUBE_KEY;
const youtubeApiUrl = "https://www.googleapis.com/youtube/v3";

var db = require("../Database/schema");

router.get("/", async (req, res, next) => {
  try {
    
     const searchQuery = req.query.q;
  
    //Searching is 100 quota units per request
    const url = `${youtubeApiUrl}/search?key=${youtbeApiKey}&type=video&part=id&fields=items(id)&maxResults=6&q=${searchQuery}`;
   
    const response = await axios.get(url);
    const videoIds = response.data.items.map((item) => item.id.videoId);
    console.log(response)
    /*
      TESTING PURPOSES BELOW
      MUST REMOVE THIS RES.SEND BEFORE UNCOMMENTING THE REST
    */
   //const videoIds = ["xNRJwmlRBNU", "jb-cDp5StCw", "SqcY0GlETPk", "ZVnjOPwW4ZA", "vwSlYG7hFk0", "Z-v6MxJGPS4"];

    for (const videoId of videoIds) {
      await db.Video.findOne({ video_id: videoId }).then(async (checkVid) => {
        if (!checkVid) {
          await new db.Video({ video_id: videoId })
            .save()
            .then((saveVid) => {});
        }
      });
    }
    console.log(videoIds)
    res.status(200).json(videoIds);
  } catch (err) {
    res.status(500).json({ err: "Internal server error" });
  }
});

router.get("/favourites", async (req, res) => {
  try {
    await db.LikedVideo.find({ user_id: req.session.passport.user._id }).then(
      async (likedVids) => {
        if (!likedVids) {
          return res.status(404).json({ err: "No favourite videos" });
        }
        const videoData = likedVids.map((vids) => vids.video_id);
        const videoList = await db.Video.find({ _id: { $in: videoData } });
        const videoIds = videoList.map((video) => video.video_id);

        res.status(200).json({ favourites: videoIds });
      }
    );
  } catch (err) {
    res.status(500).json({ err: "Internal server error" });
  }
});

router.post("/favourites", async (req, res) => {
  try {
    const user = await db.User.findById(req.session.passport.user._id);
    const video = await db.Video.findOne({ video_id: req.body.videoId });

    if (!user || !video) {
      return res.status(404).json({ err: "User/video does not exists" });
    }

    //Check if video already liked the video
    const likedVidExists = await db.LikedVideo.findOne({
      user_id: user._id.toString(),
      video_id: video._id.toString(),
    });

    if (likedVidExists) {
      return res.status(400).json({ err: "User already liked this video" });
    }

    await db.Video.findOne({ video_id: req.body.videoId }).then(
      async (video) => {
        var likedVideoData = {
          user_id: user._id.toString(),
          video_id: video._id.toString(),
        };
        let newLikedVid = new db.LikedVideo(likedVideoData);

        await newLikedVid.save().then((saveRes) => {
          res.status(200).json({ msg: "Post Success" });
        });
      }
    );
  } catch (err) {
    res.status(500).json({ err: err });
  }
});

router.delete("/favourites/:videoId", async (req, res) => {
  try {
    const user = await db.User.findById(req.session.passport.user._id);
    const video = await db.Video.findOne({ video_id: req.params.videoId });

    if (!user || !video) {
      return res.status(404).json({ err: "User/video does not exists" });
    }

    var likedVideoData = {
      user_id: user._id,
      video_id: video._id,
    };

    await db.LikedVideo.deleteOne(likedVideoData)
      .then((delRes) => {
        res.status(200).json({ msg: "Delete Success" });
      })
      .catch((error) => {
        console.error("Delete Unsuccessful", error.response.data);
      });
  } catch (err) {
    res.status(500).json({ err: "Internal server error" });
  }
});

router.get("/favourites/:videoId/checkFavourite", async (req, res) => {
  try {
    const vidId = req.params.videoId;
    console.log(req.session.passport.user._id)

    await db.Video.findOne({ video_id: vidId }).then(async (video) => {
      await db.LikedVideo.find({
        user_id: req.session.passport.user._id,
        video_id: video._id.toString(),
      }).then((likedVid) => {
        if (!likedVid) {
          res.status(404).json({ msg: "No videos" });
        }
        res.status(200).json({ likedVid });
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
