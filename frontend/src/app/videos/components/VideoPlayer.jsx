import "../VideoPlayer.css";
import axios from "axios";
import React, { useState, useEffect } from "react";

export default function VideoPlayer({ videoId, userId, visible=true, getFavourites }) {
  const [checkFavourite, setCheckFavourite] = useState(false);
  useEffect(() => {
    //const favouriteList = JSON.parse(localStorage.getItem(`user-${userId}-vids`)) || []; //Local Storage
    // const isFavourited = favouriteList.includes(videoId);
    // setCheckFavourite(isFavourited);

    const getData = async () => {
 
     await axios.get(`http://localhost:8080/videos/favourites/${userId}/${videoId}/checkFavourite`).then(res => {
       if (res.data && res.data.likedVid.length > 0) {
        setCheckFavourite(true);
       } else {
          setCheckFavourite(false);
       }
      })
      .catch(error => console.error(error));
       
    }
    getData(); 
  }, [videoId, userId]);

    async function updateFavourite() {

    
    if (checkFavourite) {
      await axios.delete(`http://localhost:8080/videos/favourites/${userId}/${videoId}`).then(res=>{
        //removeFavouriteDisplay();
        setCheckFavourite(false);
        getFavourites();
      }).catch(error => console.error(error));
    
    } else {
      await axios.post(`http://localhost:8080/videos/favourites/${userId}`, { videoId }).then(res=>{
        setCheckFavourite(true);
        getFavourites();
      }).catch(error => console.error(error));
    }


    //Local Storage Version
    //const favouriteList = JSON.parse(localStorage.getItem(`user-${userId}-vids`)) || []; //Local Storage
    //const isFavorite = favouriteList.includes(videoId);
     //If it already exists, then delete
    // if (isFavorite) { 
    //   const updatedList = favouriteList.filter((id) => id !== videoId);
    //   localStorage.setItem(`user-${userId}-vids`, JSON.stringify(updatedList));
    //   setCheckFavourite(false);
    //   removeFavouriteDisplay()
    // } else {
    //   favouriteList.push(videoId);
    //   localStorage.setItem(`user-${userId}-vids`, JSON.stringify(favouriteList));
    //   setCheckFavourite(true);
    // }
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
