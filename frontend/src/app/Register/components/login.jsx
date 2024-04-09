import styles from "../registerStyle.module.css"
import axios from "axios"
import {TextInput, Button, Box, PasswordInput } from '@mantine/core';
import { Title } from "@mantine/core";
import { useForm, isEmail, matches } from '@mantine/form';
import { useRouter } from "next/navigation";

export default function Logincomp(){

    const router = useRouter()

    const loginForm = useForm({
        initialValues: {
            email: '',
            password: '',
        },
        validate: {
            email: isEmail("Not a valid email!"),
        }
    })

    const getFormData = async (event) => {
        event.preventDefault()
        loginForm.validate()
        let {email, password} = loginForm.values
        await axios.post(process.env.SERVER_URL + "/auth/login",
            { email: email, password: password },
            { withCredentials: true }
        ).then(res => {
            console.log("Session id:", res)
            router.push(`/Landing`)
        })
        .catch(err => {
            console.log(err)
            //alert(err.response.data.message)
            if(err.response.message){
                alert(err.response.message)
            }
            else{
                alert(err.response)
            }
        })
      }

    return(
        <Box maw={349} mx = "auto">
            <Title order={2}>Sign In:</Title>
            <Box maw={349} mx = "auto">
                <form onSubmit={getFormData}>
                    <TextInput label = "Email: " 
                    placeholder="example@gmail.com" 
                    required = {true} withAsterisk {...loginForm.getInputProps('email')}/>
                    <PasswordInput label = "Password: " 
                    required = {true}
                     {...loginForm.getInputProps('password', {type: 'password'})}/>
                    <Button variant="filled" color="green" type="submit" mt={20}>Login</Button>
                </form>
            </Box>
        </Box>
    )
}