import {FormEvent} from "react"
import styles from "../../page.module.css"

export default function Registercomp(){

    const getFormData = (event) => {
        event.preventDefault()
        const userInput = new FormData(event.currentTarget)
        console.log(userInput.get('fname'))
        console.log(userInput.get('password'))
      }

    return(
        <section className={styles.componentContainer}>
            <h2>Sign Up!</h2>
            <form onSubmit={getFormData} className={styles.formComponent}>
                <label>First Name: </label>
                <input type = "text" name = "fname" required/>
                <label>Last Name: </label>
                <input type = "text" name = "lname"/>
                <label>User Name: </label>
                <input type = "text" name = "userName" required/>
                <label>Email: </label>
                <input type = "text" name = "email" required/>
                <label>Password: </label>
                <input type = "password" name = "password" required/>
                <button>Register</button>
            </form>
        </section>
    )
}