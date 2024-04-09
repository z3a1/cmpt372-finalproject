"use client";
import { Button, Drawer, Grid, Container, rem, Stack, Loader } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import NavBar from "../Components/navbar";
import userService from "../services/user";
import FriendsPage from "../friends/page";
import VideosPage from "../videos/page";
import friendsList from "../Components/friendsList";
import "@mantine/core/styles.css";
import "./landing.css";

export default function LandingPage() {
  const router = useRouter();
  const [userLoaded, setUserLoadState] = useState(false);
  const [user, setCurrentUser] = useState(null);

  useEffect(() => {
    let setUser = async () => {
      await userService.getcurrentSession().then(res => {
        if (res.data) {
          setUserLoadState(true);
          setCurrentUser(res.data);
        } else {
          router.push("/");
        }
      })
    };
    setUser();
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
