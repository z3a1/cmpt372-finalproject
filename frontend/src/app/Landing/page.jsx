'use client'
import {
    Grid,
    Container,
    rem,
    Stack,
} from "@mantine/core";
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import NavBar from "../Components/navbar";
import userService from "../services/user"

export default function LandingPage(){

    const searchParams = useSearchParams()
    const id = searchParams.get("id")
    const router = useRouter()
    const [userLoaded,setUserLoadState] = useState(false)
    const [user,setCurrentUser] = useState(null)

    useEffect(() => {
        let setUser = async () => {
            let res = await userService.getUserId(id)
            if(res){
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
        <>
            <NavBar id = {id}/>
            <Container fluid h = {"100%"}>
                <Grid justify="flex-start" align="stretch">
                {/* First Grid Section */}
                <Grid.Col span={3} style={{ minheight: rem(120) }}>
                    <div id="friends-container" >
                    Friends List
                    </div>
                </Grid.Col>
                <Grid.Col span={9} style={{ minHeight: rem(80) }} >
                    <Stack>
                    <div id="events-container" >
                    Suggested Events
                    </div>
                    <div id="friendsActivity-container" >
                    Friends Activity
                    </div>
                    </Stack>
                </Grid.Col>
                </Grid>
            </Container>
        </>
    )
}