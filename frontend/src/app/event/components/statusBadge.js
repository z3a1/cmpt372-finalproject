import { Badge } from "@mantine/core"

const StatusBadge = ({ status }) => {
    let color = "gray"
    if (status === "confirmed") {
        color = "green"
    } else if (status === "rejected") {
        color = "red"
    }

    return (
        <Badge color={color} size="lg" radius="lg">{status}</Badge>
    )
}

export default StatusBadge