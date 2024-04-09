import { Box, Grid, Group } from "@mantine/core";
import NavBar from "../Components/navbar";
import { useDisclosure } from '@mantine/hooks';
import { useForm } from "@mantine/form";
import { Dialog, Group, Button, TextInput, Text } from '@mantine/core';
import { useRouter, useSearchParams } from "next/navigation";
import {useState, useEffect} from "react"
import userService from "../services/user"
import axios from "axios";


export default function SettingsPage(){

    const [opened, { toggle, close }] = useDisclosure(false);
    let [currentUser,setUser] = useState({})
    const router = useRouter()
    let searchParams = useSearchParams()
    let session_id = searchParams.get("id")
    let [settingsChoice, setChoice] = useState('')

    const changeForm = useForm({
        initialValues: {inputData: '', password: ''}
    })

    useEffect(() => {
        let getCurrentUser = async () => {
            let res = await userService.getcurrentSession(session_id)
            if(!res){
                alert("Could not fetch the given user!")
                router.push("/")
            }
            else{
                setUser(res)
            }
        }
        getCurrentUser()
    },[])

    let changeUsername = () => {
        setChoice('username')
        toggle
    }

    let changeEmail = () => {
        setChoice('email')
        toggle
    }

    let updateUserInfo = async () => {
        if(changeForm.validate()){
            let {inputData, password} = changeForm.values
            await axios.post(process.env.SERVER_URL + "/auth/changeInfo", {
                status: settingsChoice,
                id: user._id,
                password: password,
                inputData: inputData
            })
            .then(res => {
                alert("Sucessfully changed!")
                console.log(res)
                //Response should override the new user item now
                setUser(res)
            })
            .catch(err => {
                alert(err)
            })
        }
    }

    return(
    <Box>
        <NavBar/>
        <Group>
            <Grid>
                <Grid.Col span = {4}>
                    <Text size = "xl">Username: </Text>
                    <Text size = "xl">Email: </Text>
                </Grid.Col>
                <Grid.Col span = {4}>
                    <Text>{currentUser.username}</Text>
                    <Text>{currentUser.email}</Text>
                </Grid.Col>
                <Grid.Col>
                    <Button onClick={changeUsername}>Change username</Button>
                    <Button onClick={changeEmail}>Change email</Button>
                </Grid.Col>
            </Grid>
            <Dialog opened = {opened} withCloseButton onClose = {close} size = "lg" radius = "md">
                <form onClick={updateUserInfo}>
                    <TextInput mt = "sm" label = "Enter the password" {...form.getInputProps('email')}/>
                    <TextInput mt = "sm" label = "Enter the new info: " {...form.getInputProps('inputData')}/>
                    <Button type = "submit">Submit Changes!</Button>
                </form>
            </Dialog>
        </Group>
    </Box>)
}