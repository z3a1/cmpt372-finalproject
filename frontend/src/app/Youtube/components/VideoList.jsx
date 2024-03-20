'use client'
import VideoPlayer from "./VideoPlayer";
import "../VideoList.css";
import React, { useState, useEffect } from 'react';


export default function VideoList({ location }) {
  //const videoIds = await getVideos(location);
  const [videoIds, setVideoIds] = useState([]);

  //UseEffect to rerender after location has be updated
  useEffect(() => {
    const getVideos = async () => {
      try {
            //Added travel to end of location, to search for travel spots
            const query = `${location} travel`;
            const res = await fetch(`http://localhost:8080/?q=${query}`, {
              cache: "no-cache",
            });
            const ids = await res.json();
            setVideoIds(ids);
            //return videoData;
          } catch (err) {
            console.log(err);
          }
    };

    getVideos();
  }, [location]);

  //Check for videoIds
  if (!videoIds) {
    return <div>No videos</div>;
  }

  return (
    <div className="videolist-container">
      {videoIds.map((id) => (
        <VideoPlayer key={id} videoId={id} />
      ))}
    </div>
  );
}
