"use client";

import { useState, useEffect } from 'react';
import io from 'socket.io-client';

// FOR TESTING
// const USER_ID = '65fcabc9668f4f329e89992a';
// const FRIEND_ID = '65fa73b955410eecb776f5b1';

const FRIEND_ID = '65fcabc9668f4f329e89992a';
const USER_ID = '65fa73b955410eecb776f5b1';


const MessagePage = () => {
    const [messages, setMessages] = useState([]);
    const [messagesLength, setMessagesLength] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const SERVER_URL = process.env.SERVER_URL || 'http://localhost:8080';
    const socket = io(SERVER_URL);

    useEffect(() => {
        const socket = io(SERVER_URL);
    
        socket.on('connect', () => {
            fetch(`${SERVER_URL}/messages/friendInfo?friendId=${FRIEND_ID}`)
                .then (response => response.json())
                .then (data => {
                    console.log(data.friend)
                })

            fetch(`${SERVER_URL}/messages/messages?userId=${USER_ID}&friendId=${FRIEND_ID}`)
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
    }, []);

    const sendMessage = () => {
        if (inputMessage.trim() === '') {
            return;
        } else{
            setMessages(prevMessages => [...prevMessages, { senderId: USER_ID, message: inputMessage }]); 
            socket.emit('sendMessage', { message: inputMessage, recipientId: FRIEND_ID });
            setInputMessage(''); 
        }
    };

    return (
        <div>
            <h1>Message Page</h1>
            <div>
            {/* { messagesLength > 0 ? (
                    messages.map((message, index) => (
                        <div key={index} className={message.senderId === USER_ID ? 'sent' : 'received'}>
                            <div>{message.message}</div>
                        </div>
                    ))
                ) : null } */}
                {messages.map((message, index) => (
                    <div key={index} >
                        {message.senderId === USER_ID ? (
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
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default MessagePage;
