import styles from "../registerStyle.module.css"
import axios from "axios"
import {TextInput, Button, Box, PasswordInput } from '@mantine/core';
import { Title } from "@mantine/core";
import { useForm, isEmail, matches } from '@mantine/form';

export default function Logincomp(){

    const loginForm = useForm({
        initialValues: {
            email: '',
            password: '',
        },
        validate: {
            email: isEmail("Not a valid email!"),
            password: matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,"The password is invalid!")
        }
    })

    const getFormData = async (event) => {
        event.preventDefault()
        loginForm.validate()
        const defaultRole = "Member"
        let {email, password} = loginForm.values
        console.log(loginForm.values)
        // await axios.post(process.env.SERVER_URL + "/login",{
        //     email: userInput.get('email'),
        //     password: userInput.get('password')
        // }).then(res => {
        //     console.log(res)
        //    })
      }

    return(
        <Box maw={450} mx = "auto">
            <Title order={2}>Sign In:</Title>
            <Box maw={349} mx = "auto">
                <form onSubmit={getFormData}>
                    <TextInput label = "Email: " 
                    placeholder="example@gmail.com" 
                    required = {true} withAsterisk {...loginForm.getInputProps('email')}/>
                    <PasswordInput label = "Password: " 
                    required = {true}
                     {...loginForm.getInputProps('password', {type: 'password'})}/>
                    <Button variant="filled" color="green" type="submit">Login</Button>
                </form>
            </Box>
        </Box>
    )
}