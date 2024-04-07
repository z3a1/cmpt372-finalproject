"use client";
import Link from "next/link";
import FavouriteVideos from "./components/FavouriteVideos";
import VideoList from "./components/VideoList";
import { v4 as idGen } from "uuid";
import {
  Title,
  Container,
  Button,
  TextInput,
  rem,
  ActionIcon,
  Grid,
  Center
} from "@mantine/core";
import { IconSearch, IconArrowRight } from "@tabler/icons-react";
import "./VideoPage.css";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import userService from "../services/user";
import { IconArrowBackUp, IconArrowForwardUp } from "@tabler/icons-react";

export default function VideosPage() {
  const [location, setLocation] = useState("");
  //var location;
  const [submitState, setSubmitState] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();

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
      let res = await userService.getUserId(id);
      if (!res) {
        router.push("/");
      }
    };
    getUser();
  }, []);

  return (
    <>
      <Grid>
        <Grid.Col span={5}>
          <Container className="search-container">
            <Center>
              <Title className = "video-title" size = "h2">Search</Title>
            </Center>
            <form onSubmit={onSubmit}>
              <label htmlFor="location"></label>
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
            <Link className="link" href={`/videos/favourites?id=${id}`}>
              Favourites Page
              <IconArrowForwardUp
                className="icon-arrow"
                size={32}
                strokeWidth={2}
                color={"black"}
              />
            </Link>
            <br></br>
            <Link className="link" href={`/Landing/?id=${id}`}>
              Return to Homepage{" "}
              <IconArrowBackUp
                className="icon-arrow"
                size={32}
                strokeWidth={2}
                color={"black"}
              />
            </Link>
          </Container>
        </Grid.Col>
        <Grid.Col span={7}>
          <Container className="video-container">
          <Center>
              <Title className = "video-title" size = "h2">Video Results</Title>
            </Center>
            {submitState && <VideoList location={location} userId={id} />}
          </Container>
        </Grid.Col>
      </Grid>
    </>
  );
}
