import { Badge } from "@mantine/core"

const VisibilityBadge = ({ visibility }) => {
    let color = "violet"
    if (visibility === "public") {
        color = "blue"
    }

    return (
        <Badge color={color} size="lg" radius="lg">{visibility}</Badge>
    )
}

export default VisibilityBadge