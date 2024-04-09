"use client"
import { Container, Grid, Button, TextInput, Text, Modal, PasswordInput  } from "@mantine/core";
import NavBar from "../Components/navbar";
import { useDisclosure } from '@mantine/hooks';
import { useForm } from "@mantine/form";
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
            console.log("Getting current user")
            let res = await userService.getcurrentSession(session_id)
            if(!res){
                alert("Could not fetch the given user!")
                router.push("/")
            }
            else{
                setUser(res.data)
            }
        }
        getCurrentUser()
    },[])

    let changeUsername = () => {
        setChoice('username')
        toggle()
    }

    let changeEmail = () => {
        setChoice('email')
        toggle()
    }

    let updateUserInfo = async (event) => {
        event.preventDefault()
        if(changeForm.validate()){
            let {inputData, password} = changeForm.values
            axios.defaults.withCredentials = true
            await axios.post(process.env.SERVER_URL + "/auth/changeInfo", {
                status: settingsChoice,
                id: currentUser._id,
                password: password,
                inputData: inputData
            }, {withCredentials: true})
            .then(res => {
                alert("Sucessfully changed!")
                //Response should override the new user item now
                setUser(res.data)
                toggle()
            })
            .catch(err => {
                console.log("Error")
                alert(err)
            })
        }
        else{
            alert("Error!")
        }
    }

    return(
    <Container fluid>
        <NavBar/>
            <Grid justify = "center" align = "flex-start" mt = {100}>
                <Grid.Col span = {1}>
                    <Text size = "xl">Username: </Text>
                    <Text size = "xl" mt = {10}>Email: </Text>
                </Grid.Col>
                <Grid.Col span = {2.5}>
                    <Text>{currentUser.username}</Text>
                    <Text mt = {20}>{currentUser.email}</Text>
                </Grid.Col>
                <Grid.Col span = {1}>
                    <Button onClick={changeUsername}>Change username</Button>
                    <Button onClick={changeEmail} mt = {20}>Change email</Button>
                </Grid.Col>
            </Grid>
            <Modal opened = {opened} onClose = {close} title = {`Changing: ${settingsChoice}`} centered>
                <form onSubmit={updateUserInfo}>
                    <PasswordInput mt = "sm" label = "Enter the password" {...changeForm.getInputProps('password')}/>
                    <TextInput mt = "sm" label = {`Enter the new ${settingsChoice}: `} {...changeForm.getInputProps('inputData')}/>
                    <Button type = "submit">Submit Changes!</Button>
                </form>
            </Modal>
    </Container>)
}