var express = require ('express')
const router = express.Router()
// var db = require('../Database/schema')
const uuid = require('uuid');

// const friends = db.Friend;
// const user = db.User;

const mongoose = require("mongoose");
const Friend = mongoose.model("Friend");
const User = mongoose.model("User");


const helper = {

    //maybe do a count as well? how many firends does the user have being displayed???
    //get all friends (to be displayed in friends list)
    getFriends: async function (userId){
        //get all friend_ids -> then search the user schema for their username, fname, lname
        //hence allFriends contains username, fname, lname (I think...)

        console.log('in get friends');

        // Return all friends with user_id = userId or friend_id = userId
        // TODO: Using the result, find the users with the user table
        return await friends.find({ user_id: userId }, { friend_id: userId})
        .then(res => {return res})
        .catch(err => console.error(err))

        // return await friends.find({ user_id: userId })
        // .then(async(res)=>{
        //     const friendIds = await res.filter(friend => friend.user_id !== userId).map(friend => friend.friend_id);
        //     const friendInfo = await user.find({ user_id: { $in: friendIds }}).select('username fname lname user_id').exec();
        //     for await(const doc of friendInfo){
        //         console.log(doc);
        //     }
        //     console.log('in get friends - after the queries');
        //     return friendInfo;
        // });

        /// possibly needs to do this the opposite way as well??? - depedns on how I create a friend 
    },

    //get all users (for the search)
    getPeople: async function (last, first){
        //get all people in the database that have the first and last name
        if (first != null || last != null){
            const people = await user.find({ fname: first, lname: last }).select('username fname lname').exec();
            return people;
        } else{
            if (first != null){
                const people = await user.find({ fname: first });
                return people
            } else{
                const people = await user.find({ lname: last });
                return people;
            }
        }
    },


    //add friend
    addFriend: async function (userId, friendId){
        try {
            // to check if the friend relationship already exists
            const existingFriend = await friends.findOne({ user_id: userId, friend_id: friendId });
            if (existingFriend) {
                console.log('User is already friends with ', friendId)
                // throw new Error("Friend relationship already exists.");
            } else {
                await friends.create({ user_id: userId, friend_id: friendId });
                console.log("created friend")
            }
        } catch (error) {
            console.error('Error adding friend:', error);
            throw error;
        }
    },

    //delete friend
    delete: async function(userId, friendId){
        // friends.find(userId)
        await friends.findOneAndDelete({ user_id: userId, friend_id: friendId })
    }
}


//TODO: make another get for friend count (total friends)

//for all the friends of that user 
// router.get('/all', async (req, res) => {
//     console.log("router getting all friends")
//     try {
//         const userId = req.query.userId;
//         console.log('userId', userId);

//         await helper.getFriends(userId)
//         .then(result => {
//             console.log("results from db", result)
//             res.status(200).send(result)
//         });        
//     } catch (error){
//         console.log('Error getting friends', error);
//         res.status(500).json({ message: 'internal server error' })
//     }
// })

//for all the people in the database - probably needs to be on a separate page? maybe? idk
/*
router.get('/people/', async (req, res) => {
    try {
        ////// idk what is happening here yet 
        // search by name????? 
        const last = req.body.last;
        const first = req.body.first;

        if (!last || !first) {
            return res.status(400).json({ message: "First or last name is required in the request body" });
        }

        await helper.getPeople(last, first);
    } catch (error){
        console.log('Error getting people', error);
        res.status(500).json({ message: 'internal server error' })
    }
})
*/

// NOTE: for testing purposes
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
        console.log(allAcceptedFriends)
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
        console.log(allPendingFriends)
        res.status(200).json({ allPendingFriends });
    } catch (err) {
        console.log('Error getting all pending friends of user', err);
        res.status(500).json({ message: 'internal server error' })
    }
})

// Send a friend request
router.post('/add', async (req, res) => {
    const userId = req.query.userId;
    const friendId = req.query.friendId;
    console.log('userId', userId);
    console.log('friendId', friendId);

    try {
        const friend = {
            user_id: userId,
            friend_id: friendId
        }
        const aFriend = {
            user_id: friendId,
            friend_id: userId
        }

        const existingFriend = await Friend.findOne(friend) 
        const existingAFriend = await Friend.findOne(aFriend)

        // Already friends
        if (existingFriend && existingAFriend) {
            console.log("User is already friends with friend", existingFriend, existingAFriend)
            res.status(200).json({ message: 'User is already friends with friend' });

        // User has already sent a friend request
        } else if (existingFriend && !existingAFriend) {
            console.log("User has already sent a friend request to:", friendId)
            res.status(200).json({ message: 'User has already sent a friend request to friend' });

        // User and friend both sent requests to eachother
        } else if (!existingFriend && existingAFriend) {
            // Friend's request is accepted ahd is now a friend of user
            const newAFriend = new Friend(aFriend)
            newAFriend.status = 'accepted'
            await newAFriend.save()
                .then(savedAFriend => console.log("User accepted friend:", savedAFriend))
                .catch(err => console.error("Error saving a friend:", err))

            // User is now friends with friend
            const newFriend = new Friend(friend)
            newFriend.status = 'accepted'
            await newFriend.save()
                .then(savedFriend => console.log("Friend accepted user:", savedFriend))
                .catch(err => console.error("Error saving friend:", err))

            res.status(200).json({ message: 'Successfully accepted friend requests for both user and friend' });
        
        // User sends a friend request
        } else {
            const newFriend = new Friend(friend)
            await newFriend.save()
                .then(savedFriend => console.log("Friend request saved for user:", savedFriend))
                .catch(err => console.error("Error saving friend request:", err))

            res.status(201).json({ message: 'Successfully added friend request' });
        }
    } catch (error) {
        console.log('Error adding friend', error);
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