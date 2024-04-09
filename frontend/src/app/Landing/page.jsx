"use client";
import { Button, Drawer, Grid, Container, rem, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import NavBar from "../Components/navbar";
import userService from "../services/user";
import FriendsPage from "../friends/page";
import VideosPage from "../videos/page";
import "@mantine/core/styles.css";
import "./landing.css";

export default function LandingPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const sessionId = searchParams.get("sessionId")
  const router = useRouter();
  const [userLoaded, setUserLoadState] = useState(false);
  const [user, setCurrentUser] = useState(null);

  useEffect(() => {
    let setUser = async () => {
      let res = await userService.getcurrentSession(id);
      if (res) {
        console.log(res)
        console.log(`User ID: ${res.data._id}`)
        setUserLoadState(true);
        setCurrentUser(res);
      } else {
        router.push("/");
      }
    };
    setUser();
  }, []);


  return (
    <>
      <NavBar id={id}/>
      <Container fluid h={"100%"}>
        <Grid justify="flex-start" align="stretch">
          <Grid.Col span={3} style={{ height: rem(120) }}>
            <Container id="friends-container">
              <FriendsPage />
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
