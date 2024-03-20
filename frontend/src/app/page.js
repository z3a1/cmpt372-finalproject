'use client'
import Image from "next/image";
import styles from "./page.module.css";
import {redirect} from 'next/navigation'

export default function Home() {

  let redirectToRegis = () => {
    console.log("Redirecting")
    redirect('/Register')
  }

  return (
    <body>
      <h1>Title of Website</h1>
      <section>
        <h2>TODO: Service API below this header</h2>
        <a href = '/Register'>Register Page</a><br/>
        <a href = '/friends'>Friends Page</a>
      </section>
    </body>
  );
}
