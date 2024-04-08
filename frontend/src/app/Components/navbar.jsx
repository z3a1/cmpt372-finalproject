import {IconUserCircle, 
    IconFriends, 
    IconMapPin, 
    IconBrandYoutube, 
    IconLogout,
    IconLogin} from "@tabler/icons-react"

import "./navbar.css"
import { Button } from "@mantine/core";
import userService from "../services/user"


export default function NavBar(params){

    const dataLinks = [
        { link: `/Profile?id=${params.id}`, label: "Profile", icon: IconUserCircle },
        { link: `/friends?id=${params.id}`, label: "Friends", icon: IconFriends },
        { link: `/events?id=${params.id}`, label: "Create Event", icon: IconMapPin },
        { link: `/videos?id=${params.id}`, label: "Event Suggestions", icon: IconBrandYoutube },
      ];

    const links = dataLinks.map((data, index) => (
        <a key={index} className="link" href={data.link}>
          <data.icon className="icon" />
          <span>{data.label}</span>
        </a>
      ));

    let debugNav = async () => {
        await userService.getcurrentSession(params.sessionId)
        .then(res => {
            console.log(res)
        })
    }

    return(
        <>
            <nav className="navbar">
                <div className="navbar-container">
                {links}
                <Button onClick={debugNav}>Session Debug</Button>
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