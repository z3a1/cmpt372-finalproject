'use client'

import React from 'react'
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios';
import { DateTimePicker } from '@mantine/dates';
import { Container, TextInput, MultiSelect, Textarea, Button, Group, Title, ActionIcon, Card, Flex, Popover, Text, LoadingOverlay, Radio } from '@mantine/core';
import dayjs from 'dayjs';
import Map from './components/map'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'

export default function EditEvent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const eventId = searchParams.get('eventId')

    const [event, setEvent] = useState({})
    const [dateTime, setDateTime] = useState(new Date())

    // For when address button is used
    const [isAddressOpen, setIsAddressOpen] = useState(false)

    // Friends
    const [friends, setFriends] = useState([])
    const [areFriendsLoaded, setAreFriendsLoaded] = useState(false)

    // Current attendees
    const [currentAttendees, setCurrentAttendees] = useState([])

    // Map selection
    const [selectedPlaceName, setSelectedPlaceName] = useState("");
    const [selectedAddress, setSelectedAddress] = useState("No address selected");

    // Loading overlay
    const [isLoaded, setIsLoaded] = useState(false)

    const [formData, setFormData] = useState({
        eventName: "",
        placeName: "",
        address: "",
        dateTime: new Date(),
        attendees: [],
        visibility: "",
        description: ""
    })

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

    const getEvent = async () => {
        await axios.get(process.env.SERVER_URL + `/events/api/event?id=${eventId}`, {withCredentials: true})
            .then(res => {
                console.log("Event retrieved successfully", res.data)

                setEvent(res.data.event)
                setSelectedPlaceName(res.data.location.name)
                setSelectedAddress(res.data.location.address)
                setDateTime(new Date(res.data.event.date_time))
                setCurrentAttendees(res.data.attendees.map(attendee => attendee.user.username))
                formData.eventName = res.data.event.name
                
                setIsLoaded(true)
            })
            .catch(error => {
                console.error("Error retrieving event:", error.message)
            })
    }

    const getFriends = async () => {
        await axios.get(process.env.SERVER_URL + `/friends/get/accepted`, {withCredentials: true})
            .then(res => {
                console.log("Friends retrieved successfully", res.data.friendArray)

                setFriends(res.data.friendArray.map(friend => friend.username))

                setAreFriendsLoaded(true)
            })
            .catch(error => {
                console.error("Error retrieving friends:", error.message)
            })
    }
    
    const setFormField = (fieldName, fieldValue) => {
        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: fieldValue
        }));
        event[fieldName] = fieldValue
    }

    const handleInput = (e) => {
        const fieldName = e.target.name;
        let fieldValue = e.target.value;
        setFormField(fieldName, fieldValue);
    }

    const handleRadioInput = (val) => {
        setFormField('visibility', val)
    }

    const handleAddressClick = () => {
        setIsAddressOpen(!isAddressOpen)
    }

    const submitForm = async (e) => {
        e.preventDefault();

        // For when user doesn't change information
        formData.visibility = event.visibility === "public" ? 'public' : 'private'
        formData.dateTime = dateTime
        formData.address = selectedAddress
        formData.placeName = selectedPlaceName
        formData.description = event.description
        formData.attendees = currentAttendees
        
        await axios.post(process.env.SERVER_URL + `/events/api/event/edit?id=${eventId}`, formData, {withCredentials: true})
            .then(() => {
                console.log("Event edited successfully", formData)
                // Reset form
                setFormData({
                    eventName: "",
                    placeName: "",
                    address: "",
                    dateTime: new Date(),
                    friends: [],
                    visibility: "",
                    description: ""
                });
            })
            .catch(error => console.log(error.message))

        router.push(`/event/view/created?eventId=${eventId}`)
    }

    useEffect(() => {
        getEvent()
        getFriends()
    }, [])

  return (
    <Flex
      mih={50}
      gap="xs"
      justify="center"
      align="center"
      direction="row"
      wrap="wrap"
      mt={100}
    >
        <Map 
            selectedPlaceName={selectedPlaceName} 
            setSelectedPlaceName={setSelectedPlaceName} 
            setSelectedAddress={setSelectedAddress}
        />
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: '25vw' }}>
            <form method="POST" onSubmit={submitForm}>  
                <LoadingOverlay visible={!isLoaded && !areFriendsLoaded} size={50} />
                {isLoaded && areFriendsLoaded && (
                    <>
                        <LoadingOverlay visible={!isLoaded && !areFriendsLoaded} size={50} />
                        <Container size="xs" my={20}>
                            <Title order={1} my={20}>Edit Event</Title>
                            <TextInput 
                                label="Name"
                                placeholder="Event name"
                                name="eventName"
                                onChange={handleInput}
                                size="md"
                                required
                                withAsterisk={false}
                                defaultValue={event.name}
                                my={20}
                            />
                            <TextInput
                                label="📍 Location"
                                defaultValue={selectedPlaceName}
                                placeholder='Location name'
                                name="placeName"
                                onChange={(e) => {
                                    handleInput(e)
                                    setSelectedPlaceName(e.target.value)
                                }}
                                size="md"
                                withAsterisk={false}
                                required
                                rightSection={
                                    <Popover width={200} position="bottom" withArrow shadow="md" onChange={handleAddressClick}>
                                        <Popover.Target>
                                            <ActionIcon radius="xl" color="green">
                                                {isAddressOpen ? chevronUpIcon : chevronDownIcon}
                                            </ActionIcon>
                                        </Popover.Target>
                                        <Popover.Dropdown>
                                            <Text size='sm'>{selectedAddress}</Text>
                                        </Popover.Dropdown>
                                    </Popover>
                                }
                            />
                            <DateTimePicker
                                label="📅 Date / Time"
                                placeholder="Date and time"
                                valueFormat="MMM D, YYYY h:mm A"
                                size="md"
                                name="dateTime"
                                comboboxprops={{ transitionProps: { transition: 'fade', duration: 200 } }}
                                required
                                withAsterisk={false}
                                clearable
                                value={dayjs(dateTime, 'MMM D, YYYY h:mm A').toDate()}
                                onChange={setDateTime}
                                mt={20}
                                my={20}
                            />
                            <MultiSelect
                                label="🤝 Friends"
                                placeholder="Friends"
                                checkIconPosition="right"
                                data={friends}
                                defaultValue={currentAttendees}
                                onChange={setCurrentAttendees}
                                maxDropdownHeight={200}
                                comboboxProps={{ transitionProps: { transition: 'fade', duration: 200 } }}
                                searchable
                                clearable
                                my={20}
                            />
                            <Radio.Group 
                                name='visibility'
                                label="👀 Visibility"
                                defaultValue={event.visibility === "public" ? "public" : "private"}
                                onChange={handleRadioInput}
                                my={20}
                            >
                                <Group>
                                    <Radio
                                        value="public"
                                        label="Public"
                                    />
                                    <Radio
                                        value="private"
                                        label="Private"
                                    />
                                </Group>
                            </Radio.Group> 
                            <Textarea
                                label="Description"
                                placeholder="Description"
                                name="description"
                                onChange={handleInput}
                                size="md"
                                minRows={3}
                                maxRows={3}
                                defaultValue={event.description}
                                my={20}
                            />
                            <Group justify="space-between">
                                <Button 
                                    component={Link} 
                                    href={`/event/view/created?eventId=${eventId}`} 
                                    variant='default'
                                    type="button"
                                >
                                    Back
                                </Button>
                                <Button type="submit" color="green">Edit</Button>
                            </Group>
                        </Container>
                    </>
                )}
            </form>
        </Card>
    </Flex>
  )
}
