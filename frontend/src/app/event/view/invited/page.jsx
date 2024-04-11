'use client'

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import { Button, Card, Container, Group, LoadingOverlay, SegmentedControl, Text, Textarea, Title } from "@mantine/core"
import Link from "next/link"
import dayjs from 'dayjs';
import AttendeeList from "../components/attendeeList"
import VisibilityBadge from "../../components/visibilityBadge"

export default function InvitedEventView() {
    const searchParams = useSearchParams()
    const eventId = searchParams.get('eventId')

    const [event, setEvent] = useState({})
    const [location, setLocation] = useState({})
    const [attendee, setAttendee] = useState({})
    const [allAttendees, setAllAttendees] = useState([])

    // Loader
    const [isLoaded, setIsLoaded] = useState(false)
    const [isAttendeeLoaded, setIsAttendeeLoaded] = useState(false)

    const getEvent = async () => {
        await axios.get(process.env.SERVER_URL + `/events/api/event?id=${eventId}`, {withCredentials: true})
            .then(res => {
                setEvent(res.data.event)
                setLocation(res.data.location)
                setAllAttendees(res.data.attendees)
                setIsLoaded(true)
            })
            .catch(error => console.error("Error retrieving event:", error.message))
    }

    const getAttendee = async () => {
        await axios.get(process.env.SERVER_URL + `/events/api/event/attendee?eventId=${eventId}`, {withCredentials: true})
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
            status: status
        }, {withCredentials: true})
            .catch(error => console.error("Error updating status:", error.message))
    }

    return (
        <Container>
            <Card shadow="sm" padding="lg" radius="md" withBorder mt={60}>
                <LoadingOverlay visible={!isLoaded && !isAttendeeLoaded} />
                {isLoaded && isAttendeeLoaded && (
                    <>
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
                                minRows={3}
                                maxRows={3}
                            />
                            <AttendeeList attendees={allAttendees} />
                        </Card.Section>
                        <Card.Section p="md">
                            <Group justify="space-between" mt="xl">
                                <Button component={Link} href={`/event/dashboard`} variant="default">Back</Button>
                                <Group>
                                    <SegmentedControl 
                                        color="green" 
                                        data={["invited", "confirmed", "rejected"]}
                                        onChange={(value) => handleStatus(value.toLowerCase())}
                                        defaultValue={attendee.status}
                                    />
                                </Group>
                            </Group>
                        </Card.Section>
                    </>
                )}
            </Card>
        </Container>
    )
}