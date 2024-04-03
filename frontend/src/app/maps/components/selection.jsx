import { useRouter } from 'next/navigation'
import selectionStyle from './selection.module.css'
import { useDisclosure } from '@mantine/hooks';
import VideosPage from '@/app/videos/page';
import { Button, Container, Drawer, Stack, Text, Title } from '@mantine/core';

export default function Selection({ selectedPlaceName, selectedAddress }) {
    const router = useRouter();
    const [opened, { open, close }] = useDisclosure(false);

    // Send place info to event page
    const handleSubmit = async () => {
        if (!selectedPlaceName) {
            alert('⚠️ Please select a place on the map')
        } else {
            router.push(`/event/create?placeName=${selectedPlaceName}&address=${selectedAddress}`)
        }
    }

    return (
        <div className={selectionStyle.container}>
            <Container mt={300}>
                <Title order={3}>📍 Selected Location:</Title>
                {selectedPlaceName ? (
                    <Text>{selectedPlaceName}</Text>
                ) : (
                    <Text>...</Text>
                )}
            </Container>
            <Stack align="center" gap="sm" mt="xl">
                <Button onClick={open}>Recommendations</Button>
                {selectedPlaceName ? (
                    <Button onClick={handleSubmit}color="green">Proceed</Button>
                ) : (
                    <Button onClick={handleSubmit} disabled>Proceed</Button>
                )}
            </Stack>
            <Drawer position="bottom" size="md" opened={opened} onClose={close} title="🏙️ City Recommendations">
                <VideosPage />
            </Drawer>
        </div>
    )
}