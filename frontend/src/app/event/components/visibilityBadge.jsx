import { Badge } from "@mantine/core"

const VisibilityBadge = ({ visibility }) => {
    let color = "indigo"
    if (visibility === "public") {
        color = "green"
    }

    return (
        <Badge color={color} size="lg" radius="lg">{visibility}</Badge>
    )
}

export default VisibilityBadge