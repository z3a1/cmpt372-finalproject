'use client'
import Link from "next/link";
import FavouriteVideos from "../components/FavouriteVideos";
import { useSearchParams } from 'next/navigation'

export default function FavouritesPage() {
    const searchParams = useSearchParams()
 
    const userId = searchParams.get('userId')
  return (
    <div>
      <FavouriteVideos userId={userId}></FavouriteVideos>

      <Link href="/videos">Return</Link>
    </div>
  );
}
