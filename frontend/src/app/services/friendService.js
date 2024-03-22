
// saving to local storage for now!

import axios from 'axios';


const friendService =  {

    // friends: [],

    getAllFriends: async() => {

        try {
            const response = await axios.get(process.env.SERVER_UR + '/friends').then( res =>{
                console.log(res.data);
                /// more functionality for the res
            });
            // const response = await fetch ('http://localhost:8080/friends');
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
            await axios.delete(process.env.SERVER_UR + '/friends', id).then(res =>{
                console.log(res.data);
            });
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
            await axios.post(process.env.SERVER_UR + '/friends', f).then(res =>{
                console.log(res.data)
            });
        } catch(error){
            console.error('Error fetching friends:', error);
            throw error;
        }

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

