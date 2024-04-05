import { useDisclosure } from "@mantine/hooks"
import { Button, Modal, ScrollAreaAutosize, Table } from "@mantine/core"

export default function FriendList({ friends }) {
    const [opened, { open, close }] = useDisclosure(false);

    const rows = friends?.map((friend, index) => (
        <Table.Tr key={index}>
            <Table.Td>{friend.friend_id}</Table.Td>
            {/* TODO: Add/remove button? */}
        </Table.Tr>
    ));

    return (
        <>
            <Button onClick={open} color="green">Friends</Button>
            <Modal 
                opened={opened} 
                onClose={close} 
                title="Friends" 
                centered 
                size="md"
                scrollAreaComponent={ScrollAreaAutosize}
            >
                <Table highlightOnHover >
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </Modal>
        </>
    )
}