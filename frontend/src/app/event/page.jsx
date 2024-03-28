'use client'

import { useState } from 'react';
import { useSearchParams } from 'next/navigation'
import eventStyle from './event.module.css'
import Link from 'next/link'
import axios from 'axios';

export default function CreateEvent() {
    const searchParams = useSearchParams()
    const placeName = searchParams.get('placeName')
    const address = searchParams.get('address')
    // TODO: get user search param

    const [formData, setFormData] = useState({
        eventName: "",
        placeName: placeName,
        address: address,
        date: "",
        time: "",
        friends: [],
        visibility: "private"
    })

    const [formSuccess, setFormSuccess] = useState(false)
    const [formSuccessMessage, setFormSuccessMessage] = useState("")

    const handleInput = (e) => {
        const fieldName = e.target.name;
        const fieldValue = e.target.value;

        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: fieldValue
        }));
    }

    const submitForm = async (e) => {
        // We don't want the page to refresh
        e.preventDefault();

        await axios.post(process.env.SERVER_URL + "/events/api/event/create", formData) 
            .then(res => {
                // Reset form
                setFormData({
                    eventName: "",
                    placeName: placeName,
                    address: address,
                    dateTime: "",
                    friends: [],
                    visibility: "private"
                });

                setFormSuccess(true);
                setFormSuccessMessage(res.data.submissionText);
            })
    }

    return (
        <>
            <div>
                <h1>Create Event</h1>
                {formSuccess ? 
                    <div>{formSuccessMessage}</div>
                    :
                    <form method="POST" onSubmit={submitForm}>  
                        <div>
                            <label>Event Name<br /></label>
                            <input type="text" name="eventName" onChange={handleInput} value={formData.eventName} />
                        </div>
                        <div>
                            {/* TODO: When place name is template, allow user to enter place name or use another default */}
                            <h3>📍 {placeName}</h3>
                            <p>{address}</p>
                        </div>
                        {/* TODO: maybe add google maps embed of place? */}
                        <div>
                            <h3>📅 Date / Time</h3>
                            <p>Insert date picker / calendar UI</p>
                            <input type="date" name="dateTime" onChange={handleInput} value={formData.dateTime} />
                        </div>
                        <div>
                            {/* Use a data table */}
                            {/* Added friends will be notified via email? */}
                            <h3>🤝 Add friends</h3>
                            <button className={eventStyle.button} type="button">Mike</button>
                            <button className={eventStyle.button} type="button">Jerry</button>
                            <button className={eventStyle.button} type="button">Wong</button>
                            <button className={eventStyle.button} type="button">Smith</button>
                        </div>
                        <div>
                            <h3>👀 Visibility</h3>
                            {/* TODO: Use a <switch></switch> */}
                            <button className={eventStyle.button} type="button">Private</button>
                            <button className={eventStyle.button} type="button">Public</button>
                        </div>
                        <div>
                            <h3>Description</h3>
                            <textarea></textarea>
                        </div>
                        <div>
                            {/* TODO: append previous place info back to maps? */}
                            <br />
                            <br />
                            <br />
                            <Link href='/maps'>
                                <button className={eventStyle.button} type="button">Back</button>
                            </Link>
                            <button className={eventStyle.button} type="submit">Create</button>
                        </div>
                    </form>
                }
            </div>
        </>
    )
}
