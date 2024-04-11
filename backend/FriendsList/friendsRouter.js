var express = require ('express')
const router = express.Router()
const mongoose = require('mongoose')
const db = require('../Database/schema')
// const Friend = mongoose.model("Friend");
// const User = mongoose.model("User");

/*
TODO: 
    make sure that all backend works with the front end 
        adding a count 
        make the names clickable - going to the profile of that user
*/

async function getInfo (idArray) {
    const friendArray = [];

    for (const friend of idArray){
        let friendInfo = await db.User.findOne({ _id: friend.friend_id }, { username: 1, fname: 1, lname: 1, _id: 1 });
        if (friendInfo) {
            friendInfo.friendRequestId = friend._id;
            friendArray.push(friendInfo);
        }
    }

    return friendArray
}


// Get all accepted friends of user
router.get('/get/accepted', async (req, res) => {
    const userId = req.query.userId
    await db.Friend.find({ user_id: userId, status: "accepted" }).then(dbRes => {
        console.log(dbRes)
        res.status(200).json(dbRes)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({message: 'internal server error', error: err})
    })
})

// Get all pending friends of user
router.get('/get/pending', async (req, res) => {

    let userId = req.query.userId

    await db.Friend.find({ user_id: userId, status: "pending" }).then(async dbRes => {
        await getInfo(dbRes).then(infoRes => {
            res.status(200).json(infoRes)
        })
        .catch(err => {
            console.log('getInfo err:' ,err)
            res.status(500).json({message: 'error with getting info!', err: err})
        })
    }) 
    .catch(err => {
        console.log(err)
        res.status(500).json({message: 'error with getting pending friends!', err: err})
    })
})

// Get all pending friend requests
router.get('/get/requests', async (req, res) => {
    const userId = req.query.userId
    await db.Friend.find({ user_id: userId, status: "pending" }).then(async dbRes => {
        await getInfo(dbRes).then(infoRes => {
            res.status(200).json(infoRes)
        })
        .catch(err => res.status(500).json({message: 'error with getting info!', err: err}))
    })
    .catch(err => res.status(500).json({message: 'error with getting friend requests!', err: err}))
})

// For the Search Bar
router.get('/get/people', async (req, res) => {
    const userName = req.query.userName;
    console.log(userName);
    try{
        const newFriend = await db.User.find({ username: userName }, { fname: 1, lname: 1, _id: 1 } )
        console.log(newFriend);
        res.status(200).json( newFriend );
    } catch (err) {
        res.status(500).json({ message: 'internal server error' })
    }
})


// Handles all friend additions
// Includes accepting pending friend requests sent by others
router.post('/add', async (req, res) => {
    console.log(req.query);
    let {userId, friendId} = req.query
    // const userId = req.userId;
    console.log('userId',userId)
    // const friendId = req.friendId;
    console.log('friendid',friendId)

    try {
        // User is already friends
        const existingFriendship = await db.Friend.findOne({ user_id: userId, friend_id: friendId, status: "accepted" });
        if (existingFriendship) {
            res.status(400).json({ message: 'User is already friends' })
        } else {
            // User has already sent a friend request to person
            const existingFriendRequest = await db.Friend.findOne({ user_id: userId, friend_id: friendId })
            if (existingFriendRequest) {
                res.status(400).json({ message: 'Friend request already sent' })
            } else {
                const existingRequestFromFriend = await db.Friend.findOneAndUpdate(
                    { user_id: friendId, friend_id: userId },
                    { status: "accepted" })
        
                // Person has sent a friend request to user - accepts it
                if (existingRequestFromFriend) {
                    await db.Friend.create({ user_id: userId, friend_id: friendId, status: "accepted" })
                    // console.log("Friend has previously sent a friend request.Both are now friends")
                    res.status(200).json({ message: 'Successfully accepted friend requests for both user and friend' });
                
                // User sends friend request to person
                } else {
                    await db.Friend.create({ user_id: userId, friend_id: friendId })
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
    let friendRequestId = req.query.friendRequestId; // _id
    console.log(friendRequestId)
    await db.Friend.findOneAndDelete({friend_id : new mongoose.Types.ObjectId(friendRequestId)}).then(async dbRes => {
        await db.Friend.findOneAndDelete({friend_id: new mongoose.Types.ObjectId(dbRes.user_id)}).then( edgeRes => {
            if(edgeRes){
                res.status(200).json({message: 'deleted friend status!'})
            }
            else{
                res.status(200).json({message: 'deleted friend request'})
            }
        })
    })
    .catch(err => res.status(500).json({ message: 'internal server error' }))
})

module.exports = router;
