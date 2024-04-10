'use client'
import { useState } from "react";
import Logincomp from "./components/login";
import Registercomp from "./components/register";
import {Button,Group } from '@mantine/core';

export default function EntryPage() {
  let[userState,setUser] = useState(false)
  let[disableLogin,toggleLogin] = useState(false)
  let[disableRegister,toggleRegister] = useState(true)

  return (
    <section className="landingPageContainer">
      <Group justify="center" mt={100}>
        {userState ? (<Logincomp/>) : (<Registercomp/>)}
      </Group>
      <Group justify="center" gap = "xl" mt={50}>
        <Button onClick={e => {
          setUser(true)
          toggleRegister(false)
          toggleLogin(true)
          }} disabled = {disableLogin}>Sign In</Button>
        <Button onClick={e => {
          setUser(false)
          toggleRegister(true)
          toggleLogin(false)
        }} disabled = {disableRegister}>Register</Button>
      </Group>
    </section>
  );
}