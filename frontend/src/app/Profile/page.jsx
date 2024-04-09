'use client'

import {Loader,Text, Avatar, Paper, Container} from '@mantine/core'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import "./user.modules.css"
import FavouriteVideos from '../videos/components/FavouriteVideos'
import NavBar from '../Components/navbar'
import { IconMap } from '@tabler/icons-react'
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
        <>
            <NavBar/>
            <Container justify='center' mx = "auto" maw = {500} className='loaderStyles' mt={100} fluid>
                {!userLoaded && <Loader color = "cyan" size = {500}/>}
                {userLoaded && (
                    <Paper radius="md" withBorder p="lg" bg="var(--mantine-color-body)" shadow='xl'>
                        <IconMap className="icon-map" color = 'lightblue'/>
                        <Avatar radius= {120} size = {120}mx = "auto"/>
                        <Text ta="center" fz="lg" fw={500} mt="md"> {user.username}</Text>
                        <Text fz = "md" c = "dimmed" ta = "center">{user.email}</Text>
                        <Text fz = "sm" c = "dimmed" ta = "center">{`${user.fname} ${user.lname}`}</Text>
                    </Paper>
                )}
                <FavouriteVideos/>
            </Container>
        </>
    )
}

/**
 * <SimpleGrid bg="var(--mantine-color-blue-light)" cols = {1}>
                    <Title order={3}>Current User: {user.username}</Title>
                    <Title order = {4}>Name: {user.fname} {user.lname}</Title>
                    <Title order = {4}>Email: {user.email}</Title>
                    <Title order = {4}>Password: {'*'.repeat(10)}</Title>
                    <Center>
                        <FavouriteVideos/>
                    </Center>
                </SimpleGrid>
 */