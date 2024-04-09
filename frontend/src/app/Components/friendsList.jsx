'use client'
import { useState,useEffect } from "react";
import axios from "axios"
import { UnstyledButton, Group, Avatar, Text, rem, Loader } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';


export default function friendsList(params){

    let user_id = params.user_id
    let [friends,setFriendsArr] = useState([])
    let [loadingFriendsArr,setLoadingState] = useState(false)

    useEffect(() => {
        let getFriendsArr = async () => {
            await axios.post(process.env.SERVER_URL + '/friends/get/accepted', {
                user_id: user_id
            })
            .then(res => {
                setFriendsArr(res)
                setLoadingState(true)
            })
        }
        getFriendsArr()
    },[])


    return(
        <>
            {!loadingFriendsArr && <Loader color = "blue"/>}
            {loadingFriendsArr && friends.map((item,index) => {
                return(
                    <UnstyledButton>
                        <Group>
                            <Avatar radius="xl"/>
                            <div style = {{flex: 1}}>
                                <Text size = "sm" fw = {500}>{item.username}</Text>
                                <Text c = "dimmed" size = "xs">{item.fname} {item.lname}</Text>
                            </div>
                            <IconChevronRight style = {{width: rem(14), height: rem(14)}} stroke = {1.5}/>
                        </Group>
                    </UnstyledButton>
                )
            })}
        </>
    )
}