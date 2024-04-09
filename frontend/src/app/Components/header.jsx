"use client"
import { Title } from "@mantine/core";
import "./header.css";
import Logo from "./logofiller";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter()
  return (
    <Title className="title" variant="filled" bg="rgba(0, 150, 0, 0.7)" onClick={() =>router.push("/")}>
      <Logo/>
    </Title>
  );
}
