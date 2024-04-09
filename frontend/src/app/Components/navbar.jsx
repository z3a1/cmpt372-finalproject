import {IconUserCircle, 
    IconFriends, 
    IconMapPin, 
    IconBrandYoutube, 
    IconLogout,
    IconLogin,
    IconCalendarEvent
} from "@tabler/icons-react"

import "./navbar.css"
import { Button } from "@mantine/core";
import userService from "../services/user"


export default function NavBar(params){

    const dataLinks = [
        { link: `/Profile`, label: "Profile", icon: IconUserCircle },
        { link: `/friends`, label: "Friends", icon: IconFriends },
        { link: `/event/map`, label: "Create Event", icon: IconMapPin },
        { link: `/event/dashboard`, label: "Event Dashboard", icon: IconCalendarEvent },
        { link: `/videos`, label: "Event Suggestions", icon: IconBrandYoutube },
      ];

    const links = dataLinks.map((data, index) => (
        <a key={index} className="link" href={data.link}>
          <data.icon className="icon" />
          <span>{data.label}</span>
        </a>
      ));

    return(
        <>
            <nav className="navbar">
                <div className="navbar-container">
                {links}
                <a href="/Register" id="logout" className="link">
                    <IconLogout className="icon" />
                    <span>Logout</span>
                </a>
                <a href="/Register" id="login" className="link">
                    <IconLogin className="icon" />
                    <span>Login</span>
                </a>
                </div>
            </nav>
        </>
    )
}