"use client";

import Link from "next/link";
import FavouriteVideos from "../components/FavouriteVideos";
import { Center } from "@mantine/core";
import { IconArrowBackUp } from "@tabler/icons-react";
import "./FavouritesPage.css";

export default function FavouritesPage() {
  return (
    <div>
      <FavouriteVideos></FavouriteVideos>

      <Center>
        <Link className="link" href={`/videos`}>
          Return To Videos Page
          <IconArrowBackUp className = "icon-arrow-back" size={32} strokeWidth={2} color={"black"} />
        </Link>
      </Center>
    
    </div>
  );
}
