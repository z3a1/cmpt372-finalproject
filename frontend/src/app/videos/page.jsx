"use client";
import FavouriteVideos from "./components/FavouriteVideos";
import VideoList from "./components/VideoList";
import { useState } from "react";
import {v4 as idGen} from "uuid"

export default function VideosPage() {
  const [location, setLocation] = useState("");
  //var location;
  const [submitState, setSubmitState] = useState(false);

  //TESTING WITH DIFFERENT USERS
  const userId = '65fa73b955410eecb776f5b1'

  function onSubmit(e) {
    e.preventDefault();
    setSubmitState({ checkSubmit: true });
    
  }
  function updateLocation(e) {
     setLocation(e.target.value);
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label htmlFor="location">Enter City: </label>
        <input
          type="text"
          id="location"
          name = "location"
          value={location}
          placeholder="Enter a Location"
          onChange={updateLocation}
        />
        <button type="submit">Search</button>
      </form>
        <a href={`/videos/favourites?userId=${userId}`}>Favourites Page</a> 
        <br></br>
        <a href="/">Return to Homepage</a>
      {submitState.checkSubmit && (
        <VideoList location={location} userId={userId} />
      )}
    
    </div>
  );
}
