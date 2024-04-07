const socketio = require('socket.io');
const { storeUserSocket, getUserSocket, removeUserSocket } = require('./userSocket');

module.exports = function (server) {
    const io = socketio(server);

    io.on('connection', (socket) => {
        console.log('New socket connection');

        const userId = socket.handshake.query.userId; 
        
        if (!userId) {
            console.log('User not authenticated. Disconnecting.');
            socket.disconnect(true); 
            return;
        }

        storeUserSocket(userId, socket.id)
            .then(() => {
                console.log(`User socket stored for user ID ${userId}`);
            })
            .catch((err) => {
                console.error('Error storing user socket:', err);
                socket.disconnect(true); 
            });

        socket.on('sendMessage', (data) => {
            const recipientId = data.recipientId;
            const message = data.message;
            getUserSocket(recipientId)
                .then((recipientSocketId) => {
                    if (recipientSocketId) {
                        io.to(recipientSocketId).emit('message', {
                            senderId: userId,
                            message: message
                        });
                    } else {
                        console.log(`Recipient with ID ${recipientId} not found or offline`);
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
};
