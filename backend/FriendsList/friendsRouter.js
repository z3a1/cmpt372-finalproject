var express = require ('express')
const router = express.Router()
var db = require('../Database/schema')
const uuid = require('uuid');

const friends = db.Friend;
const user = db.User;


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
router.get('/all', async (req, res) => {
    console.log("router getting all friends")
    try {
        const userId = req.query.userId;
        console.log('userId', userId);

        await helper.getFriends(userId)
        .then(result => {
            console.log("results from db", result)
            res.status(200).send(result)
        });        
    } catch (error){
        console.log('Error getting friends', error);
        res.status(500).json({ message: 'internal server error' })
    }
})

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


///TODO: change later
router.post('/add', async (req, res) => {
    try {
        const userId = req.query.userId;
        const friendId = req.query.friendId;

        console.log('userId', userId);
        console.log('friendId', friendId);

        if (!userId || !friendId) {
            return res.status(400).json({ message: "userId and friendId are required in the request body" });
        }

        await helper.addFriend(userId, friendId);
        res.status(200).json({ message: 'Friend added successfully' });

    } catch (error) {
        console.log('Error adding friend', error);
        res.status(500).json({ message: 'internal server error' })
    }
})


router.delete('/delete', async (req, res) => {
    try {
        // NOTE: IDs are passed as string instead of UUID
        const userId = req.query.userId;
        const friendId = req.query.friendId;
        console.log("hi", userId, friendId) // TODO: remove later

        if (!userId || !friendId) {
            return res.status(400).json({ message: "userId and friendId are required in the request body" });
        }
        // if friend and not friendId then search for friend???
        // nvm only passing in the id bc what else would you passs
        await helper.delete(userId, friendId);
        res.status(200).json({ message: 'Friend deleted successfully' });
    } catch (error) {
        console.error('Error deleting friend', error);
        res.status(500).json({message: 'internal server error'})
    }
})

module.exports = router;