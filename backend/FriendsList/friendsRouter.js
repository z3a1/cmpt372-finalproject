var express = require ('express')
const router = express.Router()
// var db = require('../Database/schema')
const uuid = require('uuid');

// const friends = db.Friend;
// const user = db.User;

const mongoose = require("mongoose");
const Friend = mongoose.model("Friend");
const User = mongoose.model("User");

/*
TODO: 
    make sure that all backend works with the front end 
        adding a count 
        make the names clickable - going to the profile of that user
*/


router.get('/get/all', async (req, res) => {
    const userId = req.query.userId;

    try {
        const allFriends = await Friend.find({ user_id: userId })
        console.log(allFriends)
        res.status(200).send({ allFriends });
    } catch (err) {
        console.log('Error getting all friends of user', err);
        res.status(500).send({ message: 'internal server error' })
    }
})


// Get all accepted friends of user
router.get('/get/accepted', async (req, res) => {
    const userId = req.query.userId;

    try {
        const allAcceptedFriends = await Friend.find({ user_id: userId, status: "accepted" })
        

        // To be able to get the friend's name
        const friendArray = [];

        for (const friend of allAcceptedFriends){
            console.log('Friend:', friend);
            console.log('friend id:', friend.friend_id)
            const friendInfo = await User.findOne({ _id: friend.friend_id }, { username: 1, fname: 1, lname: 1, _id: 1 });
            console.log(friendInfo);
            if (friendInfo) {
                friendArray.push(friendInfo);
            }
        }
        console.log(allAcceptedFriends);
        console.log(friendArray);

        // Should be sending the friendArray - to get their info sent through
        res.status(200).json({ allAcceptedFriends });
        
    } catch (err) {
        console.log('Error getting all accepted friends of user', err);
        res.status(500).json({ message: 'internal server error' })
    }
})

// Get all pending friends of user
router.get('/get/pending', async (req, res) => {
    const userId = req.query.userId;

    try {
        const allPendingFriends = await Friend.find({ user_id: userId, status: "pending" })

        // To be able to get the friend's name
        const pendingfriendArray = [];

        for (const friend of allPendingFriends){
            console.log('Friend:', friend);
            console.log('friend id:', friend.friend_id)
            const friendInfo = await User.findOne({ _id: friend.friend_id }, { username: 1, fname: 1, lname: 1, _id: 1 });
            console.log(friendInfo);
            if (friendInfo) {
                pendingfriendArray.push(friendInfo);
            }
        }
        console.log(pendingfriendArray);
        console.log(allPendingFriends);

        res.status(200).json({ allPendingFriends });
    } catch (err) {
        console.log('Error getting all pending friends of user', err);
        res.status(500).json({ message: 'internal server error' })
    }
})

// Get all pending friend requests
router.get('/get/requests', async (req, res) => {
    const userId = req.query.userId;

    try {
        const friendRequests = await Friend.find({ friend_id: userId, status: "pending" })

        // To be able to get the friend's name
        const friendRequestArray = [];

        for (const friend of friendRequests){
            console.log('Friend:', friend);
            console.log('friend id:', friend.friend_id)
            const friendInfo = await User.findOne({ _id: friend.friend_id }, { username: 1, fname: 1, lname: 1, _id: 1 });
            console.log(friendInfo);
            if (friendInfo) {
                friendRequestArray.push(friendInfo);
            }
        }
        console.log(friendRequestArray);
        console.log("Pending friend requests:", friendRequests);

        res.status(200).json({ friendRequests });
    } catch (err) {
        console.log('Error getting all pending friend requests of user:', err);
        res.status(500).json({ message: 'internal server error' })
    }
})

// For the Search Bar
router.get('/get/people', async (req, res) => {
    const userName = req.query.userName;
    console.log(userName);

    try{
        const newFriend = await User.find({ username: userName }, { fname: 1, lname: 1, _id: 1 } )
        console.log('viewing person: ', newFriend);
        res.status(200).json({ newFriend });
    } catch (err) {
        console.log('Error finding person in database: ', err);
        res.status(500).json({ message: 'internal server error' })
    }
})


// Handles all friend additions
// Includes accepting pending friend requests sent by others
router.post('/add', async (req, res) => {
    const userId = req.query.userId;
    const friendId = req.query.friendId;
    console.log('userId', userId);
    console.log('friendId', friendId);

    try {
        // User is already friends
        const existingFriendship = await Friend.findOne({ user_id: userId, friend_id: friendId, status: "accepted" });
        if (existingFriendship) {
            console.log("User is already friends with friend", existingFriendship)
            res.status(400).json({ message: 'User is already friends' })
        } else {
            // User has already sent a friend request to person
            const existingFriendRequest = await Friend.findOne({ user_id: userId, friend_id: friendId })
            if (existingFriendRequest) {
                console.log("friend request already sent", existingFriendRequest)
                res.status(400).json({ message: 'Friend request already sent' })
            } else {
                const existingRequestFromFriend = await Friend.findOneAndUpdate(
                    { user_id: friendId, friend_id: userId },
                    { status: "accepted" })
        
                // Person has sent a friend request to user - accepts it
                if (existingRequestFromFriend) {
                    await Friend.create({ user_id: userId, friend_id: friendId, status: "accepted" })
                    console.log("Friend has previously sent a friend request.Both are now friends")
                    res.status(200).json({ message: 'Successfully accepted friend requests for both user and friend' });
                
                // User sends friend request to person
                } else {
                    await Friend.create({ user_id: userId, friend_id: friendId })
                    console.log("sent friend request")
                    res.status(201).json({ message: 'Successfully accepted friend requests for both user and friend' });
                }        
            }
        }
    } catch (error) {
        console.error("Error adding friend:", error)
        res.status(500).json({ message: 'internal server error' })
    }
})


// Deletes a friend by id
router.delete('/delete/friend', async (req, res) => {
    const friendRequestId = req.query.friendRequestId // _id

    try {
        const deletedFriend = await Friend.findByIdAndDelete(friendRequestId)
            .catch(err => console.error("Error deleting friend request sent by user:", err))

        if (deletedFriend) {
            console.log("Deleted friend request sent by user:", deletedFriend)
            res.status(200).json({ message: "Successfully deleted pending friend request sent by user" })
        } else {
            console.log("Error, no friend request found and deleted")
            res.status(200).json({ message: "Friend request does not exist" })
        }   
        // TODO: edge case for when two people are friends - both friend relationships deleted

    } catch (err) {
        console.error('Error deleting a pending friend request sent by the user:', err);
        res.status(500).json({ message: 'internal server error' })
    }
})

// router.delete('/delete', async (req, res) => {
//     try {
//         // NOTE: IDs are passed as string instead of UUID
//         const userId = req.query.userId;
//         const friendId = req.query.friendId;
//         console.log("hi", userId, friendId) // TODO: remove later

//         if (!userId || !friendId) {
//             return res.status(400).json({ message: "userId and friendId are required in the request body" });
//         }
//         // if friend and not friendId then search for friend???
//         // nvm only passing in the id bc what else would you passs
//         await helper.delete(userId, friendId);
//         res.status(200).json({ message: 'Friend deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting friend:', error);
//         res.status(500).json({message: 'internal server error'})
//     }
// })

module.exports = router;
