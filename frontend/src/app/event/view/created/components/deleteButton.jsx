import { useDisclosure } from "@mantine/hooks"
import { Button, Modal, Group, Text } from "@mantine/core"
import axios from "axios";
import { useRouter } from "next/navigation";

export default function DeleteButton({ eventId }) {
    const router = useRouter()

    const [opened, { open, close }] = useDisclosure(false);

    const handleDelete = async () => {
        console.log(eventId)
        await axios.delete(process.env.SERVER_URL + `/events/api/event/delete?id=${eventId}`)
            .then(res => {
                console.log("Event has been deleted:", res.data.event)
            })
            .catch(error => console.error("Error deleting event:", error.message));
        router.push(`/event/dashboard`)
    }

    return (
        <>
            <Button variant='default' onClick={open}>Delete</Button>
            <Modal 
                opened={opened} 
                onClose={close} 
                title="Delete Event?" 
                centered 
                size="md"
            >
                <Text size="sm" mb="lg">You will permanently delete this event.</Text>
                <Group justify="space-between">
                    <Button variant="default" onClick={close}>Cancel</Button>
                    <Button color="red" onClick={handleDelete}>Yes, Delete Event</Button>
                </Group>
            </Modal>
        </>
    )
}