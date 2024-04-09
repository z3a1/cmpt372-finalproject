"use client";
import { Button, Drawer, Grid, Container, rem, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import NavBar from "../Components/navbar";
import userService from "../services/user";
import FriendsPage from "../friends/page";
import VideosPage from "../videos/page";
import axios from 'axios'
import "@mantine/core/styles.css";
import "./landing.css";

export default function LandingPage() {
  const router = useRouter();
  const [userLoaded, setUserLoadState] = useState(false);
  const [user, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const getUser = async () => {
      await axios.get(process.env.SERVER_URL + "/auth/user/info", {withCredentials: true})
        .then(res => {
            if (res.data.user) {
                setCurrentUser(res.data.user)
                setUserLoadState(true)
            } else {
                router.push('/')
            }
        })
        .catch(error => console.log(error.message))
    }
    getUser()
  }, []);


  return (
    <>
      <NavBar/>
      <Container fluid h={"100%"}>
        <Grid justify="flex-start" align="stretch">
          <Grid.Col span={3} style={{ height: rem(120) }}>
            <Container id="friends-container">
            </Container>
          </Grid.Col>
          <Grid.Col span={9} style={{ height: rem(80) }}>
            <Stack>
              <Container id="events-container">Suggested Events</Container>
              <Container id="friendsActivity-container">Friends Activity</Container>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}
