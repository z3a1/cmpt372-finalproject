
const socketio = require('socket.io');
// const db = require('./Database/db'); 

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

        //TODO: completee
        db.storeUserSocket(userId, socket.id)
            .then(() => {
                recipientSocket.emit('message', {
                    senderId: userId,
                    message: message
                })
            })
            .catch((err) => {
                console.error('Error storing user socket:', err);
                socket.disconnect(true); 
            });

        //TODO: add storeUserSocket, getUserSocket, and removeUserSocket functions

        socket.on('sendMessage', (data) => {
            const recipientId = data.recipientId;
            const message = data.message;
            db.getUserSocket(recipientId)
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
            db.removeUserSocket(userId)
                .catch((err) => {
                    console.error('Error removing user socket:', err);
                });
        });
    });
};
