"use client";

import { useState, useEffect } from 'react';
import io from 'socket.io-client';

import { useSearchParams } from "next/navigation"
import styles from './messages.css'

// FOR TESTING
const USER_ID = '65fcabc9668f4f329e89992a';
const FRIEND_ID = '65fa73b955410eecb776f5b1';

// const FRIEND_ID = '65fcabc9668f4f329e89992a';
// const USER_ID = '65fa73b955410eecb776f5b1';


const MessagePage = () => {
    const searchParams = useSearchParams()
    const userId = searchParams.get('userId')
    const friendId = searchParams.get('friendId')
    // console.log("FRIEND_ID", FRIEND_ID);
    // console.log('type', typeof(FRIEND_ID));
    console.log('user',userId);
    console.log('friends',friendId);
    // console.log( typeof(friendId));


    const [messages, setMessages] = useState([]);
    const [messagesLength, setMessagesLength] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const SERVER_URL = process.env.SERVER_URL || 'http://localhost:8080';


    useEffect(() => {

        const socket = io(SERVER_URL, {
            query: {
                userId: userId,
                recipientId: friendId
            }
        });
    
        socket.on('connect', () => {
            fetch(`${SERVER_URL}/messages/friendInfo?friendId=${friendId}`)
                .then (response => response.json())
                .then (data => {
                    console.log(data.friend)
                })

            fetch(`${SERVER_URL}/messages/messages?userId=${userId}&friendId=${friendId}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data.m);
                    setMessages(data.m);
                    if (data.m === null || data.m === undefined){
                        setMessages([]);
                        setMessagesLength(0);
                    } else{
                        setMessagesLength (data.m.length);
                    }
                })
                .catch(error => console.error('Error fetching messages:', error));
        });
    
        socket.on('message', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });
    
        return () => {
            socket.disconnect();
        };
    }, [friendId]);

    const sendMessage = () => {
        if (inputMessage.trim() === '') {
            return;
        } else{
            setMessages(prevMessages => [...prevMessages, { senderId: userId, message: inputMessage }]); 
            socket.emit('sendMessage', { message: inputMessage, recipientId: friendId });
            setInputMessage(''); 
        }
    };

    return (
        <div className="message-container">
            <h1>Message Page</h1>
            <div>
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.senderId === userId ? 'sent' : 'received'}`} >
                        {message.senderId === userId ? (
                            <div>
                                <strong>You:</strong> {message.message}
                            </div>
                        ) : (
                            <div>
                                <strong>Friend:</strong> {message.message}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <input 
                type="text" 
                value={inputMessage} 
                onChange={(e) => setInputMessage(e.target.value)} 
                className="input-message"
            />
            <button onClick={sendMessage} className="send-button">Send</button>
        </div>
    );
};

export default MessagePage;
