"use client";

import { useState, useEffect } from 'react';
import friendService from '../services/friendService'
import styles from './friends.css'
import {v4 as idGen} from "uuid"
import axios from 'axios';

// TODO: remove later once user is properly set up
const USER_ID = '65fa73b955410eecb776f5b1';
const FRIEND_ID = '65fcabc9668f4f329e89992a'

// const USER_ID = '65fcabc9668f4f329e89992a';
// const FRIEND_ID = '65fa73b955410eecb776f5b1'

export default function FriendsPage() {
    const [friends, setFriends] = useState([]);
    const [pendingFriends, setPendingFriends] = useState([]);
    const [acceptedFriends, setAcceptedFriends] = useState([]);
    const [pendingFriendRequests, setPendingFriendRequests] = useState([]);

    //TODO: add a "search" - just writes the name and adds
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
            await friendService.deleteFriend(id);
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
                console.log("fetching pending friends:", res.allPendingFriends)
                setPendingFriends(res.allPendingFriends);
            })
            .catch(error => console.error('Error fetching pending friends:', error))
    }

    const getAcceptedFriends = async () => {
        await friendService.getAcceptedFriends(USER_ID)
            .then(res => {
                console.log("fetching accepted friends:", res.allAcceptedFriends)
                setAcceptedFriends(res.allAcceptedFriends);
            })
            .catch(error => console.error('Error fetching accepted friends:', error))
    }

    const getPendingFriendRequests = async () => {
        await axios.get(process.env.SERVER_URL + `/friends/get/requests?userId=${USER_ID}`)
            .then(res => {
                console.log("fetching pending friend requests:", res.data.pendingFriendRequests)
                setPendingFriendRequests(res.data.pendingFriendRequests)
            })
            .catch(error => console.error('Error fetching pending friend requests:', error))
    }

    const acceptFriendRequest = async (request) => {
        console.log(request)
        let newFriend = { userId: request.friend_id, friendId: request.user_id };
        await friendService.addFriend(newFriend)
        fetchFriends();
        getPendingFriendRequests();
    }

    // On load
    useEffect(() => {
        fetchFriends()
        getPendingFriendRequests()
    }, []);

    return (
        <div className="container" >
            <button className="add" onClick={() => add()}>Add Friend</button>
            <ul className="friendsList">
                {friends.map((friend, index) => (
                    <li key={index} className="friend">
                        {friend.friend_id} 
                        <button className="remove" onClick={() => remove(friend._id)}>Remove</button>
                    </li>
                ))}
            </ul>

            <div>
                <h2>Pending Friend Requests</h2>
                {pendingFriendRequests.map((request, index) => (
                    <div key={index}>
                        <h4>{request._id}</h4>
                        <p>- {request.user_id}</p>
                        <p>- {request.friend_id}</p>
                        <button onClick={() => acceptFriendRequest(request)}>Accept</button>
                    </div>
                ))}
            </div>

            <div>
                <h2>User's Pending</h2>
                {pendingFriends.map((friend, index) => (
                    <div key={index}>
                        <h4>{friend._id}</h4>
                        <p>- {friend.user_id}</p>
                        <p>- {friend.friend_id}</p>
                    </div>
                ))}
            </div>

            <div>
                <h2>Accepted Friends</h2>
                {acceptedFriends.map((friend, index) => (
                    <div key={index}>
                        <h4>{friend._id}</h4>
                        <p>- {friend.user_id}</p>
                        <p>- {friend.friend_id}</p>
                    </div>
                ))}
            </div>
        </div>
    );
} 