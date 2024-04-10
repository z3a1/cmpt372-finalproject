"use client"
import { Title } from "@mantine/core";
import "./header.css";
import Logo from "./logofiller";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter()
  return (
    <Title className="title" variant="filled" bg="var(--mantine-color-blue-7)" onClick={() =>router.push("/landing")}>
      <Logo/>
    </Title>
  );
}
