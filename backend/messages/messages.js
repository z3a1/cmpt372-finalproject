const { storeUserSocket, getUserSocket, removeUserSocket } = require('./userSocket');
const mongoose = require("mongoose");
const Messages = mongoose.model("Messages");
const UserSocket = mongoose.model("UserSocket");


// router.get('/messaging', async (req, res) =>



function initializeSocket(io) {

    io.on('connection', (socket) => {
        console.log('New socket connection');

        const userId = '65fcabc9668f4f329e89992a'; // For testing, replace with actual user ID

        if (!userId) {
            console.log('User not authenticated. Disconnecting.');
            socket.disconnect(true);
            return;
        }

        const recipientId = '65fa73b955410eecb776f5b1'; // For testing, replace with actual recipient ID

        storeUserSocket(userId, socket.id, recipientId)
            .then(() => {
                console.log(`User socket stored for user ID ${userId}`);
            })
            .catch((err) => {
                console.error('Error storing user socket:', err);
                socket.disconnect(true);
            });

        socket.on('sendMessage', async (data) => {
            const message = data.message;

            getUserSocket(recipientId)
                .then(async (recipientSocketId) => {
                    if (recipientSocketId) {
                        // Recipient is online - message gets sent 
                        io.to(recipientSocketId).emit('message', {
                            senderId: userId,
                            message: message
                        });
                    } else {
                        // Recipient is offline - store the message
                        await Messages.create({
                            senderId: userId,
                            recipientId: recipientId,
                            message: message
                        });
                        console.log(`Recipient with ID ${recipientId} is offline. Message has been stored for later delivery.`);
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

module.exports = initializeSocket;








// async function initializeSocket(io) {

//     const userId = '65fcabc9668f4f329e89992a'; // For testing, replace with actual user ID
//     const recipientId = '65fa73b955410eecb776f5b1'; // For testing, replace with actual recipient ID

//     const socket = await getUserSocket(userId, recipientId);

//     console.log('socket', socket);

//     // const socket = io.sockets.connected[socket];

//     if (socket){

//         console.log("hiiii socket", socket);

//         socket.on('reconnect_attempt', () => {
//             socket.io.opts.query = {
//               socketId: socket || ''
//             }
//           });

//         storeUserSocket(userId, socket.id, recipientId)
//             .then(() => {
//                 console.log(`User socket stored for user ID ${userId}`);
//             })
//             .catch((err) => {
//                 console.error('Error storing user socket:', err);
//                 socket.disconnect(true);
//             });

//         socket.on('sendMessage', async (data) => {
//             const message = data.message;

//             getUserSocket(recipientId)
//                 .then(async (recipientSocketId) => {
//                     if (recipientSocketId) {
//                         // Recipient is online - message gets sent 
//                         io.to(recipientSocketId).emit('message', {
//                             senderId: userId,
//                             message: message
//                         });
//                     } else {
//                         // Recipient is offline - store the message
//                         await Messages.create({
//                             senderId: userId,
//                             recipientId: recipientId,
//                             message: message
//                         });
//                         console.log(`Recipient with ID ${recipientId} is offline. Message has been stored for later delivery.`);
//                     }
//                 })
//                 .catch((err) => {
//                     console.error('Error retrieving recipient socket:', err);
//                 });
//         });

//         socket.on('disconnect', () => {
//             console.log(`Socket disconnected for user ID ${userId}`);
//             removeUserSocket(userId)
//                 .then(() => {
//                     console.log(`User socket removed for user ID ${userId}`);
//                 })
//                 .catch((err) => {
//                     console.error('Error removing user socket:', err);
//                 });
//         });

//     }

//     else{
//         io.on('connection', (socket) => {
//             console.log('New socket connection');
    
//             // const userId = '65fcabc9668f4f329e89992a'; // For testing, replace with actual user ID
    
//             if (!userId) {
//                 console.log('User not authenticated. Disconnecting.');
//                 socket.disconnect(true);
//                 return;
//             }
    
//             // const recipientId = '65fa73b955410eecb776f5b1'; // For testing, replace with actual recipient ID
    
//             storeUserSocket(userId, socket.id, recipientId)
//                 .then(() => {
//                     console.log(`User socket stored for user ID ${userId}`);
//                 })
//                 .catch((err) => {
//                     console.error('Error storing user socket:', err);
//                     socket.disconnect(true);
//                 });
    
//             socket.on('sendMessage', async (data) => {
//                 const message = data.message;
    
//                 getUserSocket(recipientId)
//                     .then(async (recipientSocketId) => {
//                         if (recipientSocketId) {
//                             // Recipient is online - message gets sent 
//                             io.to(recipientSocketId).emit('message', {
//                                 senderId: userId,
//                                 message: message
//                             });
//                         } else {
//                             // Recipient is offline - store the message
//                             await Messages.create({
//                                 senderId: userId,
//                                 recipientId: recipientId,
//                                 message: message
//                             });
//                             console.log(`Recipient with ID ${recipientId} is offline. Message has been stored for later delivery.`);
//                         }
//                     })
//                     .catch((err) => {
//                         console.error('Error retrieving recipient socket:', err);
//                     });
//             });
    
//             socket.on('disconnect', () => {
//                 console.log(`Socket disconnected for user ID ${userId}`);
//                 removeUserSocket(userId)
//                     .then(() => {
//                         console.log(`User socket removed for user ID ${userId}`);
//                     })
//                     .catch((err) => {
//                         console.error('Error removing user socket:', err);
//                     });
//             });
//         });

//     }
    
// }

// module.exports = initializeSocket;
