'use client'
import {redirect} from 'next/navigation';
import {MantineProvider } from '@mantine/core';
import "@mantine/core/styles.css";
import "./landing.css";

import Link from "next/link";
import {
  Grid,
  Group,
  Container,
  Button,
  Title,
  rem,
  Stack,
  Flex,
} from "@mantine/core";

import {
  IconLogout,
  IconMapPin,
  IconFriends,
  IconUserCircle,
  IconBrandYoutube,
  IconMap,
  IconLogin,
} from "@tabler/icons-react";


const dataLinks = [
  { link: "/profile", label: "Profile", icon: IconUserCircle },
  { link: "/friends", label: "Friends", icon: IconFriends },
  { link: "/events", label: "Create Event", icon: IconMapPin },
  { link: "/videos", label: "Event Suggestions", icon: IconBrandYoutube },
];

export default function Home() {
  const links = dataLinks.map((data, index) => (
    <a key={index} className="link" href={data.link}>
      <data.icon className="icon" />
      <span>{data.label}</span>
    </a>
  ));


  return (
    <div className = "landing-container">
      <Title className="title" variant="filled" bg="rgba(0, 150, 0, 0.7)">
        <IconMap className="icon-map" />
        Socializer
      </Title>

      <nav className="navbar">
        <div className="navbar-container">
          {links}
          <a href="/logout" id="logout" className="link">
            <IconLogout className="icon" />
            <span>Logout</span>
          </a>
          <a href="/login" id="login" className="link">
            <IconLogin className="icon" />
            <span>Login</span>
          </a>
        </div>
      </nav>
      <Container fluid h = {"100%"}>
        <Grid justify="flex-start" align="stretch">
          {/* First Grid Section */}
          <Grid.Col span={3} style={{ minheight: rem(120) }}>
            <div id="friends-container" >
              Friends List
            </div>
          </Grid.Col>
          <Grid.Col span={9} style={{ minHeight: rem(80) }} >
            <Stack>
            <div id="events-container" >
             Suggested Events
            </div>
            <div id="friendsActivity-container" >
            Friends Activity
            </div>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>

    </div>
  );
}
