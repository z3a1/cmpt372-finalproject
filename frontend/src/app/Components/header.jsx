import { Title } from "@mantine/core";
import { IconMap } from "@tabler/icons-react";
import "./header.css";

export default function Header() {
  return (
    <Title className="title" variant="filled" bg="rgba(0, 150, 0, 0.7)">
      <IconMap className="icon-map" />
      Socializer
    </Title>
  );
}
