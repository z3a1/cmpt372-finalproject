"use client";
import FavouriteVideos from "../components/FavouriteVideos";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function FavouritesPage() {
  const searchParams = useSearchParams();

  const userId = searchParams.get("userId");
  return (
    <div>
       <a href="/videos">Return</a>
      {/* <Suspense> */}
        <FavouriteVideos userId={userId}></FavouriteVideos>
      {/* </Suspense> */}
     
    </div>
  );
}
