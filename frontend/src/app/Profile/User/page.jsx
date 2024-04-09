'use client'

import {Loader, MantineProvider, Group} from '@mantine/core'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import axios from 'axios';
import "./user.modules.css"
import { getUserInfo } from '../../services/user'

export default function verifyUser(){
    //This page either redirects the user to the landing page or back to the sign in and register page
    const router = useRouter()
    const [userLoaded,setUserLoadState] = useState(false)
    const [user,setUser] = useState(null)

    let getUserId = async () => {
        await axios.get(process.env.SERVER_URL + "/auth/user/info", {withCredentials: true})
            .then(res => {
                if (res.data.user) {
                    setUser(res.data.user)
                    setUserLoadState(true)
                } else {
                    router.push('/')
                }
            })
            .catch(err => {
                alert(err)
            })
    }

    useEffect(() => {
        getUserId()
    }, [])

    return(
        <MantineProvider>
            <Group justify='center' mx = "auto" maw = {500} className='loaderStyles'>
                {!userLoaded && <Loader color = "cyan" size = {500}/>}
                {userLoaded && 
                <section>
                    <h1>User loaded: </h1>
                    <p>{user.fname}</p>
                    <p>{user.lname}</p>
                </section>}
            </Group>
        </MantineProvider>
    )
}