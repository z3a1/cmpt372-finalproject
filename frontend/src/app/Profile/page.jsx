'use client'

import {Loader,Text, Avatar, Paper, Container} from '@mantine/core'
import {  useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import "./user.modules.css"
import FavouriteVideos from '../videos/components/FavouriteVideos'
import { IconMap } from '@tabler/icons-react'
import { getUserInfo } from '../services/user'

export default function verifyUser(){
    //This page either redirects the user to the landing page or back to the sign in and register page
    const router = useRouter()
    const [userLoaded,setUserLoadState] = useState(false)
    const [user,setCurrentUser] = useState(null)

    const getUser = async () => {
        const user = await getUserInfo();
        if (user) {
            setUserLoadState(true);
            setCurrentUser(user);
        } else {
            router.push("/");
        }
    } 

    useEffect(() => {
        getUser();
    },[])

    return(
        <>
            <Container justify='center' mx = "auto" maw = {500} className='loaderStyles' mt={100} fluid>
                {!userLoaded && <Loader color = "cyan" size = {500}/>}
                {userLoaded &&
                <>
                <Paper radius="md" withBorder p="lg" bg="var(--mantine-color-body)" shadow='xl'>
                    <IconMap className="icon-map" color = 'lightblue'/>
                    <Avatar radius= {120} size = {120}mx = "auto"/>
                    <Text ta="center" fz="lg" fw={500} mt="md"> {user.username}</Text>
                    <Text fz = "md" c = "dimmed" ta = "center">{user.email}</Text>
                    <Text fz = "sm" c = "dimmed" ta = "center">{`${user.fname} ${user.lname}`}</Text>
                </Paper>
                </>}
                <FavouriteVideos/>
            </Container>
        </>
    )
}
