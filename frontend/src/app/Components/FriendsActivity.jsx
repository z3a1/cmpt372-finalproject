"use client";
import React from "react";
import { Group, Loader, Center, Notification, HoverCard, Button, Popover } from "@mantine/core";
import { IconUserCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
export default function FriendsActivity() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const [activityLoaded, setActivityLoaded] = useState(false);
  // const [eventDetails, setEventDetails] = useState(false);
  const [friendsActivity, setFriendsActivity] = useState([]);
  useEffect(() => {
    const getFriendActivity = async () => {
      await axios
        .get(
          process.env.SERVER_URL +
            `/events/api/event/friends/public?id=${userId}`
        )
        .then((res) => {
          console.log(res);
          setFriendsActivity(
            res.data.eventPackages.map((activity) => ({
              eventTitle: activity.event.name,
              userName: activity.user.username.toString(),
              location: activity.location.name.toString(),
              description: activity.event.description.toString()
            }))
          );
          setActivityLoaded(true);
        })
        .catch((error) => console.error(error));
    };
    getFriendActivity();
  }, [userId]);

  return (
    <div>
      {!activityLoaded && (
        <Center>
          <Loader style={{ padding: "40px" }} />
        </Center>
      )}
      {activityLoaded && (
        
        <div style = {{height:"100%", width:"100%",margin:"30px"}}>
          {friendsActivity.map((activity, index) => (
         
            <Notification
             icon={ <IconUserCircle/>}
              key={index}
              title={activity.userName}
              style={{
                maxWidth: "500px",
                margin: "20px",
                border: "1px solid var(--mantine-color-gray-4)",
              }}
            >
              {activity.eventTitle}
              {/* <Button
                onClick={() => setEventDetails(true)}
                style={{ marginTop: "10px" }}
              >
                Show Details
              </Button> */}
            </Notification>
          
           
          ))}
         
        </div>
        
      )}
    </div>
  );
}
