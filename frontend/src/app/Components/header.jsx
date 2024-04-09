import { Title } from "@mantine/core";
import { IconMap } from "@tabler/icons-react";
import "./header.css";

export default function Header() {
  return (
    <Title className="title" size = "h3" variant="filled" bg="var(--mantine-color-blue-7)">
      <IconMap className="icon-map" />
      Socializer
    </Title>
  );
}
