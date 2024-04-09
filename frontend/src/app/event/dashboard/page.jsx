'use client'

import { Button, Container, Group, Title } from "@mantine/core"
import EventTable from "./components/table"
import { useState } from "react"

export default function Dashboard() {
    const [eventType, setEventType] = useState('created')

    const handleEventTypeChange = (type) => {
        setEventType(type)
    }

    return (
        <Container mt={60}>
            <Group justify="space-between">
                <Title order={1} mb="xs">Events</Title>
                <Group justify="flex-end" mb="lg" gap="xs">
                    <Button onClick={() => handleEventTypeChange('created')} color="green">Created</Button>
                    <Button onClick={() => handleEventTypeChange('invited')} color="green">Invited</Button>
                </Group>
            </Group>
            <EventTable eventType={eventType} />
        </Container>
    )
}