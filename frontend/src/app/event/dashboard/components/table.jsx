import { useRouter, useSearchParams } from "next/navigation";
import { ActionIcon, Center, Loader, Table } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { eyeIcon } from "../../lib/icon";
import dayjs from 'dayjs';
import VisibilityBadge from "../../components/visibilityBadge"; 
import StatusBadge from "../../components/statusBadge";

export default function EventTable({ eventType }) {
    const router = useRouter()
    const searchParams = useSearchParams();
    const userId = searchParams.get('id')

    const [createdEvents, setCreatedEvents] = useState([])
    const [invitedEvents, setInvitedEvents] = useState([])
    const [isCreatedEventsLoaded, setIsCreatedEventsLoaded] = useState(false)
    const [isInvitedEventsLoaded, setIsInvitedEventsLoaded] = useState(false)
    const areBothEventsLoaded = isCreatedEventsLoaded && isInvitedEventsLoaded

    const getAllCreatedEvents = async () => {
        await axios.get(process.env.SERVER_URL + `/events/api/event/created?id=${userId}`, {withCredentials: true})
            .then(res => {
                setCreatedEvents(res.data.eventPackages)
                setIsCreatedEventsLoaded(true)
            })
            .catch(error => console.error("Error getting all created events:", error.message))
    }

    const getAllInvitedEvents = async () => {
        await axios.get(process.env.SERVER_URL + `/events/api/event/invited?id=${userId}`, {withCredentials: true})
            .then(res => {
                setInvitedEvents(res.data.eventPackages)
                console.log(res.data.eventPackages)
                setIsInvitedEventsLoaded(true)
            })
            .catch(error => console.error("Error getting all invited events:", error.message))
    }

    useEffect(() => {
        getAllCreatedEvents()
        getAllInvitedEvents()
    }, [])

    const handleClick = (id) => {
        if (eventType === 'created') {
            router.push(`/event/view/created?eventId=${id}&id=${userId}`)
        } else {
            router.push(`/event/view/invited?eventId=${id}&id=${userId}`)

        }
    }

    const events = eventType === 'created' ? createdEvents : invitedEvents;

    const rows = events?.map((eventStruct) => {
        return (
            <Table.Tr key={eventStruct.event._id}>
                <Table.Td>{eventStruct.event.name}</Table.Td>
                <Table.Td>{eventStruct.user.username}</Table.Td>
                <Table.Td>{eventStruct.location.name}</Table.Td>
                <Table.Td>{dayjs(eventStruct.event.date_time).format("MMM D, YYYY h:mm A").toString()}</Table.Td>
                <Table.Td>
                    <VisibilityBadge visibility={eventStruct.event.visibility} />
                </Table.Td>
                {eventType === 'invited' && (
                    <Table.Td>
                        <StatusBadge status={eventStruct.attendee.status} />
                    </Table.Td>
                )}
                <Table.Td>
                    <ActionIcon 
                        variant="transparent" 
                        color="black" 
                        onClick={() => handleClick(eventStruct.event._id)}
                    >
                        {eyeIcon}
                    </ActionIcon>
                </Table.Td>
            </Table.Tr>
    )});

    const loader = (
        <Table.Tr>
            <Table.Td colSpan={6}>
                <Center>
                    <Loader />
                </Center>
            </Table.Td>
        </Table.Tr>
    )

    return (
        <Table highlightOnHover withTableBorder>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Event Name</Table.Th>
                    <Table.Th>Creator</Table.Th>
                    <Table.Th>Location</Table.Th>
                    <Table.Th>Date/Time</Table.Th>
                    <Table.Th>Visibility</Table.Th>
                    {eventType === 'invited' && (
                        <Table.Th>Status</Table.Th>
                    )}
                    <Table.Th></Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {!areBothEventsLoaded && loader}
                {areBothEventsLoaded && rows}
            </Table.Tbody>
        </Table>
    )
}