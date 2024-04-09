import { useDisclosure } from "@mantine/hooks"
import { Button, Modal, ScrollAreaAutosize, Table } from "@mantine/core"
import StatusBadge from "../../components/statusBadge";

export default function AttendeeList({ attendees }) {
    const [opened, { open, close }] = useDisclosure(false);

    const rows = attendees.map((person, index) => {
        return (
            <Table.Tr key={index}>
                <Table.Td>
                    @{person.user.username}
                </Table.Td>
                <Table.Td style={{ textAlign: "right" }}>
                    <StatusBadge status={person.attendee.status} />
                </Table.Td>
            </Table.Tr>
        );
    });

    return (
        <>
            <Button onClick={open} color="green">Attendees</Button>
            <Modal 
                opened={opened} 
                onClose={close} 
                title="Attendees" 
                centered 
                size="md"
                scrollAreaComponent={ScrollAreaAutosize}
            >
                <Table highlightOnHover>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </Modal>
        </>
    )
}