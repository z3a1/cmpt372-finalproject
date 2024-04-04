'use client'

import {Loader, MantineProvider, Group, Title, SimpleGrid} from '@mantine/core'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import "./user.modules.css"
import userService from "../services/user"


export default function verifyUser(){
    //This page either redirects the user to the landing page or back to the sign in and register page
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    const router = useRouter()
    const [userLoaded,setUserLoadState] = useState(false)
    const [user,setCurrentUser] = useState(null)

    useEffect(() => {
        let setUser = async () => {
            let res = await userService.getUserId(id)
            if(res){
                console.log(res)
                setUserLoadState(true)
                setCurrentUser(res)
            }
            else{
                router.push("/")
            }
        }
        setUser()
    },[])

    return(
        <MantineProvider>
            <Group justify='center' mx = "auto" maw = {500} className='loaderStyles'>
                {!userLoaded && <Loader color = "cyan" size = {500}/>}
                {userLoaded && 
                <SimpleGrid bg="var(--mantine-color-blue-light)" cols = {1}>
                    <Title order={3}>Current User: {user.username}</Title>
                    <Title order = {4}>Name: {user.fname} {user.lname}</Title>
                    <Title order = {4}>Email: {user.email}</Title>
                    <Title order = {4}>Password: {'*'.repeat(10)}</Title>
                </SimpleGrid>}
            </Group>
        </MantineProvider>
    )
}