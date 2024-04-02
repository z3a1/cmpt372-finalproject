import {Loader, MantineProvider, Group} from '@mantine/core'
import "./user.modules.css"


export default function verifyUser(){
    //This page either redirects the user to the landing page or back to the sign in and register page

    return(
        <MantineProvider>
            <Group justify='center' mx = "auto" maw = {500} className='loaderStyles'>
                <Loader color = "cyan" size = {500}/>
            </Group>
            <a href="/User/1">Debug</a>
        </MantineProvider>
    )
}