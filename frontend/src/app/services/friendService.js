
// saving to local storage for now!

import axios from 'axios';


const friendService =  {
    // TODO: Remove later
    // friends: [],

    getAllFriends: async(userId) => {
        return await axios.get(process.env.SERVER_URL + `/friends/get/all?userId=${userId}`)
            .then(res => {
                console.log(res.data)
                return res.data
            })
        .catch(err => console.error("Error getting all friends", err))

        /// LOCAL STORAGE
        // const friends = JSON.parse(localStorage.UserArray);
        // return friends || '[]';
    },

    deleteFriend: async(id) => {
        console.log(id)
        await axios.delete(process.env.SERVER_URL + `/friends/delete/friend?friendRequestId=${id}`)
            .then(res => {
                console.log(res)
            })
            .catch(err => console.error("Error deleting friend", err))

        /// LOCAL STORAGE
        // friendService.friends = friendService.friends.filter((p) =>{
        //     return p.id != id
        // })
        // localStorage.UserArray = JSON.stringify(friendService.friends);   
        // return;
    },

    addFriend: async(friend) =>{
        await axios.post(process.env.SERVER_URL + `/friends/add?userId=${friend.userId}&friendId=${friend.friendId}`)
        .then(res => {
            console.log(res)
        })
        .catch(err => console.error("Error adding friend", err))

        /// LOCAL STORAGE
        // friendService.friends.push(f);
        // localStorage.UserArray = JSON.stringify(friendService.friends);     
        // return;
    }

    // TODO: need to add a search function

    // getFriendCount: async() => {
    //     // const r = friendService.friends.length;
    //     // return r

    //     try {

    //     } catch(error){
    //         console.error('Error fetching friends:', error);
    //         throw error;
    //     }
    // }
}

export default friendService

