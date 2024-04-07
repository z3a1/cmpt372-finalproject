"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io(process.env.SERVER_URL+'/messages');

export default function MessagingPage() {
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);

  useEffect(() => {

    //TODO: should send in friend id and user id into the page when opening 

    // needs to  messages between the user and friend from the backend
    axios.get(process.env.SERVER_URL+`/messages?userId=${userId}&friendId=${friendId}`)
      .then(response => {
        setReceivedMessages(response.data);
      })
      .catch(error => {
        console.error('Error fetching messages:', error);
      });

    socket.on('message', (data) => {
      setReceivedMessages(prevMessages => [...prevMessages, data]);
    });

    return () => {
        socket.disconnect();
      };
    }, [userId, friendId]);

    const sendMessage = () => {
        socket.emit('sendMessage', { recipientId: friendId, message });
        setMessage('');
    };
    
    return (
        <p>hi this is the messages page!</p>
    );
}
