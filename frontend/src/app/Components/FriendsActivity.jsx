"use client";
import React from "react";
import { Center, Notification, HoverCard, Button } from "@mantine/core";
import { IconUserCircle } from "@tabler/icons-react";
import { useEffect, useState} from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
export default function FriendsActivity() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const [friendsActivity, setFriendsActivity] = useState([]);
  useEffect(() => {
    const getFriendActivity = async () => {
    await axios
        .get(process.env.SERVER_URL + `/events/api/event/friends/public?id=${userId}`)
        .then((res) => {
           console.log(res)

          setFriendsActivity(res.data.eventPackages);
        })
        .catch((error) => console.error(error));
    };
    getFriendActivity();
  }, [userId]);

  return (
    <div>
      {friendsActivity.map((event, index) => (
        <Notification key={index} title={event.user}  style={{
          width: "500px",
          margin: "2px",
          border: "1px solid var(--mantine-color-gray-4)",
        }}>
          {event.location}
        </Notification>
      ))}

    </div>
  );
}
