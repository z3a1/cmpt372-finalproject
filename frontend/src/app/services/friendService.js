
// saving to local storage for now!

import axios from 'axios';


const friendService =  {
    getAllFriends: async(userId) => {
        let res;
        await axios.get(process.env.SERVER_URL + `/friends/get/all?userId=${userId}`, {withCredentials: true})
            .then(result => {
                res = result.data
            })
        .catch(error => console.error("Error getting all friends", error.message))
        return res
    },

    getPendingFriends: async(userId) => {
        let res;
        await axios.get(process.env.SERVER_URL + `/friends/get/pending?userId=${userId}`, {withCredentials: true})
            .then(result => {
                console.log("in friend service",result.data);
                res = result.data
            })
        .catch(error => console.error("Error getting pending friends", error.message))
        return res
    },

    getAcceptedFriends: async(userId) => {
        let res;
        await axios.get(process.env.SERVER_URL + `/friends/get/accepted?userId=${userId}`, {withCredentials: true})
            .then(result => {
                res = result.data
            })
        .catch(error => console.error("Error getting accepted friends", error.message))
        return res
    },

    deleteFriend: async(id, userId,friendId) => {
        await axios.delete(process.env.SERVER_URL + `/friends/delete/friend?friendRequestId=${id}&userId=${userId}&friendId=${friendId}`, {withCredentials: true})
            .then(res => {
                console.log(res)
            })
            .catch(error => console.error("Error deleting friend", error.message))
    },

    addFriend: async(friend) =>{
        await axios.post(process.env.SERVER_URL + `/friends/add?userId=${userId}&friendId=${friend}`, {withCredentials: true})
        .then(res => {
            console.log(res)
        })
        .catch(error => console.error("Error adding friend", error.message))
    },

    // getFriendsCount: async(id) => {
    //     await axios.get(process.env.SERVER_URL + `/friends/get/count?userId=${userId}`, {withCredentials: true})
    //     .then(res => {
    //         return res.data
    //     })
    //     .catch(error => console.error("Error getting number of friends", error.message))
    // },

    searchPeople: async(userName) => {
        let friend = [];
        await axios.get(process.env.SERVER_URL + `/friends/get/people?userName=${userName}`, {withCredentials: true})
        .then(res => {
            console.log(res.data)
            friend = res.data
            // use the data to go to a new page -> user profile
        })
        .catch(error => console.error("Error getting people", error.message))
        return friend
    }
}

export default friendService

