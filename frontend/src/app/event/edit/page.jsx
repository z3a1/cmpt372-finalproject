'use client'

import React from 'react'
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios';
import { DateTimePicker } from '@mantine/dates';
import { Container, TextInput, MultiSelect, Switch, Textarea, Button, Group, Title, ActionIcon, Card, Flex, Popover, Text } from '@mantine/core';
import { chevronDownIcon, chevronUpIcon, lockIcon, unlockIcon } from '../lib/icon';
import dayjs from 'dayjs';
import Map from './components/map'

export default function EditEvent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const eventId = searchParams.get('eventId')
    const userId = searchParams.get('id')

    const [event, setEvent] = useState({})
    const [location, setLocation] = useState({})
    const [dateTime, setDateTime] = useState(new Date())

    // For when address button is used
    const [isAddressOpen, setIsAddressOpen] = useState(false)

    // Friends taken from user
    const [friends, setFriends] = useState([])

    // Map selection
    const [selectedPlaceName, setSelectedPlaceName] = useState("");
    const [selectedAddress, setSelectedAddress] = useState("No address selected");

    const [formData, setFormData] = useState({
        eventName: "",
        placeName: "",
        address: "",
        dateTime: new Date(),
        friends: [],
        visibility: "",
        description: ""
    })

    const getEvent = async () => {
        await axios.get(process.env.SERVER_URL + `/events/api/event?id=${eventId}`)
            .then(res => {
                console.log(res.data.event)
                console.log(res.data.location)
                setEvent(res.data.event)
                setLocation(res.data.location)
                setFriends(event.friends)
                setSelectedPlaceName(res.data.location.name)
                setSelectedAddress(res.data.location.address)
                setDateTime(new Date(res.data.event.date_time))
            })
            .catch(error => console.error("Error retrieving event:", error.message));
    }
    
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

    const submitForm = async (e) => {
        e.preventDefault();

        formData.visibility = formData.visibility ? 'public' : 'private'
        formData.dateTime = dateTime
        formData.address = selectedAddress
        formData.placeName = selectedPlaceName
        
        await axios.post(process.env.SERVER_URL + `/events/api/event/edit?id=${eventId}`, formData)
            .then(() => {
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

        router.push(`/event/view?eventId=${eventId}&id=${userId}`)
    }

    useEffect(() => {
        getEvent()
        // TODO: Set friends
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
                <Container size="xs" my={20}>
                    <Title order={1}>Edit Event</Title>
                </Container>
                <Container size="xs" my={20}>
                    <TextInput 
                        label="Name"
                        placeholder="Event name"
                        name="eventName"
                        onChange={handleInput}
                        size="md"
                        required
                        withAsterisk={false}
                        defaultValue={event.name}
                    />
                </Container>
                <Container size="xs" my={20}>
                    <TextInput
                        label="📍 Location"
                        defaultValue={selectedPlaceName}
                        placeholder='Place name'
                        name="placeName"
                        onChange={handleInput}
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
                </Container>
                <Container size="xs" my={20}>
                    <DateTimePicker
                        label="📅 Date / Time"
                        placeholder="Pick a date and time"
                        valueFormat="MMM D, YYYY h:mm A"
                        size="md"
                        name="dateTime"
                        comboboxprops={{ transitionProps: { transition: 'fade', duration: 200 } }}
                        required
                        withAsterisk={false}
                        clearable
                        value={dayjs(dateTime, 'MMM D, YYYY h:mm A').toDate()}
                        onChange={setDateTime}
                    />
                </Container>
                <Container size="xs" my={20}>
                    {/* Added friends will be notified via email? */}
                    <MultiSelect
                        label="🤝 Friends"
                        placeholder="Select friends"
                        checkIconPosition="right"
                        data={friends}
                        maxDropdownHeight={200}
                        comboboxProps={{ transitionProps: { transition: 'fade', duration: 200 } }}
                        clearable
                    />
                </Container>
                <Container size="xs" my={20}>       
                    <Switch 
                        label="👀 Visibility"
                        labelPosition="left"
                        name="visibility"
                        onChange={handleInput}
                        size="md"
                        onLabel={unlockIcon} 
                        offLabel={lockIcon} 
                        defaultChecked={event.visibility === 'public' ? true : false}
                    />
                </Container>
                <Container size="xs" my={20}>
                    <Textarea
                        label="Description"
                        placeholder="Description"
                        name="description"
                        onChange={handleInput}
                        size="md"
                        minRows={3}
                        resize="vertical"
                        autosize
                        defaultValue={event.description}
                    />
                </Container>
                <Container size="xs" my={20}>
                    <Group justify="space-between">
                        <Button 
                            component={Link} 
                            href={`/event/view?eventId=${eventId}&id=${userId}`} 
                            color="gray"
                            type="button"
                        >
                            Back
                        </Button>
                        <Button type="submit" color="green">Edit</Button>
                    </Group>
                </Container>
            </form>
        </Card>
    </Flex>
  )
}
