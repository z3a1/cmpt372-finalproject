
/// might not actually need this file 

// const express = require('express');
// const router = express.Router();


// const helper = {
//     async sendMessage (req, res) {
//         try {
//             const { senderId, recipientId, message } = req.body;
//             // Implement logic to send message here
//             // For example, use your socket.io logic or any other messaging service
//             res.status(200).json({ success: true, message: 'Message sent successfully' });
//         } catch (error) {
//             console.error('Error sending message:', error);
//             res.status(500).json({ success: false, message: 'Failed to send message' });
//         }
//     }

// }

// // Route to send a message
// router.post('/send', helper.sendMessage);

// module.exports = router;