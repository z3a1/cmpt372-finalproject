import {FormEvent} from "react"
import {v4 as idGen} from "uuid"
import styles from "../registerStyle.module.css"

export default function Registercomp(){

    const getFormData = (event) => {
        event.preventDefault()
        const userInput = new FormData(event.currentTarget)
        const newUserId = idGen()
        // console.log(newUserId)
        // console.log(userInput.get('fname'))
        // console.log(userInput.get('password'))
        /*
            TODO:
            - Implement checking if user already exists
            - Check if the user name exists already
            - Will be handeled by the Express server
        */
      }

    return(
        <section className={styles.componentContainer}>
            <h2>Sign Up!</h2>
            <form onSubmit={getFormData} className={styles.formComponent}>
                <label>First Name: </label>
                <input type = "text" name = "fname" required/>
                <label>Last Name: </label>
                <input type = "text" name = "lname" required/>
                <label>User Name: </label>
                <input type = "text" name = "userName" required/>
                <label>Email: </label>
                <input type = "email" name = "email" required/>
                <label>Password: </label>
                <input type = "password" name = "password" required/>
                <button>Register</button>
            </form>
        </section>
    )
}