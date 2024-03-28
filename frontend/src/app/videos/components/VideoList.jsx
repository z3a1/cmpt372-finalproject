"use client";
import axios from "axios";
import VideoPlayer from "./VideoPlayer";
import "../VideoList.css";
import React, { useState, useEffect } from "react";

export default function VideoList({ location, userId}) {
  const [videoIds, setVideoIds] = useState([]);

  //UseEffect to rerender after location has be updated
  useEffect(() => {
    const getVideos = async () => {
      try {
        //Added travel to end of location, to search for travel spots
        const query = `${location} places`;
        await fetch(process.env.SERVER_URL + `/videos?q=${query}`, {
          cache: "no-cache",
        }).then(res => res.json())
        .then(serverRes => {
          console.log(serverRes)
          setVideoIds(serverRes);
        })
      
      } catch (err) {
        console.log(err);
      }
    };

    getVideos();
  }, [location]);

  //Check for videoIds
  if (!videoIds) {
    return <div>No videos found for location</div>;
  }

  return (
    <div className="videolist-container">
      {videoIds.map((id) => (
        <VideoPlayer key={id} videoId={id} userId={userId} />
      ))}
    </div>
  );
}
