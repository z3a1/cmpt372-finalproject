'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import { Button, Card, Container, Group, LoadingOverlay, SegmentedControl, Text, Textarea, Title } from "@mantine/core"
import Link from "next/link"
import dayjs from 'dayjs';
import FriendList from ".././components/FriendList"
import VisibilityBadge from "../../components/visibilityBadge"

export default function EventView() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const eventId = searchParams.get('eventId')
    const userId = searchParams.get('id')

    const [event, setEvent] = useState({})
    const [location, setLocation] = useState({})
    const [friends, setFriends] = useState([])
    const [attendee, setAttendee] = useState({})

    // Loader
    const [isLoaded, setIsLoaded] = useState(false)
    const [isAttendeeLoaded, setIsAttendeeLoaded] = useState(false)

    const getEvent = async () => {
        await axios.get(process.env.SERVER_URL + `/events/api/event?id=${eventId}`)
            .then(res => {
                // console.log(res.data.event)
                // console.log(res.data.location)
                setEvent(res.data.event)
                setLocation(res.data.location)
                setFriends(event.friends)
                setIsLoaded(true)
            })
            .catch(error => console.error("Error retrieving event:", error.message))
    }

    const getAttendee = async () => {
        await axios.get(process.env.SERVER_URL + `/events/api/event/attendee?eventId=${eventId}&userId=${userId}`)
            .then(res => {
                console.log(res.data.attendee)
                setAttendee(res.data.attendee)
                setIsAttendeeLoaded(true)
            })
            .catch(error => console.error("Error retrieving attendee:", error.message))
    }

    useEffect(() => {
        getEvent()   
        getAttendee()     
    }, [])

    const handleStatus = async (status) => {
        await axios.post(process.env.SERVER_URL + '/events/api/event/attendee/status', {
            eventId: eventId,
            userId: userId,
            status: status
        })
            .catch(error => console.error("Error updating status:", error.message))
    }

    return (
        <Container>
            <Card shadow="sm" padding="lg" radius="md" withBorder mt={60}>
                <Card.Section>
                    <iframe
                        width="100%"
                        height="360"
                        loading="lazy"
                        frameBorder={0}
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.GOOGLE_MAPS_API_KEY}&q=${location.address}`}
                    />
                </Card.Section>
                <Card.Section px="md">
                    <Group justify="space-between" mt="md" mb="sm">
                        <Title order={3}>{event.name}</Title>
                        <VisibilityBadge visibility={event.visibility} />
                    </Group>
                    <Text mb="xs">Created: {dayjs(event.creation_date).format("MMM D, YYYY h:mm A").toString()}</Text>
                    <Text mb="xs">Location: {location.name}</Text>
                    <Text mb="xs">Address: {location.address}</Text>
                    <Text mb="xs">Date/Time: {dayjs(event.date_time).format("MMM D, YYYY h:mm A").toString()}</Text>
                    <Textarea 
                        label="Description:" 
                        size="md"   
                        value={event.description} 
                        mb="sm"
                    />
                    <FriendList friends={friends} />
                </Card.Section>
                <Card.Section p="md">
                    <Group justify="space-between" mt="xl">
                        <Button component={Link} href={`/event/dashboard?id=${userId}`} variant="default">Back</Button>
                        <Group>
                            {attendee.status && (
                                <SegmentedControl 
                                    color="green" 
                                    data={["invited", "confirmed", "rejected"]}
                                    onChange={(value) => handleStatus(value.toLowerCase())}
                                    defaultValue={attendee.status}
                                />
                            )}
                        </Group>
                    </Group>
                </Card.Section>
                <LoadingOverlay visible={!isLoaded && !isAttendeeLoaded} />
            </Card>
        </Container>
    )
}