'use client'
import styles from "./page.module.css";
import { useState } from "react";
import Logincomp from "./auth/login/login";
import Registercomp from "./auth/register/register";

export default function Home() {
  let[userState,setUser] = useState(false)

  return (
    <body>
      <h1>Socialiser</h1>
      <section className={styles.landingPageContainer}>
        {userState ? (<Logincomp/>) : (<Registercomp/>)}
        <button onClick={e => setUser(!userState)}>Sign In</button>
        <button onClick={e => setUser(!userState)}>Register</button>
      </section>
    </body>
  );
}
