import {IconUserCircle, 
    IconFriends, 
    IconMapPin, 
    IconBrandYoutube, 
    IconLogout,
    IconLogin} from "@tabler/icons-react"


export default function NavBar(params){

    const dataLinks = [
        { link: `/Profile?id=${params.id}`, label: "Profile", icon: IconUserCircle },
        { link: "/friends", label: "Friends", icon: IconFriends },
        { link: "/events", label: "Create Event", icon: IconMapPin },
        { link: "/videos", label: "Event Suggestions", icon: IconBrandYoutube },
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