import { Card, Container, Button, Center } from "@mantine/core";
import "../VideoPlayer.css";
import axios from "axios";
import React, { useState, useEffect } from "react";

export default function VideoPlayer({
  videoId,
  userId,
  visible = true,
  getFavourites,
}) {
  const [checkFavourite, setCheckFavourite] = useState(false);
  useEffect(() => {
    const getData = async () => {
      await axios
        .get(
          process.env.SERVER_URL +
            `/videos/favourites/${userId}/${videoId}/checkFavourite`
        )
        .then((res) => {
          if (res.data && res.data.likedVid.length > 0) {
            setCheckFavourite(true);
          } else {
            setCheckFavourite(false);
          }
        })
        .catch((error) => console.error(error));
    };
    getData();
  }, [videoId, userId]);

  async function updateFavourite() {
    if (checkFavourite) {
      await axios
        .delete(
          process.env.SERVER_URL + `/videos/favourites/${userId}/${videoId}`
        )
        .then((res) => {
          setCheckFavourite(false);
          getFavourites();
        })
        .catch((error) => console.error(error));
    } else {
      await axios
        .post(process.env.SERVER_URL + `/videos/favourites/${userId}`, {
          videoId,
        })
        .then((res) => {
          setCheckFavourite(true);
        })
        .catch((error) => console.error(error));
    }
  }

  //don't render if not visible
  if (!visible) {
    return null;
  }

  return (
    <Container className="videoplayer-container">
      <Card shadow="lg" padding="lg" radius="md" withBorder>
        <Card.Section>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="video"
          />
        </Card.Section>

        <Center>
          <Button className="favourite-button" onClick={updateFavourite}>
            {checkFavourite ? "Unfavourite" : "Favourite"}
          </Button>
        </Center>
      </Card>
    </Container>
  );
}
