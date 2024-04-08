const express = require('express');
const router = express.Router();
const { storeUserSocket, getUserSocket, removeUserSocket } = require('./userSocket');

router.post('/sendMessage', (req, res) => {
    // SENDING MESSAGES 
    const { userId, recipientId, message } = req.body;

    // to be able to send messages 

    res.status(200).json({ success: true });
});

router.get('/messages', (req, res) => {
    // getting messages 
    const { userId, friendId } = req.query;

    //to be able to get all the messages

    res.status(200).json({ messages: [] }); 
});

module.exports = router;
