"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import VideoPlayer from "./VideoPlayer";
import { Carousel } from "@mantine/carousel";
import { Title, Container, Card, rem, Center } from "@mantine/core";
import "@mantine/carousel/styles.css";

export default function FavouriteVideos() {
  const [favourites, setFavourites] = useState([]);

  const getFavourites = async () => {
    await axios
      .get(process.env.SERVER_URL + `/videos/favourites`, {withCredentials: true})
      .then((res) => {
        setFavourites(res.data.favourites);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    //const favouriteList = JSON.parse(localStorage.getItem(`user-${userId}-vids`)) || []; //Local Storage
    //setFavourites(favouriteList);
    getFavourites();
  }, []);

  // function removeFavouriteDisplay(videoId) {
  //   //If user clicks remove then stop displaying it
  //   const updatedList = favourites.filter((id) => id !== videoId);
  //   setFavourites(updatedList);
  // }

  if (!favourites) {
    return <div>No favourite videos</div>;
  }

  return (
    <Container
      size="xs"
      bg="rgba(255, 255, 255, 1.0)"
    >
      <Center>
      <Title size="h2">Favourite Videos</Title>
      </Center>
      <Carousel withIndicators align="start">
        {favourites.map((vidId) => (
          <Carousel.Slide>
            <VideoPlayer
              key={vidId}
              videoId={vidId}
              visible={true}
              getFavourites={getFavourites}
            />
          </Carousel.Slide>
        ))}
      </Carousel>
    </Container>
  );
}
