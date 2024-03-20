'use client'
import Image from "next/image";
import styles from "./page.module.css";
import {redirect} from 'next/navigation'
import VideoList from "./Youtube/components/VideoList";

export default function Home() {
  const location = "Vancouver"
  let redirectToRegis = () => {
    console.log("Redirecting")
    redirect('/Register')
  }

  return (
    <body>
      <h1>Title of Website</h1>
      <section>
        <h2>TODO: Service API below this header</h2>
        <a href = '/Register'>Register Page</a>
      </section>
      <VideoList location = {location}></VideoList>
    </body>
  );
}
