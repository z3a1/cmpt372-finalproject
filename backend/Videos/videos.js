const express = require("express")
const axios = require("axios")
const router = express.Router()

require("dotenv").config();
const youtbeApiKey = process.env.YOUTUBE_KEY;
const youtubeApiUrl = "https://www.googleapis.com/youtube/v3";

var db = require('../Database/schema')

router.get("/", async (req, res, next) => {
     const searchQuery = req.query.q;
    //Searching is 100 quota units per request
    const url = `${youtubeApiUrl}/search?key=${youtbeApiKey}&type=video&part=id&fields=items(id)&maxResults=3&q=${searchQuery}`;
    console.log("After youtube URL")
    await axios.get(url).then(async servRes => {
      console.log(servRes.data.items)
      let payload = []
      servRes.data.items.map(async (item) => {
        let newVideo = {video_id: item.id.videoId}
        new db.Video(newVideo).save()
        payload.push(item.id.videoId)
      })
      res.json(payload)
    })

    /*
      TESTING PURPOSES BELOW
      MUST REMOVE THIS RES.SEND BEFORE UNCOMMENTING THE REST
    */
    //const videoIds = ["xNRJwmlRBNU", "jb-cDp5StCw", "SqcY0GlETPk"];
});


router.get('/favourites/:userId', async(req,res) =>{
  try {
  
    await db.LikedVideo.find({ user_id: req.params.userId }).then(async likedVids=>{

      if (!likedVids) {
        return res.status(404).json({ err: 'No favourite videos' });
      }
      const videoData = likedVids.map((vids) => vids.video_id)
      const videoList = await db.Video.find({ _id: { $in: videoData } });
      const videoIds = videoList.map((video) => video.video_id);

      res.status(200).json({ favourites:videoIds })
    })
  } catch (err) {
      res.status(500).json({ err: 'Internal server error' });
  }
})

router.post('/favourites/:userId', async(req,res) =>{
  try {
    await db.User.findById(req.params.userId).then(async user=>{

      await db.Video.findOne({ video_id: req.body.videoId }).then(async video=>{
      var likedVideoData = {
          user_id: user._id.toString(),
          video_id: video._id.toString()
      }
      let newLikedVid = new db.LikedVideo(likedVideoData)
      
       await newLikedVid.save().then(saveRes=>{
        
        res.status(200).json({msg: 'Post Success'});
      })
    })
    })
  } catch (err) {
    res.status(500).json({ err: err });
  }
})

router.delete('/favourites/:userId/:videoId', async(req,res) =>{
  try {

    const user = await db.User.findById(req.params.userId);
    const video = await db.Video.findById(req.params.videoId);

    var likedVideoData = {
        user_id: user._id,
        video_id: video._id
    };
    
    const response = await db.LikedVideo.deleteOne(likedVideoData);
    
    res.status(200).json({msg: 'Delete Success'});
  } catch (err) {
      res.status(500).json({ err: 'Internal server error' });
  }
})

router.get('/favourites/:userId/:videoId/checkFavourite', async (req, res) => {
  try {
    
      const vidId = req.params.videoId;
    
    
      await db.Video.findOne({ video_id: vidId }).then(async video=>{
        await db.LikedVideo.find({ user_id: req.params.userId, video_id: video._id.toString() }).then(likedVid => {
          if(!likedVid){
            
            res.status(404).json({msg:'No videos'})
          }
          res.status(200).json({ likedVid});
      })
      })
     
  } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;