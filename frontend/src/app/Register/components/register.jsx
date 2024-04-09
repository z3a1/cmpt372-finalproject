import {v4 as idGen} from "uuid"
import styles from "../registerStyle.module.css"
import axios from "axios"
import { TextInput, Box, PasswordInput, Title, Button } from '@mantine/core';
import { useForm, matches, isEmail } from "@mantine/form"
import { useRouter } from "next/navigation";

export default function Registercomp(){

    const router = useRouter()

    const registerForm = useForm({
        initialValues: {
            fname: '',
            lname: '',
            user_name: '',
            email: '',
            password: ''
        },
        validate: {
            fname: matches(/^[A-Za-z]+$/,"Invalid First Name!"),
            lname: matches(/^[A-Za-z]+$/,"Invalid Last Name!"),
            email: isEmail("Not a valid email!"),
            password: matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,"The password is invalid!")
        }
    })

    const getFormData = async (event) => {
        event.preventDefault()
        registerForm.validate()
        const newUserId = idGen()
        let {fname,lname,user_name,email,password} = registerForm.values;
        await axios.post(process.env.SERVER_URL + "/auth/register",{
        id: newUserId,
        fname: fname,
        lname: lname,
        user_name: user_name,
        email: email,
        password: password
       }, {withCredentials: true}).then(res => {
        console.log(res)
        router.push(`/Landing?id=${res.data.user_id}`)
       })
       .catch(err => {
            console.log(err)
            alert(err)
       })
    }

    return(
        <Box maw = {349} mx = "auto">
            <Title order = {2}>Register Today For Free!</Title>
            <form onSubmit={getFormData}>
                <TextInput label = "First Name" placeholder="John" required = {true}
                withAsterisk {...registerForm.getInputProps('fname')}/>
                <TextInput label = "Last Name" placeholder="Doe" required = {true}
                withAsterisk {...registerForm.getInputProps('lname')}/>
                <TextInput label = "Username" placeholder="John444123" required = {true}
                withAsterisk {...registerForm.getInputProps('user_name')}/>
                <TextInput label = "Email: " placeholder="example@gmail.com"
                required = {true} withAsterisk {...registerForm.getInputProps('email')}/>
                <PasswordInput label = "Password: " 
                required = {true}
                    {...registerForm.getInputProps('password', {type: 'password'})}/>
                <Button variant="gradient" gradient = {{from: 'cyan', to: 'green', deg: 0}} type="submit" mt={20}>Register!</Button>
            </form>
        </Box>
    )
}