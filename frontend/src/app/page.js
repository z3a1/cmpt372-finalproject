'use client'
import Image from "next/image";
import styles from "./page.module.css";
import {redirect} from 'next/navigation'
import Link from "next/link";

export default function Home() {

  let redirectToRegis = () => {
    console.log("Redirecting")
    redirect('/Register')
  }

  return (
    <body>
      <h1>Socialiser</h1>
      <section>
        <h2>TODO: Service API below this header</h2>
        <Link href = '/Register'>Register Page</Link><br/>
        <Link href = '/friends'>Friends Page</Link><br/>
        <Link href = '/maps'>Maps Page</Link><br/>
        <Link href = '/videos'>Videos Page</Link>
      </section>
    </body>
  );
}
