var express = require ('express')
var router = express.Router()
var db = require('../Database/schema')

const friends = db.Friend;
const user = db.User;

let path = require ('path')

let fs = require ('fs')


/////// add mongoose queries...
const helper = {

    //get all friends (to be displayed in friends list)
    getFriends: async function (userId){

        //maybe do a count as well? how many firends does the user have being displayed???
        // await friends.countDocuments({ user_id: userId }).exec();

        //get all friend_ids -> then search the user schema for their username, fname, lname


        //hence allFriends contains username, fname, lname (I think...)

        await friends.find({ user_id: userId }).then(async(res)=>{
            const friendIds = await res.filter(friend => friend.user_id !== userId).map(friend => friend.friend_id);
            const friendInfo = await user.find({ user_id: { $in: friendIds }}).select('username fname lname user_id').exec();
            for await(const doc of friendInfo){
                console.log(doc);
            }
            return friendInfo;
        });

        /// possibly needs to do this the opposite way as well??? - depedns on hwo I create

        // const moreFriends = await friends.find({ friend_id: userId }).then(async (res) =>{
        //     await user.find({ user_id: res }, username, fname, lname).exec();
        // });
    },

    //get all users (for the search)
    getPeople: async function (last, first){
        //get all people in the database that have the first and last name?? 
        // if (first != null || last != null){
        //     await user.find({ fname: first, lname: last })
        // } else{
        //     if (first != null){
        //         await user.find({ fname: first })
        //     } else{
        //         await user.find({ lname: last })
        //     }
        // }
    },



    //add friend
    addFriend: async function (userId, friendId){
        try {
            // to check if the friend relationship already exists
            const existingFriend = await friends.findOne({ user_id: userId, friend_id: friendId });
            if (existingFriend) {
                throw new Error("Friend relationship already exists.");
            }
    
            // adding frienddddd
            await friends.create({ user_id: userId, friend_id: friendId });
    
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

//for all the friends of that user 
router.get('/friends/', async (req, res) => {
    try {
        const userId = req.body.userId;

        await helper.getFriends(userId);
    } catch (error){
        console.log('Error getting friends', error);
        res.status(500).json({ message: 'internal server error' })
    }
})

//for all the people in the database - probably needs to be on a separate page? maybe? idk
router.get('friends/', async (req, res) => {
    try {
        ////// idk what is happening here yet 
        // search by name????? 
        const last = req.body.last;
        const first = req.body.first;

        await helper.getPeople(last, first);
    } catch (error){
        console.log('Error getting people', error);
        res.status(500).json({ message: 'internal server error' })
    }
})


router.post('/friends/', async (req, res) => {
    try {
        // main user id and friend id (friend to add)
        const userId = req.body.userId;
        const friendId = req.body.friendId;

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


router.delete('/friends/', async (req, res) => {
    try {
        //pass in friendId
        const userId = req.body.userId;
        const friendId = req.body.friendId;
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