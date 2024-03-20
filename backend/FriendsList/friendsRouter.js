var express = require ('express')
var router = express.Router()
var db = require('../Database/schema')

const friends = db.Friend;

let path = require ('path')

let fs = require ('fs')


/////// add mongoose queries...
const helper = {

    //get all users (for the search)
    getPeople: async function (last, first){

    },

    //get all friends (to be displayed in friends list)

    getFriends: async function (userId){

    },

    //add friend
    addFriend: async function (userId, friendId){

    },

    //delete friend
    delete: async function(userId, friendId){
        // friends.find(userId)
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

        await helper.addFriend(userId, friendId);
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
        // if friend and not friendId then search for friend???
        // nvm only passing in the id bc what else would you passs
        await helper.delete(userId, friendId);

    } catch (error) {
        console.error('Error deleting friend', error);
        res.status(500).json({message: 'internal server error'})
    }
})

module.exports = router;