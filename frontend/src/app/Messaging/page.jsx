"use client";

import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const MessagePage = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const SERVER_URL = process.env.SERVER_URL || 'http://localhost:8080'; // just for now until it works 
    const socket = io(SERVER_URL);

    useEffect(() => {
        // Listen for incoming messages
        socket.on('message', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        // Clean up event listener when component unmounts
        return () => {
            socket.off('message');
        };
    }, [socket]);

    const sendMessage = () => {
        // Emit message to the server
        socket.emit('sendMessage', { message: inputMessage, recipientId: 'RECIPIENT_USER_ID' }); // replace with the friend's id 
        setInputMessage('');
    };

    return (
        <div>
            <h1>Message Page</h1>
            <div>
                {messages.map((message, index) => (
                    <div key={index}>{message}</div>
                ))}
            </div>
            <input 
                type="text" 
                value={inputMessage} 
                onChange={(e) => setInputMessage(e.target.value)} 
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default MessagePage;
