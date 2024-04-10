import React from "react";
import { Carousel } from "@mantine/carousel";
import { Image, Box, rem } from "@mantine/core";
import "@mantine/carousel/styles.css";
import { IconArrowRight, IconArrowLeft } from "@tabler/icons-react";
export default function SuggestedEvents() {
  return (
    <Carousel
      nextControlIcon={
        <IconArrowRight style={{ width: rem(30), height: rem(30), backgroundColor: "white",  borderRadius:" 50%" }} />
      }
      previousControlIcon={
        <IconArrowLeft style={{ width: rem(30), height: rem(30), backgroundColor: "white",  borderRadius:" 50%"  }} />
      }
      loop
      controlSize={40}
      height={400}
      style={{ height: "100%" }}
    >
      <Carousel.Slide>
        <Image
          src="/images/Rogers Arena.jpg"
          style={{ height: "100%", width: "100%", objectFit: "cover" }}
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <Image
          src="/images/Cactus Club.jpg"
          style={{ height: "100%", width: "100%", objectFit: "cover" }}
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <Image
          src="/images/Golden Ears Park.jpg"
          style={{ height: "100%", width: "100%", objectFit: "cover" }}
        />
      </Carousel.Slide>
    </Carousel>
  );
}
