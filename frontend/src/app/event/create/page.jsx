'use client'

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios';
import { DateTimePicker } from '@mantine/dates';
import { Container, TextInput, MultiSelect, Switch, Textarea, Button, Group, Title, Blockquote, ActionIcon, Card, LoadingOverlay } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUnlock, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'

export default function CreateEvent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const placeName = searchParams.get('placeName')
    const address = searchParams.get('address')

    const [formData, setFormData] = useState({
        creatorId: "",
        eventName: "",
        placeName: placeName,
        address: address,
        dateTime: "",
        friends: [],
        visibility: "private",
        description: ""
    })

    // For when address button is used
    const [isAddressOpen, setIsAddressOpen] = useState(false)

    // Friends taken from user
    const [friends, setFriends] = useState([])
    const [invitedFriends, setInvitedFriends] = useState([])
    const [isFriendsLoaded, setIsFriendsLoaded] = useState(false)

    const lockIcon = (
        <FontAwesomeIcon 
            icon={faLock}
            size="2xl"
        />
    );
    
    const unlockIcon = (
        <FontAwesomeIcon 
            icon={faUnlock}
            size="2xl"
        />
    );

    const chevronUpIcon = (
        <FontAwesomeIcon 
            icon={faChevronUp}
            size="sm"
        />
    )

    const chevronDownIcon = (
        <FontAwesomeIcon 
            icon={faChevronDown}
            size="sm"
        />
    )
    

    const setFormField = (fieldName, fieldValue) => {
        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: fieldValue
        }));
    } 

    const handleInput = (e) => {
        const fieldName = e.target.name;
        let fieldValue = e.target.value;

        if (fieldName == "visibility") {
            if (fieldValue == "on") {
                fieldValue = "public"
            } else {
                fieldValue = "private"
            }
        }
        setFormField(fieldName, fieldValue);
    }

    const handleAddressClick = () => {
        setIsAddressOpen(!isAddressOpen)
    }

    const handleDateTimeChange = (date) => {
        setFormField("dateTime", date.toString());
    }

    const submitForm = async (e) => {
        formData.friends = invitedFriends
        console.log(formData)

        e.preventDefault();

        await axios.post(process.env.SERVER_URL + "/events/api/event/create", formData, {withCredentials: true}) 
            .then(() => {
                // Reset form
                setFormData({
                    creatorId: "",
                    eventName: "",
                    placeName: placeName,
                    address: address,
                    dateTime: "",
                    friends: [],
                    visibility: "private",
                    description: ""
                });
            })
            .catch(error => console.log(error.message))
        router.push(`/event/dashboard`)
    }

    useEffect(() => {
        const fetchUser = async () => {
            await axios.get(process.env.SERVER_URL + "/auth/user/info", {withCredentials: true})
                .then(res => {
                    setFormField("creatorId", res.data.user._id)
                })
                .catch(error => console.log(error.message))
        }
        fetchUser();

        const fetchFriends = async () => {
            await axios.get(process.env.SERVER_URL + `/friends/get/accepted`, {withCredentials: true})
                .then((res) => {
                    console.log(res.data.friendArray)
                    setFriends(res.data.friendArray.map((friend) => friend.username))
                    setIsFriendsLoaded(true)
                })
                .catch(error => console.log(error.message))
        }
        fetchFriends();
    }, [])

    return (
        <Container mt={80}>
            <Card shadow="sm" padding="lg" radius="md" withBorder mt={100}>
                <form method="POST" onSubmit={submitForm}>  
                    <LoadingOverlay visible={!isFriendsLoaded} size={50} />
                    {isFriendsLoaded && (
                        <Container size="xs" my={20}>
                            <Title order={1} my={20} >Create Event</Title>
                            <TextInput 
                                label="🙌 Name"
                                placeholder="Event name"
                                name="eventName"
                                onChange={handleInput}
                                size="md"
                                required
                                withAsterisk={false}
                                my={20}
                            />
                            <TextInput
                                label="📍 Location"
                                defaultValue={placeName}
                                placeholder='Place name'
                                name="placeName"
                                onChange={handleInput}
                                size="md"
                                withAsterisk={false}
                                required
                                rightSection={
                                    <ActionIcon onClick={handleAddressClick} radius="xl" color="green">
                                        {isAddressOpen ? chevronUpIcon : chevronDownIcon}
                                    </ActionIcon>
                                }
                            />
                            {isAddressOpen && (
                                <Blockquote color="green" size="md">
                                    {address}
                                </Blockquote>
                            )}
                            <DateTimePicker
                                label="📅 Date / Time"
                                placeholder="Date and time"
                                valueFormat="MMM D, YYYY h:mm A"
                                size="md"
                                name="dateTime"
                                onChange={handleDateTimeChange}
                                comboboxprops={{ transitionProps: { transition: 'fade', duration: 200 } }}
                                required
                                withAsterisk={false}
                                clearable
                                mt={20}
                                my={20}
                            />
                            <MultiSelect
                                label="🤝 Friends"
                                placeholder="Friends"
                                checkIconPosition="right"
                                name="friends"
                                onChange={setInvitedFriends}
                                data={friends}
                                maxDropdownHeight={200}
                                comboboxprops={{ transitionProps: { transition: 'fade', duration: 200 } }}
                                clearable
                                my={20}
                            />
                            <Switch 
                                label="👀 Visibility"
                                labelPosition="left"
                                name="visibility"
                                onChange={handleInput}
                                size="md"
                                onLabel={unlockIcon} 
                                offLabel={lockIcon} 
                                my={20}
                            />
                            <Textarea
                                label="✏️ Description"
                                placeholder="Description"
                                name="description"
                                onChange={handleInput}
                                size="md"
                                autosize
                                minRows={3}
                                maxRows={3}
                                my={20}
                            />
                            <Group justify="space-between">
                                <Button 
                                    component={Link} 
                                    href={`/event/map`}
                                    variant='default'
                                    type="button"
                                >
                                    Back
                                </Button>
                                <Button type="submit" color='green'>Create</Button>
                            </Group>    
                        </Container>
                    )}
                </form>
            </Card>
        </Container>
    )
}
