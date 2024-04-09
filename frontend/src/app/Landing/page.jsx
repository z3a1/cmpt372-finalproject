"use client";
import { Button, Drawer, Grid, Container, rem, Stack, Loader } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import NavBar from "../Components/navbar";
import userService from "../services/user";
import FriendsPage from "../friends/page";
import VideosPage from "../videos/page";
import axios from 'axios'
import friendsList from "../Components/friendsList";
import "@mantine/core/styles.css";
import "./landing.css";
import { getUserInfo } from '../services/user'

export default function LandingPage() {
  const router = useRouter();
  // TODO: remove?
  const [userLoaded, setUserLoadState] = useState(false);
  const [user, setCurrentUser] = useState(null);

  const getUser = async () => {
    const userInfo = await getUserInfo()
    if (userInfo) {
      setCurrentUser(userInfo)
      setUserLoadState(true)
    } else {
      router.push('/')
    }
  }

  useEffect(() => {
    getUser()
  }, []);




  return (
    <>
      <NavBar/>
      <Container fluid h={"100%"}>
        <Grid justify="flex-start" align="stretch">
          <Grid.Col span={3} style={{ height: rem(120) }}>
            <Container id="friends-container">
              {!userLoaded && <Loader/>}
              {userLoaded && <friendsList id = {user._id}/>}
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
