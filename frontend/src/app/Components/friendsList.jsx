'use client'
import { useState,useEffect } from "react";
import axios from "axios"
import { Title, Container, UnstyledButton, Group, Avatar, Text, rem, Loader } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';


export default function FriendsList(){
    let [friends,setFriendsArr] = useState([])
    let [loadingFriendsArr,setLoadingState] = useState(false)

    useEffect(() => {
        let getFriendsArr = async () => {
            await axios.get(process.env.SERVER_URL + '/friends/get/accepted', { withCredentials: true})
            .then(res => {
                setLoadingState(true)
                console.log(res);
                setFriendsArr(res.data)
            })
        }
        getFriendsArr()
    },[])


    return(
        <>
            <Title size = 'md'>Friends </Title>
            {loadingFriendsArr && 
            <>
             {friends.map((item,index) => {
                return(
                    <Container fluid>
                    <UnstyledButton  style = {{width:"100%"}}>
                        <Group  style = {{width:"100%"}}>
                            <Avatar radius="xl"/>
                            <div style = {{flex: 1}}>
                                <Text size = "sm" fw = {500}>{item.username}</Text>
                                <Text c = "dimmed" size = "xs">{item.fname} {item.lname}</Text>
                            </div>
                            <IconChevronRight style = {{width: rem(14), height: rem(14)}} stroke = {1.5}/>
                        </Group>
                    </UnstyledButton>
                </Container>
                )
            })} 
            </>}
        </>
    )
}