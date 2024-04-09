const { storeUserSocket, getUserSocket, removeUserSocket } = require('./userSocket');
const mongoose = require("mongoose");
const Messages = mongoose.model("Messages");
const UserSocket = mongoose.model("UserSocket");
const WebSocket = require('ws');




function initializeSocket(io) {

    io.on('connection', (socket) => {
        console.log('New socket connection');


        // const userId = '65fcabc9668f4f329e89992a'; // For testing, replace with actual user ID

        const userId = '65fa73b955410eecb776f5b1';
        
        if (!userId) {
            console.log('User not authenticated. Disconnecting.');
            socket.disconnect(true);
            return;
        }

        // const recipientId = '65fa73b955410eecb776f5b1'; // For testing, replace with actual recipient ID
        const recipientId = '65fcabc9668f4f329e89992a';
        
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

//     const socketId = await getUserSocket(userId, recipientId);
//     console.log('socketId',socketId);

//     if (socketId){
//         try {
//             // const socketId = await getUserSocket(userId, recipientId);
//             // console.log('socketId',socketId);
//             const socket = socketIO.connect('http://localhost:8080', { // Provide the URL to connect
//                 query: { socketId: socketId }
//             });
    
//             console.log('Reconnecting...');
    
//             socket.on('connect', () => {
//                 console.log('Reconnected to Socket.IO server');
//                 console.log('socket.id',socket.id)
//             });
    
//             socket.on('message', (data) => {
//                 console.log('Received message:', data);
//             });
    
//             socket.on('disconnect', () => {
//                 console.log('Disconnected from Socket.IO server');
//             });
    
//             socket.on('error', (error) => {
//                 console.error('Socket.IO error:', error);
//             });
//         } catch (error) {
//             console.error('Error retrieving socket ID from the database:', error);
//         }

//     } else{
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





// async function initializeSocket(io) {
//     const userId = '65fcabc9668f4f329e89992a'; // For testing, replace with actual user ID
//     const recipientId = '65fa73b955410eecb776f5b1'; // For testing, replace with actual recipient ID

//     const socketId = await getUserSocket(userId, recipientId);
//     console.log('socketId',socketId);

//     if (socketId){
//         console.log('why hello')


//         try {
//             // const socketId = await getUserSocket(userId, recipientId);
//             // console.log('socketId',socketId);
//             console.log('All connected sockets:', Array.from(io.sockets.sockets.keys()));


//             const usersocket = io.sockets.sockets.get(socketId);
//             console.log(usersocket)
//             if (usersocket){
//                 usersocket.emit('establish_connection');
//                 console.log('Connection established with client:', socketId);
//             }
//             console.log(io.connected[userSocket]);
            
//             // io.on('connection', (socket) => {
//             //     console.log('same client connected');
            
//             //     // Emit an event to establish connection with the specified socket ID
//             //     socket.to(socketId).emit('establish_connection');
//             //     console.log(socket.id)
            
//             //     // Handle any messages received from the connected client
//             //     socket.on('message', (data) => {
//             //     console.log('Received message from client:', data);
//             //     });
            
//             //     // Handle disconnection
//             //     socket.on('disconnect', () => {
//             //     console.log('Client disconnected');
//             //     });
//             // });
//         } catch (error) {
//             console.error('Error retrieving socket ID from the database:', error);
//         }

//     } else{
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






//     const socket = io.sockets.connected[userSocket];

//     if (socket) {
//         const socket = io.connected[userSocket];
//         console.log('socket:', socket); 

//         io.on('connection', (socket) => {
//             io.to(socket)
//             // console.log('New socket connection');
//             console.log("hiiii socket", socket.id);

//         })

    



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
    








// // router.get('/messaging', async (req, res) =>