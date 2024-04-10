"use client";
import axios from "axios";
import VideoPlayer from "./VideoPlayer";
import "../VideoList.css";
import React, { useState, useEffect } from "react";
import "@mantine/carousel/styles.css";
import { Carousel } from "@mantine/carousel";
import { Loader, Container, rem, Center } from "@mantine/core";

export default function VideoList({ location, userId }) {
  const [videoIds, setVideoIds] = useState([]);
  const [videosLoaded, setVideosLoaded] = useState(false);

  //UseEffect to rerender after location has be updated
  useEffect(() => {
    const getVideos = async () => {
      try {
        //Added travel to end of location, to search for travel spots
        const query = `${location} places`;
        await fetch(process.env.SERVER_URL + `/videos?q=${query}`, {
          cache: "no-cache",
        })
          .then((res) => res.json())
          .then((serverRes) => {
            setVideoIds(serverRes);
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
              <Container className="videoplayer-contaner">
                <VideoPlayer key={vidId} videoId={vidId} userId={userId} />
              </Container>
            </Carousel.Slide>
          ))}
        </Carousel>
      )}
    </Container>
  );
}
