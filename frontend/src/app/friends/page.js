"use client";

import { useState, useEffect } from 'react';
import friendService from '../services/friendService'
import styles from './friends.css'
import {v4 as idGen} from "uuid"

// TODO: remove later once user is properly set up
const USER_ID = '65fa73b955410eecb776f5b1';

export default function FriendsPage() {
    const [friends, setFriends] = useState([]);

    //TODO: add a "search" - just writes the name and adds
    const add = async () => {
        let newFriend = { userId: USER_ID, friendId: '65fcabc9668f4f329e89992a' };
        try {
            console.log('adding new friend', newFriend);
            await friendService.addFriend(newFriend)
            fetchFriends();
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
        try {
            await friendService.getAllFriends(USER_ID)
                .then(res => {
                    console.log("fetching:", res.allFriends)
                    setFriends(res.allFriends);
                })
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    // On load
    useEffect(() => fetchFriends, []);

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
        </div>
    );
} 