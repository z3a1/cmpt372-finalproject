'use client'
import styles from "./registerStyle.module.css";
import { useState } from "react";
import Logincomp from "./components/login";
import Registercomp from "./components/register";
import {MantineProvider } from '@mantine/core';

export default function Home() {
  let[userState,setUser] = useState(false)
  let[disableLogin,toggleLogin] = useState(false)
  let[disableRegister,toggleRegister] = useState(true)

  return (
    <MantineProvider>
      <body>
        <h1>Socialiser</h1>
        <section className={styles.landingPageContainer}>
          {userState ? (<Logincomp/>) : (<Registercomp/>)}
          <button onClick={e => {
            setUser(true)
            toggleRegister(false)
            toggleLogin(true)
            }} disabled = {disableLogin}>Sign In</button>
          <button onClick={e => {
            setUser(false)
            toggleRegister(true)
            toggleLogin(false)
          }} disabled = {disableRegister}>Register</button>
        </section>
      </body>
    </MantineProvider>
  );
}