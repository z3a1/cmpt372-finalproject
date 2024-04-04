"use client";
import Link from "next/link";
import FavouriteVideos from "./components/FavouriteVideos";
import VideoList from "./components/VideoList";
import {v4 as idGen} from "uuid"
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import userService from "../services/user"

export default function VideosPage() {
  const [location, setLocation] = useState("");
  //var location;
  const [submitState, setSubmitState] = useState(false);
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const router = useRouter()

  //TESTING WITH DIFFERENT USERS
  const userId = '65fa73b955410eecb776f5b1'

  function onSubmit(e) {
    e.preventDefault();
    setSubmitState({ checkSubmit: true });
    
  }
  function updateLocation(e) {
     setLocation(e.target.value);
  }

  useEffect(() => {
    let getUser = async () => {
      let res = await userService.getUserId(id)
      if(!res){
        router.push("/")
      }
    }
    getUser()
  },[])

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
      <Link href={`/videos/favourites?userId=${userId}`}>Favourites Page</Link>
        <br></br>
        <Link href="/">Return to Homepage</Link>
      {submitState.checkSubmit && (
        <VideoList location={location} userId={userId} />
      )}
      
    </div>
  );
}
