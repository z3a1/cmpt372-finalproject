
// saving to local storage for now!

import axios from 'axios';


const friendService =  {
    getAllFriends: async(userId) => {
        return await axios.get(process.env.SERVER_URL + `/friends/get/all?userId=${userId}`, {withCredentials: true})
            .then(res => {
                return res.data
            })
        .catch(error => console.error("Error getting all friends", error.message))
    },

    getPendingFriends: async(userId) => {
        return await axios.get(process.env.SERVER_URL + `/friends/get/pending?userId=${userId}`, {withCredentials: true})
            .then(res => {
                console.log(res.data);
                return res.data
            })
        .catch(error => console.error("Error getting pending friends", error.message))
    },

    getAcceptedFriends: async(userId) => {
        return await axios.get(process.env.SERVER_URL + `/friends/get/accepted?userId=${userId}`, {withCredentials: true})
            .then(res => {
                return res.data
            })
        .catch(error => console.error("Error getting accepted friends", error.message))
    },

    deleteFriend: async(id, userId,friendId) => {
        await axios.delete(process.env.SERVER_URL + `/friends/delete/friend?friendRequestId=${id}&userId=${userId}&friendId=${friendId}`, {withCredentials: true})
            .then(res => {
                console.log(res)
            })
            .catch(error => console.error("Error deleting friend", error.message))
    },

    addFriend: async(friend) =>{
        await axios.post(process.env.SERVER_URL + `/friends/add?userId=${friend.userId}&friendId=${friend.friendId}`, {withCredentials: true})
        .then(res => {
            console.log(res)
        })
        .catch(error => console.error("Error adding friend", error.message))
    },

    getFriendsCount: async(id) => {
        await axios.get(process.env.SERVER_URL + `/friends/get/count?userId=${userId}`, {withCredentials: true})
        .then(res => {
            return res.data
        })
        .catch(error => console.error("Error getting number of friends", error.message))
    },

    searchPeople: async(userName) => {
        await axios.get(process.env.SERVER_URL + `/friends/get/people?userName=${userName}`, {withCredentials: true})
        .then(res => {
            return res.data
            // use the data to go to a new page -> user profile
        })
        .catch(error => console.error("Error getting people", error.message))
    }
}

export default friendService

