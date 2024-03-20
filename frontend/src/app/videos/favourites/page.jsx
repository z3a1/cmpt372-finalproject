'use client'
import FavouriteVideos from "../components/FavouriteVideos";
import { useSearchParams } from 'next/navigation'

export default function FavouritesPage() {
    const searchParams = useSearchParams()
 
    const userId = searchParams.get('userId')
  return (
    <div>
      <FavouriteVideos userId={userId}></FavouriteVideos>

      <a href="/videos">Return</a>
    </div>
  );
}
