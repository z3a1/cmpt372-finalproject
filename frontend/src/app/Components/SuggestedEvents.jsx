import React from "react";
import { Carousel } from "@mantine/carousel";
import { Image, Box } from "@mantine/core";
import "@mantine/carousel/styles.css";
export default function SuggestedEvents() {
  return (
    <Carousel loop controlSize={40}>
      <Image
        src="/images/Rogers Arena.jpg"
        style={{ height: "100%", width: "100%", objectFit: "cover" }}
      />
      <Image
        src="/images/Cactus Club.jpg"
        style={{ height: "100%", width: "100%", objectFit: "cover" }}
      />

      <Image
        src="/images/Golden Ears Park.jpg"
        style={{ height: "100%", width: "100%", objectFit: "cover" }}
      />
    </Carousel>
  );
}
