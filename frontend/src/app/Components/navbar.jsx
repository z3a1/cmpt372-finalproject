"use client"
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
import axios from "axios"
import { useRouter } from "next/navigation";

export default function NavBar(params){

    const router = useRouter()

    const dataLinks = [
        { link: `/profile`, label: "Profile", icon: IconUserCircle },
        { link: `/friends`, label: "Friends", icon: IconFriends },
        { link: `/event/map`, label: "Create Event", icon: IconMapPin },
        { link: `/event/dashboard`, label: "Event Dashboard", icon: IconCalendarEvent },
        { link: `/videos`, label: "Event Suggestions", icon: IconBrandYoutube },
        { link: `/settings`, label: "Settings", icon: IconSettings}
    ];

    const logout = async () => {
        await axios.get(process.env.SERVER_URL + "/auth/logout").then(res => {
            if(res.status == 200){
                router.push("/")
            }
            else{
                alert(res.data)
            }
        })
    }

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
                <a id="logout" className="link" onClick={logout}>
                    <IconLogout className="icon"/>
                    <span>Logout</span>
                </a>
                </div>
            </nav>
        </>
    )
}