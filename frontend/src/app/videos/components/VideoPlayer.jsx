import "../VideoPlayer.css";
import React, { useState, useEffect } from "react";

export default function VideoPlayer({ videoId, userId, visible=true, removeFavouriteDisplay }) {
  const [checkFavourite, setCheckFavourite] = useState(false);
  useEffect(() => {
    const favouriteList = JSON.parse(localStorage.getItem(`user-${userId}-vids`)) || [];
    const isFavourited = favouriteList.includes(videoId);
    setCheckFavourite(isFavourited);
  }, [videoId, userId]);

  function updateFavourite() {
    const favouriteList = JSON.parse(localStorage.getItem(`user-${userId}-vids`)) || [];

    const isFavorite = favouriteList.includes(videoId);
     //If it already exists, then delete
    if (isFavorite) { 
      const updatedList = favouriteList.filter((id) => id !== videoId);
      localStorage.setItem(`user-${userId}-vids`, JSON.stringify(updatedList));
      setCheckFavourite(false);
      removeFavouriteDisplay()
    } else {
      favouriteList.push(videoId);
      localStorage.setItem(`user-${userId}-vids`, JSON.stringify(favouriteList));
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
