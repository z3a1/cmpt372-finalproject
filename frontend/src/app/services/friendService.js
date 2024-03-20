
// saving to local storage for now!
const friendService =  {

    friends: [],

    getAllFriends: () => {
        const friends = JSON.parse(localStorage.UserArray);
        return friends || '[]';
    },

    deleteFriend: (id) => {
        friendService.friends = friendService.friends.filter((p) =>{
            return p.id != id
        })
        localStorage.UserArray = JSON.stringify(friendService.friends);   
        return;
    },

    addFriend: (f) =>{
        friendService.friends.push(f);
        localStorage.UserArray = JSON.stringify(friendService.friends);     
        return;
    },

    getFriendCount: () => {
        const r = friendService.friends.length;
        return r
    }

}

export default friendService

