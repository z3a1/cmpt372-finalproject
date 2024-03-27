import styles from "../registerStyle.module.css"
import axios from "axios"
import {TextInput, Button, Box, PasswordInput } from '@mantine/core';
import { Title } from "@mantine/core";
import { useForm } from '@mantine/form';

export default function Logincomp(){

    const loginForm = useForm({
        initialValues: {
            email: '',
            password: '',
        }
    })

    const getFormData = async (event) => {
        event.preventDefault()
        const userInput = new FormData(event.currentTarget)
        const defaultRole = "Member"
        console.log(userInput)
        console.log(loginForm.values)
        console.log(userInput.get('email'))
        console.log(userInput.get('password'))
        // await axios.post(process.env.SERVER_URL + "/login",{
        //     email: userInput.get('email'),
        //     password: userInput.get('password')
        // }).then(res => {
        //     console.log(res)
        //    })
      }

    return(
        <section className={styles.componentContainer}>
            <Title order={2}>Sign In:</Title>
            <Box maw={349} mx = "auto">
                <form onSubmit={getFormData}>
                    <TextInput label = "Email: " placeholder="example@gmail.com" required = {true} {...loginForm.getInputProps('email')}/>
                    <PasswordInput label = "Password: " required = {true} {...loginForm.getInputProps('password', {type: 'password'})}/>
                    <Button variant="filled" color="green" type="submit">Login</Button>
                </form>
            </Box>
        </section>
    )
}