const { storeUserSocket, getUserSocket, removeUserSocket } = require('./userSocket');

function initializeSocket(io) {
    io.on('connection', (socket) => {
        console.log('New socket connection');
        // probably should call to get all the messages to display - before being able to send the message

        // const userId = socket.handshake.query.userId;
        const userId = '65fcabc9668f4f329e89992a';

        if (!userId) {
            console.log('User not authenticated. Disconnecting.');
            socket.disconnect(true); 
            return;
        }

        // Assuming you have the recipientId available
        const recipientId = '65fa73b955410eecb776f5b1'; 

        storeUserSocket(userId, socket.id, recipientId)
            .then(() => {
                console.log(`User socket stored for user ID ${userId}`);
            })
            .catch((err) => {
                console.error('Error storing user socket:', err);
                socket.disconnect(true); 
            });

        socket.on('sendMessage', (data) => {
            // const recipientId = data.recipientId;
            const recipientId = '65fa73b955410eecb776f5b1';
            const message = data.message;

            getUserSocket(recipientId)
                .then((recipientSocketId) => {
                    if (recipientSocketId) {
                        // Recipient is online - message gets sent 
                        io.to(recipientSocketId).emit('message', {
                            senderId: userId,
                            message: message
                        });
                    } else {
                        // needs to store the offline messages - and display on user side 
                        // storeOfflineMessage(recipientId, {
                        //     senderId: userId,
                        //     message: message
                        // });
                        console.log(`Recipient with ID ${recipientId} is offline. Message will be stored for later delivery.`);
                    }
                })
                .catch((err) => {
                    console.error('Error retrieving recipient socket:', err);
                });
        });

        socket.on('disconnect', () => {
            console.log(`Socket disconnected for user ID ${userId}`);
            removeUserSocket(userId)
                .then(() => {
                    console.log(`User socket removed for user ID ${userId}`);
                })
                .catch((err) => {
                    console.error('Error removing user socket:', err);
                });
        });
    });
}

// function storeOfflineMessage(recipientId, message) {

// }


module.exports = initializeSocket;
