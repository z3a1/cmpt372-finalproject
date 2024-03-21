"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import VideoPlayer from "./VideoPlayer";

export default function FavouriteVideos({ userId }) {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    //const favouriteList = JSON.parse(localStorage.getItem(`user-${userId}-vids`)) || []; //Local Storage
    //setFavourites(favouriteList);

    const getFavourites = async () => {
        await axios.get(process.env.SERVER_URL + `/videos/favourites/${userId}`).then(res => {
            console.log(res)
            setFavourites(res.data.favourites);
        }).catch(error => console.error(error));
    };

    getFavourites();
  }, [userId]);

  function removeFavouriteDisplay(videoId) {
    //If user clicks remove then stop displaying it
    const updatedList = favourites.filter((id) => id !== videoId);
    setFavourites(updatedList);
  }

  if (!favourites) {
    return <div>No favourite videos</div>;
  }

  return (
    <div className="favourites-container">
      <h2>Favourite Videos</h2>
      <ul>
        {favourites.map((id) => (
          <VideoPlayer
            key={id}
            videoId={id}
            userId={userId}
            visible={true}
            removeFavouriteDisplay={() => removeFavouriteDisplay(id)}
          />
        ))}
      </ul>
    </div>
  );
}
