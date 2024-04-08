"use client";

import { useState, useEffect } from 'react';
import friendService from '../services/friendService'
import styles from './friends.css'
import {v4 as idGen} from "uuid"
import axios from 'axios';

// TODO: remove later once user is properly set up
// const USER_ID = '65fa73b955410eecb776f5b1';
// const FRIEND_ID = '65fcabc9668f4f329e89992a'

const USER_ID = '65fcabc9668f4f329e89992a';
const FRIEND_ID = '65fa73b955410eecb776f5b1'

export default function FriendsPage() {
    const [friends, setFriends] = useState([]);
    const [pendingFriends, setPendingFriends] = useState([]);
    const [acceptedFriends, setAcceptedFriends] = useState([]);
    const [pendingFriendRequests, setPendingFriendRequests] = useState([]);

    const [pendingFriendRequestsLength, setPendingFriendRequestsLength] = useState([]);
    const [pendingFriendsLength, setpendingFriendsLength] = useState([]);
    const [acceptedFriendsLength, setacceptedFriendsLength] = useState([]);

    const [userName, setUserName] = useState([]);


    // To be deleted 
    const add = async () => {
        let newFriend = { userId: USER_ID, friendId: FRIEND_ID };
        try {
            console.log('adding new friend', newFriend);
            await friendService.addFriend(newFriend)
            
            fetchFriends();
            getPendingFriendRequests();
        } catch (error){
            console.error('Error adding friend:', error)
        }
    };

    const remove = async (id) => {
        try{
            console.log("deleting friend:", id)
            await friendService.deleteFriend(id, USER_ID, FRIEND_ID);
            fetchFriends();
        } catch (error){
            console.error('Error deleting friend:', error);
        }

    };

    const fetchFriends = async () => {
        await getPendingFriends()
        await getAcceptedFriends()
    }

    const getPendingFriends = async () => {
        await friendService.getPendingFriends(USER_ID)
            .then(res => {
                console.log("fetching pending friends:", res.pendingfriendArray);
                setPendingFriends(res.pendingfriendArray);

                setPendingFriends(prevState => {
                    console.log("the pending friends:", prevState);
                    console.log('the pending friends.legnth:', prevState.length);

                    return res.pendingfriendArray;
                });
            })
            .catch(error => console.error('Error fetching pending friends:', error.message));
    }

    const getAcceptedFriends = async () => {
        await friendService.getAcceptedFriends(USER_ID)
            .then(res => {

                setAcceptedFriends(prevState => {
                    console.log("the accepted friends:", prevState);
                    console.log('the accepted friends.legnth:', prevState.length);

                    return res.friendArray;
                });
            })
            .catch(error => console.error('Error fetching accepted friends:', error.message))
    }


    const getPendingFriendRequests = async () => {
        await axios.get(process.env.SERVER_URL + `/friends/get/requests?userId=${USER_ID}`)
            .then(res => {
                console.log("fetching pending friend requests:", res.data.friendRequestArray)
                setPendingFriendRequests(res.data.friendRequestArray);
                if (res.data.friendRequestArray === null || res.data.friendRequestArray === undefined){
                    setPendingFriendRequestsLength(0);
                } else{
                    setPendingFriendRequestsLength (res.data.friendRequestArray.length);
                }
            })
            .catch(error => console.error('Error fetching pending friend requests:', error.message))
    }

    const acceptFriendRequest = async (request) => {
        console.log(request)
        let newFriend = { userId: request.friend_id, friendId: request.user_id };
        await friendService.addFriend(newFriend)
        fetchFriends();
        getPendingFriendRequests();
    }

    const searchPeople = async (userName) =>{    
        try {
            console.log('Searching for a new friend', userName);
            await friendService.searchPeople(userName)
            
        } catch (error){
            console.error('Error finding friend:', error.message)
        }
    }

    //TODO: complete this function
    const declineFriendRequest = (request) => {
        try {

        } catch (error) {
            console.error('Error deleting friend request:', error.message)
        }
    }

    const message = async (friendId) => {
        try {
            // const userId = getUserId(); 
    
            // Redirect to another page with user ID and friend ID as query parameters
            window.location.href = `/messaging?userId=${encodeURIComponent(USER_ID)}&friendId=${encodeURIComponent(friendId)}`;
        } catch(error) {
            console.error("Error:", error);
        }
    };

    const handleInputChange = (event) =>{
        setUserName(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        searchPeople(userName);
    }

    // On load
    useEffect(() => {
        fetchFriends()
        getPendingFriendRequests()
    }, []);

    useEffect(() => {
        console.log("the accepted friends:", acceptedFriends);
        console.log('the accepted friends.length:', acceptedFriends.length);
        if (acceptedFriends === null || acceptedFriends === undefined) {
            setacceptedFriendsLength(0);
        } else {
            setacceptedFriendsLength(acceptedFriends.length);
        }
        console.log("it's length:", acceptedFriends.length);
    }, [acceptedFriends]);

    useEffect(() => {
        console.log("the pending friends:", pendingFriends);
        console.log('the pending friends.length:', pendingFriends.length);
        if (pendingFriends === null || pendingFriends === undefined) {
            setpendingFriendsLength(0);
        } else {
            setpendingFriendsLength(pendingFriends.length);
        }
        console.log("it's length:", pendingFriendsLength);
    }, [pendingFriends]);

    return (
        <div className="container" >
            <button className="add" onClick={() => add()}>Add Friend</button>
            <form onSubmit={handleSubmit}>
                <input type='text' placeholder='Search User Name...' className='searchFriend' value={userName} onChange={handleInputChange}></input>
                <button type="search" className='search'>Search</button>
            </form>
            
            {/* <ul className="friendsList">
                {friends.map((friend, index) => (
                    <li key={index} className="friend">
                        {friend.friend_id} 
                        <button className="remove" onClick={() => remove(friend._id)}>Remove</button>
                    </li>
                ))}
            </ul> */}

            <div>
                <div className="friend-request-heading">
                    <h2 className='PendingFriendRequestHeading'>Pending Friend Requests</h2>
                    { pendingFriendRequestsLength > 0 ? (
                        <h3 className='pendingFriendRequestsLength'>({pendingFriendRequestsLength} Request(s))</h3>
                    ): null}
                </div>

                { pendingFriendRequestsLength > 0 ? (
                    pendingFriendRequests.map((request, index) => (
                        <div key={index}>
                            <h4>{request._id}</h4>
                            <p>- {request.username} ({request.fname} {request.lname})</p>
                            <button onClick={() => acceptFriendRequest(request)}>Accept</button>
                            {/* <button onClick={() => declineFriendRequest(request)}>Decline</button> */}
                        </div>
                    ))
                ) : 
                <p>You Have No Pending Friend Requests</p> }
            </div>

            <div>
                <div className="friend-request-heading">
                    <h2 className='FriendRequestHeading'>User's Pending</h2>
                    { pendingFriendsLength > 0 ? (
                        <h3 className='FriendRequestsLength'>({pendingFriendsLength} Request(s) Sent)</h3>
                    ) : null }
                </div>

                { pendingFriendsLength > 0 ? (
                    pendingFriends.map((friend, index) => (
                        
                        <div key={index} className="friend-container">
                            {/* <h4>{friend._id}</h4>
                            <p>- {friend.username}</p> */}
                            <p>{friend.fname} {friend.lname}</p> 
                            <button className="remove" onClick={() => remove(friend._id)}>Remove</button>
                        </div>
                    ))
                ) : 
                <p>You Have No Outgoing Friend Requests</p> }
            </div>

            <div>
                <div className="friend-request-heading">
                    <h2 className='FriendsHeading'>Accepted Friends</h2>
                    { acceptedFriendsLength > 0 ? (
                        <h3 className='acceptedFriendsLength'>({acceptedFriendsLength} Friends!)</h3>
                    ) : null }
                </div>

                { acceptedFriendsLength > 0 ? (
                    acceptedFriends.map((friend, index) => (
                        <div key={index}>
                            <h4>{friend._id}</h4>
                            <p>- {friend.username}</p>
                            <p>- {friend.fname} {friend.lname}</p>
                            {/* <button className='message' onClick={() => message(friend._id)}>Message</button> */}
                            <button className="remove" onClick={() => remove(friend._id)}>Remove</button>
                        </div>
                    ))
                ) : 
                <p>Invite Some of Your Friends to Join Socializer or Meet New People at Events!!!</p> }

            </div>
            {/* Just to test */}
            <button className='message' onClick={() => message(FRIEND_ID)}>Message</button>
        </div>
    );
} 