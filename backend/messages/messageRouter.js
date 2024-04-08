const express = require('express');
const router = express.Router();
const Message = require('../Database/schema');
const { storeUserSocket, getUserSocket, removeUserSocket } = require('./userSocket');

router.post('/sendMessage', async (req, res) => {
    try {
        const { userId, recipientId, message } = req.body;

        const newMessage = new Message({
            senderId: userId,
            recipientId,
            message
        });

        await newMessage.save();

        // if they are online
        const recipientSocketId = await getUserSocket(recipientId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('message', {
                senderId: userId,
                message
            });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, error: 'Failed to send message' });
    }
});

router.get('/messages', async (req, res) => {
    try {
        const { userId, friendId } = req.query;

        const messages = await Message.find({
            $or: [
                { senderId: userId, recipientId: friendId },
                { senderId: friendId, recipientId: userId }
            ]
        });

        res.status(200).json({ messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

module.exports = router;
