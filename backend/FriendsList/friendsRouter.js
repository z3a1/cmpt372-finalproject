var express = require ('express')
const router = express.Router()


const mongoose = require("mongoose");
const Friend = mongoose.model("Friend");
const User = mongoose.model("User");

async function getInfo (idArray) {
    const friendArray = [];

    for (const friend of idArray){
        let friendInfo = await User.findOne({ _id: friend.friend_id }, { username: 1, fname: 1, lname: 1, _id: 1 });

        if (friendInfo) {
            friendInfo.friendRequestId = friend._id;
            friendArray.push(friendInfo);
        }
    }

    return friendArray
}


// Get all accepted friends of user
router.get('/get/accepted', async (req, res) => {
    const userId = req.session.passport.user._id

    try {
        const allAcceptedFriends = await Friend.find({ user_id: userId, status: "accepted" })
        const friendArray = await getInfo(allAcceptedFriends); 

        res.status(200).json({ friendArray });
    } catch (err) {
        res.status(500).json({ message: 'internal server error' })
    }
})

// Get all pending friends of user
router.get('/get/pending', async (req, res) => {
    const userId = req.session.passport.user._id

    try {
        const allPendingFriends = await Friend.find({ user_id: userId, status: "pending" })

        // To be able to get the friend's name
        const pendingfriendArray = await getInfo(allPendingFriends);

        res.status(200).json({ pendingfriendArray });
    } catch (err) {
        res.status(500).json({ message: 'internal server error' })
    }
})

// Get all pending friend requests
router.get('/get/requests', async (req, res) => {
    const userId = req.session.passport.user._id

    try {
        const friendRequests = await Friend.find({ friend_id: userId, status: "pending" })

        // To be able to get the friend's name
        // might have to change this to have friend's info?
        const friendRequestArray = await getInfo(friendRequests); // NOTE: was commented out

        res.status(200).json({ friendRequestArray });
    } catch (err) {
        res.status(500).json({ message: 'internal server error' })
    }
})

// For the Search Bar
router.get('/get/people', async (req, res) => {
    const userName = req.query.userName;
    try{
        const newFriend = await User.find({ username: userName }, { fname: 1, lname: 1, _id: 1 } )
        res.status(200).json({ newFriend });
    } catch (err) {
        res.status(500).json({ message: 'internal server error' })
    }
})


// Handles all friend additions
// Includes accepting pending friend requests sent by others
router.post('/add', async (req, res) => {
    const userId = req.session.passport.user._id
    const friendId = req.query.friendId;

    try {
        // User is already friends
        const existingFriendship = await Friend.findOne({ user_id: userId, friend_id: friendId, status: "accepted" });
        if (existingFriendship) {
            res.status(400).json({ message: 'User is already friends' })
        } else {
            // User has already sent a friend request to person
            const existingFriendRequest = await Friend.findOne({ user_id: userId, friend_id: friendId })
            if (existingFriendRequest) {
                res.status(400).json({ message: 'Friend request already sent' })
            } else {
                const existingRequestFromFriend = await Friend.findOneAndUpdate(
                    { user_id: friendId, friend_id: userId },
                    { status: "accepted" })
        
                // Person has sent a friend request to user - accepts it
                if (existingRequestFromFriend) {
                    await Friend.create({ user_id: userId, friend_id: friendId, status: "accepted" })
                    // console.log("Friend has previously sent a friend request.Both are now friends")
                    res.status(200).json({ message: 'Successfully accepted friend requests for both user and friend' });
                
                // User sends friend request to person
                } else {
                    await Friend.create({ user_id: userId, friend_id: friendId })
                    res.status(201).json({ message: 'Successfully accepted friend requests for both user and friend' });
                }        
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'internal server error' })
    }
})


// Deletes a friend by id
router.delete('/delete/friend', async (req, res) => {
    const friendRequestId = req.query.friendRequestId; // _id

    const userId = req.session.passport.user._id
    const friendId = req.query.friendId;

    try {
        const deletedFriend = await Friend.findByIdAndDelete(friendRequestId)

        if (deletedFriend) {
            // Edge case: other friend should other be deleted
            const otherFriend = await Friend.findOneAndDelete({
                user_id: deletedFriend.friend_id,
                friend_id: deletedFriend.user_id,
                status: "accepted"
            });

            if (otherFriend) {
                res.status(200).json({ message: "Successfully removed all friend relationships between user and friend" })
            } else {
                res.status(200).json({ message: "Successfully deleted pending friend request sent by user" })
            }
        } else {
            res.status(200).json({ message: "Friend request does not exist" })
        }   
    } catch (err) {
        res.status(500).json({ message: 'internal server error' });
    }
})

module.exports = router;
