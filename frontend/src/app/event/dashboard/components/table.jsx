import { useRouter, useSearchParams } from "next/navigation";
import { ActionIcon, Table } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { eyeIcon } from "../../lib/icon";
import dayjs from 'dayjs';
import VisibilityBadge from "../../components/visibilityBadge"; 

export default function EventTable({ eventType }) {
    const router = useRouter()
    const searchParams = useSearchParams();
    const userId = searchParams.get('id')

    const [createdEvents, setCreatedEvents] = useState([])
    const [invitedEvents, setInvitedEvents] = useState([])

    const getAllCreatedEvents = async () => {
        await axios.get(process.env.SERVER_URL + `/events/api/event/created?id=${userId}`)
            .then(res => {
                setCreatedEvents(res.data.events)
            })
            .catch(error => console.error("Error getting all created events:", error.message))
    }

    const getAllInvitedEvents = async () => {
        await axios.get(process.env.SERVER_URL + `/events/api/event/invited?id=${userId}`)
            .then(res => {
                setInvitedEvents(res.data.events)
            })
            .catch(error => console.error("Error getting all invited events:", error.message))
    }

    useEffect(() => {
        getAllCreatedEvents()
        getAllInvitedEvents()
    }, [])

    const handleClick = (id) => {
        router.push(`/event/view?eventId=${id}&id=${userId}`)
    }

    const events = eventType === 'created' ? createdEvents : invitedEvents;
    const rows = events?.map((event) => {
        return (
            <Table.Tr key={event._id}>
                <Table.Td>{event.name}</Table.Td>
                <Table.Td>{event.creator_id}</Table.Td>
                <Table.Td>{event.location_id}</Table.Td>
                <Table.Td>{dayjs(event.date_time).format("MMM D, YYYY h:mm A").toString()}</Table.Td>
                <Table.Td>
                    <VisibilityBadge visibility={event.visibility} />
                </Table.Td>
                <Table.Td>
                    <ActionIcon 
                        variant="transparent" 
                        color="black" 
                        onClick={() => handleClick(event._id)}
                    >
                        {eyeIcon}
                    </ActionIcon>
                </Table.Td>
            </Table.Tr>
    )});

    return (
        <Table highlightOnHover withTableBorder>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Event Name</Table.Th>
                    <Table.Th>Creator</Table.Th>
                    <Table.Th>Location</Table.Th>
                    <Table.Th>Date/Time</Table.Th>
                    <Table.Th>Visibility</Table.Th>
                    <Table.Th></Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {rows}
            </Table.Tbody>
        </Table>
    )
}