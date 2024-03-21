
// saving to local storage for now!

import axios from 'axios';


const friendService =  {

    friends: [],

    getAllFriends: async() => {

        try {
            await axios.get('http:localhost:8080/friends');
        } catch(error){
            console.error('Error fetching friends:', error);
            throw error;
        }

        /// LOCAL STORAGE
        // const friends = JSON.parse(localStorage.UserArray);
        // return friends || '[]';
    },

    deleteFriend: async(id) => {
        // wrap with json after
        try {
            await axios.delete('http:localhost:8080/friends', id);
        } catch(error){
            console.error('Error fetching friends:', error);
            throw error;
        }

        /// LOCAL STORAGE
        // friendService.friends = friendService.friends.filter((p) =>{
        //     return p.id != id
        // })
        // localStorage.UserArray = JSON.stringify(friendService.friends);   
        // return;
    },

    addFriend: async(f) =>{
        // wrap with json after
        try {
            await axios.post('http:localhost:8080/friends', f);
        } catch(error){
            console.error('Error fetching friends:', error);
            throw error;
        }

        /// LOCAL STORAGE
        // friendService.friends.push(f);
        // localStorage.UserArray = JSON.stringify(friendService.friends);     
        // return;
    }

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

