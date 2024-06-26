import {IconUserCircle, 
    IconFriends, 
    IconMapPin, 
    IconBrandYoutube, 
    IconLogout,
    IconLogin,
    IconCalendarEvent,
    IconSettings
} from "@tabler/icons-react"
import "./navbar.css"

export default function NavBar(params){

    const dataLinks = [
        { link: `/profile`, label: "Profile", icon: IconUserCircle },
        { link: `/friends`, label: "Friends", icon: IconFriends },
        { link: `/event/map`, label: "Create Event", icon: IconMapPin },
        { link: `/event/dashboard`, label: "Event Dashboard", icon: IconCalendarEvent },
        { link: `/videos`, label: "Event Suggestions", icon: IconBrandYoutube },
        { link: `/settings`, label: "Settings", icon: IconSettings}
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
                <a href="/register" id="logout" className="link">
                    <IconLogout className="icon" />
                    <span>Logout</span>
                </a>
                <a href="/register" id="login" className="link">
                    <IconLogin className="icon" />
                    <span>Login</span>
                </a>
                </div>
            </nav>
        </>
    )
}