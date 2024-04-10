"use client";
import axios from "axios";
import VideoPlayer from "./VideoPlayer";
import React, { useState, useEffect } from "react";
import "@mantine/carousel/styles.css";
import { Carousel } from "@mantine/carousel";
import { Loader, Container, rem, Center } from "@mantine/core";

export default function VideoList({ location }) {
  const [videoIds, setVideoIds] = useState([]);
  const [videosLoaded, setVideosLoaded] = useState(false);

  //UseEffect to rerender after location has be updated
  useEffect(() => {
    const getVideos = async () => {
      try {
        //Added travel to end of location, to search for travel spots
        const query = `${location} places`;

        await axios.get(process.env.SERVER_URL + `/videos?q=${query}`, {cache: "no-cache"}, {withCredentials: true})
          .then((serverRes) => {
            setVideoIds(serverRes.data);
            setVideosLoaded(true);
          });
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
    <Container className="videolist-container">
      {!videosLoaded && (
        <Center>
          <Loader style={{ padding: "40px" }} />
        </Center>
      )}
      {videosLoaded && (
        <Carousel
          loop
          withIndicators
          slideSize="50%"
          slideGap="md"
          align="start"
        >
          {videoIds.map((vidId) => (
            <Carousel.Slide key={vidId}>
              <Container className="videoplayer-container">
                <VideoPlayer key={vidId} videoId={vidId}/>
              </Container>
            </Carousel.Slide>
          ))}
        </Carousel>
      )}
    </Container>
  );
}
