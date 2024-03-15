import {FormEvent} from "react"
import styles from "../../page.module.css"

export default function Logincomp(){

    const getFormData = (event) => {
        event.preventDefault()
        const userInput = new FormData(event.currentTarget)
        console.log(userInput.get('email'))
        console.log(userInput.get('password'))
      }

    return(
        <section className={styles.componentContainer}>
            <h2>Login To Existing Account</h2>
            <form onSubmit={getFormData} className={styles.formComponent}>
                <label>Email:</label>
                <input type = "text" name = "email" required/>
                <label>Password:</label>
                <input type = "password" name = "password" required/>
                <button>Login</button>
            </form>
        </section>
    )
}