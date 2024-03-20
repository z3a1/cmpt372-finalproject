"use client";
import React, { useState, useEffect } from "react";
import VideoPlayer from "./VideoPlayer";

export default function FavouriteVideos() {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const favouriteList = JSON.parse(localStorage.getItem("favourites")) || [];
    setFavourites(favouriteList);
  }, []);

  function removeFavouriteDisplay(videoId) { //If user clicks remove then stop displaying it
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
          <li key={id}>
             <VideoPlayer key={id} videoId={id} visible = {true} removeFavouriteDisplay= {()=>removeFavouriteDisplay(id)}/>
          </li>
        ))}
      </ul>
    </div>
  );
}
