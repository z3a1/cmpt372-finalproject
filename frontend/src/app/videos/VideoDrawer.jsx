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
  Center,
} from "@mantine/core";
import { IconSearch, IconArrowRight } from "@tabler/icons-react";
import "./VideoDrawer.css";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import userService from "../services/user";
import { IconArrowBackUp, IconArrowForwardUp } from "@tabler/icons-react";
import { getUserInfo } from "../services/user";

export default function VideosDrawer() {
  const [location, setLocation] = useState("");
  const [submitState, setSubmitState] = useState(false);
  const router = useRouter();

  function onSubmit(e) {
    e.preventDefault();
    setSubmitState(true);
  }
  function updateLocation(e) {
    setLocation(e.target.value);
  }

  function resetSubmitState() {
    setSubmitState(false);
  }

  const getUser = async () => {
    let user = await getUserInfo();
    if (!user) {
      router.push("/");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <Grid>
        <Grid.Col span={5}>
          <Container className="search-container">
            <Center>
              <Title className="video-title" size="h2">
                Event Recommendations
              </Title>
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
                  <ActionIcon size={32} radius="xl" variant="filled">
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
            {/* <Link className="link" href={`/videos/favourites`}>
              Favourites Page
              <IconArrowForwardUp
                className="icon-arrow"
                size={32}
                strokeWidth={2}
                color={"black"}
              />
            </Link> */}
            <br></br>
            <Link className="link" href={`/landing`}>
              Return to Home{" "}
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
          {submitState && <VideoList location={location} />}
        </Grid.Col>
      </Grid>
    </>
  );
}
