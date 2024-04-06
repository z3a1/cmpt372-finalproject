"use client";
import Link from "next/link";
import FavouriteVideos from "../components/FavouriteVideos";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Center } from "@mantine/core";
import { IconArrowBackUp } from "@tabler/icons-react";
import "./FavouritesPage.css";

export default function FavouritesPage() {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  return (
    <div>
      <FavouriteVideos userId={id}></FavouriteVideos>

      <Center>
        <Link className="link" href={`/videos/?id=${id}`}>
          Return To Videos Page
          <IconArrowBackUp className = "icon-arrow-back" size={32} strokeWidth={2} color={"black"} />
        </Link>
      </Center>
    
    </div>
  );
}
