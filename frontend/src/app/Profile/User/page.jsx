'use client'

import {Loader, MantineProvider, Group} from '@mantine/core'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import axios from "axios"
import "./user.modules.css"


export default function verifyUser(){
    //This page either redirects the user to the landing page or back to the sign in and register page
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    const router = useRouter()
    const [userLoaded,setUserLoadState] = useState(false)
    const [user,setUser] = useState(null)

    let getUserId = async () => {
        if(id == undefined || id == null){
            router.back()
        }
        else{
            console.log(id)
            await axios.post(process.env.SERVER_URL + "/auth/getUserId", {id: id})
            .then(serverRes => {
                console.log(serverRes)
                setUserLoadState(true)
                setUser(serverRes.data)
            })
            .catch(err => {
                alert(err)
            })
        }
    }

    useEffect(() => {
        getUserId()
    },[])

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