const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Messages = mongoose.model("Messages");
const User = mongoose.model("User");
const { getUserSocket } = require('./userSocket');

router.post('/sendMessage', async (req, res) => {
    try {
        const { userId, recipientId, message } = req.body;

        const newMessage = new Message({
            senderId: userId,
            recipientId,
            message
        });

        await newMessage.save();

        const recipientSocketId = await getUserSocket(recipientId);
        if (recipientSocketId) {
    
            req.io.to(recipientSocketId).emit('message', {
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

router.get('/friendInfo', async (req, res) => {
    console.log("in get friend info");

    try {
        const friendId = req.query.friendId;

        const friend = await User.findOne({ _id: friendId }, { username: 1, fname: 1, lname: 1, _id: 1 });
        console.log("friend", friend);

        res.status(200).json({ friend });

    } catch (error){
        console.error('Error fetching friend info:', error);
        res.status(500).json({ error: 'Failed to fetch friend' });
    }
})

router.get('/messages', async (req, res) => {
    console.log("hi");
    try {
        const { userId, friendId } = req.query;

        const m = await Messages.find({
            $or: [
                { senderId: userId, recipientId: friendId },
                { senderId: friendId, recipientId: userId }
            ]
        });

        console.log(m);

        //TODO: sort 

        res.status(200).json({ m });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

module.exports = router;
