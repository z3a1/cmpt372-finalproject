import {IconUserCircle, 
    IconFriends, 
    IconMapPin, 
    IconBrandYoutube, 
    IconLogout,
    IconLogin,
    IconCalendarEvent
} from "@tabler/icons-react"

import "./navbar.css"


export default function NavBar(params){

    const dataLinks = [
        { link: `/Profile?id=${params.id}`, label: "Profile", icon: IconUserCircle },
        { link: `/friends?id=${params.id}`, label: "Friends", icon: IconFriends },
        { link: `/event/map?id=${params.id}`, label: "Create Event", icon: IconMapPin },
        { link: `/event/dashboard?id=${params.id}`, label: "Event Dashboard", icon: IconCalendarEvent },
        { link: `/videos?id=${params.id}`, label: "Event Suggestions", icon: IconBrandYoutube },
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