const mongoose = require('mongoose');

const userSocketSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // to reference the user model
        required: true
    },
    socketId: {
        type: String,
        required: true
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // to reference the user model
        required: true
    }
});

const UserSocket = mongoose.model('UserSocket', userSocketSchema);

const storeUserSocket = async (userId, socketId, recipientId) => {
    console.log(socketId);
    try {
        let userSocket = await UserSocket.findOne({ userId, recipientId });

        if (!userSocket) {
            userSocket = new UserSocket({ userId, socketId, recipientId });
        } else {
            userSocket.socketId = socketId;
        }

        await userSocket.save();
    } catch (error) {
        throw error;
    }
};

const getUserSocket = async (userId, recipientId) => {
    try {
        const userSocket = await UserSocket.findOne({ userId, recipientId });

        if (userSocket) {
            return userSocket.socketId;
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
};

const removeUserSocket = async (userId, recipientId) => {
    try {
        await UserSocket.findOneAndDelete({ userId, recipientId });
    } catch (error) {
        throw error;
    }
};

module.exports = {
    storeUserSocket,
    getUserSocket,
    removeUserSocket
};
