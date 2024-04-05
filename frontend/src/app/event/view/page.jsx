'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import { Button, Card, Container, Group, Text, Title } from "@mantine/core"
import Link from "next/link"
import dayjs from 'dayjs';
import FriendList from "./components/FriendList"
import DeleteButton from "./components/deleteButton"
import VisibilityBadge from "../components/visibilityBadge"

export default function EventView() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const eventId = searchParams.get('eventId')
    const userId = searchParams.get('id')

    const [event, setEvent] = useState({})
    const [location, setLocation] = useState({})
    const [friends, setFriends] = useState([])

    const getEvent = async () => {
        await axios.get(process.env.SERVER_URL + `/events/api/event?id=${eventId}`)
            .then(res => {
                console.log(res.data.event)
                console.log(res.data.location)
                setEvent(res.data.event)
                setLocation(res.data.location)
                setFriends(event.friends)
            })
            .catch(error => console.error("Error retrieving event:", error.message));
    }

    useEffect(() => {
        getEvent()        
    }, [])

    return (
        <Container>
            <Card shadow="sm" padding="lg" radius="md" withBorder mt={100}>
                <Card.Section>
                    <iframe
                        width="100%"
                        height="400"
                        loading="lazy"
                        frameBorder={0}
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.GOOGLE_MAPS_API_KEY}&q=${location.name}+${location.address}`}
                    />
                </Card.Section>
                <Card.Section px="md">
                    <Group justify="space-between" mt="md">
                        <Title order={3}>{event.name}</Title>
                        <VisibilityBadge visibility={event.visibility} />
                    </Group>
                    <Text>Created: {dayjs(event.creation_date).format("MMM D, YYYY h:mm A").toString()}</Text>
                    <Text>Date/Time: {dayjs(event.date_time).format("MMM D, YYYY h:mm A").toString()}</Text>
                    <Text>Description: {event.description}</Text>
                    <FriendList friends={friends} />
                </Card.Section>
                <Card.Section p="md">
                    <Group justify="space-between" mt="xl">
                        <Button component={Link} href={`/event/dashboard?id=${userId}`} variant="default">Back</Button>
                        <Group>
                            <DeleteButton eventId={eventId} />
                            <Button 
                                onClick={() => router.push(`/event/edit?eventId=${eventId}&id=${userId}`)} 
                                variant='default'
                            >
                                Edit
                            </Button>
                        </Group>
                    </Group>
                </Card.Section>
            </Card>
        </Container>
    )
}