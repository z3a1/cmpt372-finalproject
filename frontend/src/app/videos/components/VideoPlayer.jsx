import "../VideoPlayer.css";
import React, { useState, useEffect } from "react";

export default function VideoPlayer({ videoId, visible=true, removeFavouriteDisplay }) {
  const [checkFavourite, setCheckFavourite] = useState(false);
  useEffect(() => {
    const favouriteList = JSON.parse(localStorage.getItem("favourites")) || [];
    const isFavourited = favouriteList.includes(videoId);
    setCheckFavourite(isFavourited);
  }, [videoId]);

  function updateFavourite() {
    const favouriteList = JSON.parse(localStorage.getItem("favourites")) || [];

   
    const isFavorite = favouriteList.includes(videoId);
     //If it already exists, then delete
    if (isFavorite) { 
      const updatedList = favouriteList.filter((id) => id !== videoId);
      localStorage.setItem("favourites", JSON.stringify(updatedList));
      setCheckFavourite(false);
      removeFavouriteDisplay()
    } else {
      favouriteList.push(videoId);
      localStorage.setItem("favourites", JSON.stringify(favouriteList));
      setCheckFavourite(true);
    }
  }

  //don't render if not visible
  if (!visible) {
    return null; 
  }

  return (
    <div className="videoplayer-container">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="video"
      />
      <button onClick={updateFavourite}>
        {checkFavourite ? "Remove from Favourites" : "Click to Favourite"}
      </button>
    </div>
  );
}
