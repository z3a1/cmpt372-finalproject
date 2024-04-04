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

  const searchParams = useSearchParams();

  const userId = searchParams.get("id");

  function onSubmit(e) {
    setSubmitState(true);
  }
  function updateLocation(e) {
    setLocation(e.target.value);
  }

  function resetSubmitState() {
    setSubmitState(false);
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
    <>
      <Grid>
        <Grid.Col span={4}>
          <div className="search-container">
            <form onSubmit={onSubmit}>
              <label htmlFor="location">Enter City: </label>
              <TextInput
                radius="xl"
                size="md"
                rightSectionWidth={42}
                leftSection={
                  <IconSearch
                    style={{ width: rem(18), height: rem(18) }}
                    stroke={1.5}
                  />
                }
                rightSection={
                  <ActionIcon
                    size={32}
                    radius="xl"
                    variant="filled"
                    color="green"
                  >
                    <IconArrowRight
                      style={{ width: rem(18), height: rem(18) }}
                      stroke={1.5}
                      onClick={onSubmit}
                    />
                  </ActionIcon>
                }
                type="text"
                id="location"
                name="location"
                value={location}
                placeholder="Enter a Location"
                onChange={updateLocation}
                onKeyDown={resetSubmitState}
              />
            </form>
            <Link href={`/videos/favourites?id=${userId}`}>
              Favourites Page
            </Link>
            <br></br>
            <Link href={`/?id=${userId}`}>Return to Homepage</Link>
          </div>
        </Grid.Col>
        <Grid.Col span={8}>
          <div className="video-container">
            {submitState && <VideoList location={location} userId={userId} />}
          </div>
        </Grid.Col>
      </Grid>
    </>
  );
}
