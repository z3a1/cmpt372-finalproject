"use client";

import { useState, useEffect } from 'react';
import io from 'socket.io-client';

// FOR TESTING
const USER_ID = '65fcabc9668f4f329e89992a';
const FRIEND_ID = '65fa73b955410eecb776f5b1';

const MessagePage = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const SERVER_URL = process.env.SERVER_URL || 'http://localhost:8080';
    const socket = io(SERVER_URL);

    useEffect(() => {
        // Fetch previous messages from the server
        fetch(`${SERVER_URL}/messages?userId=${USER_ID}&friendId=${FRIEND_ID}`)
            .then(response => response.json())
            .then(data => {
                setMessages(data.messages);
            })
            .catch(error => console.error('Error fetching messages:', error));

        // Listen for incoming messages
        socket.on('message', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            if (socket.connected) {
                socket.disconnect();
            }
        };
    }, []); 

    const sendMessage = () => {
        socket.emit('sendMessage', { message: inputMessage, recipientId: FRIEND_ID }); 
    };

    return (
        <div>
            <h1>Message Page</h1>
            <div>
                {messages.map((message, index) => (
                    <div key={index} className={message.senderId === USER_ID ? 'sent' : 'received'}>
                        <div>{message.message}</div>
                    </div>
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
