'use client'

import {Loader, MantineProvider, Group, Title, SimpleGrid, Center} from '@mantine/core'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import "./user.modules.css"
import FavouriteVideos from '../videos/components/FavouriteVideos'
import NavBar from '../Components/navbar'
import { getUserInfo } from '../services/user'

export default function verifyUser(){
    //This page either redirects the user to the landing page or back to the sign in and register page
    const router = useRouter()
    const [userLoaded,setUserLoadState] = useState(false)
    const [user,setCurrentUser] = useState(null)

    const getUser = async () => {
        const userInfo = await getUserInfo()
        if (userInfo) {
            setCurrentUser(userInfo)
            setUserLoadState(true)
        } else {
            router.push('/') 
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    return(
        <MantineProvider>
            <NavBar/>
            <Group justify='center' mx = "auto" maw = {500} className='loaderStyles'>
                {!userLoaded && <Loader color = "cyan" size = {500}/>}
                {userLoaded && 
                <SimpleGrid bg="var(--mantine-color-blue-light)" cols = {1}>
                    <Title order = {3}>Current User: {user.username}</Title>
                    <Title order = {4}>Name: {user.fname} {user.lname}</Title>
                    <Title order = {4}>Email: {user.email}</Title>
                    <Title order = {4}>Password: {'*'.repeat(10)}</Title>
                    <Center>
                        <FavouriteVideos/>
                    </Center>
                </SimpleGrid>}
            </Group>
        </MantineProvider>
    )
}