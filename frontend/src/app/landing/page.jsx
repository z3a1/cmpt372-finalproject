"use client";
import {
  Loader,
  Title,
  Group,
  Box,
  Button,
  Drawer,
  Grid,
  Container,
  rem,
  Stack,
  Divider,
  Center,
  ScrollArea,
  Image,
} from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import userService from "../services/user";
import NavBar from "../Components/navbar";
import FriendsPage from "../friends/page";
import VideosPage from "../videos/page";
import axios from 'axios'
import FriendsList from "../Components/friendsList";
import "@mantine/core/styles.css";
import "./landing.css";
import { getUserInfo } from '../services/user'
import FriendsActivity from "../Components/FriendsActivity";
import SuggestedEvents from "../Components/SuggestedEvents";
import VideoDrawer from "../videos/VideoDrawer";

export default function LandingPage() {
  const router = useRouter();
  const [userLoaded, setUserLoadState] = useState(false);
  const [user, setCurrentUser] = useState(null);

  useEffect(() => {
    let setUser = async () => {
      await userService.getcurrentSession().then(res => {
        if (res.data) {
          console.log(res)
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
    <div className="landing-container" style={{ height: "70vh" }}>

      <Group
        className="landing-group"
        gap="0"
        style={{ width: "100%", height: "100%", overflow: "hidden" }}
      >
        <Box id="friends-container" style={{ width: "450px", height: "100%" }}>
          {!userLoaded && <Loader />}
          {userLoaded && (
            <ScrollArea h={"100%"}>
             <FriendsList id = {user._id} />
            </ScrollArea>
          )}
        </Box>

        <div
          style={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Stack style={{ height: "100%", width: "100%" }}>
            <Box
              id="events-container"
              style={{
                maxHeight: "500px",
                width: "100%",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <SuggestedEvents></SuggestedEvents>
            </Box>

            <Box
              id="friendsActivity-container"
              style={{ height: "50%", width: "100%" }}
            >
              <Title size="h2">Activity Feed</Title>
              <ScrollArea h={250}>
                <FriendsActivity></FriendsActivity>
              </ScrollArea>
            </Box>
          </Stack>
        </div>
      </Group>
    </div>
  );
}
