"use client";

import { useState, useEffect } from 'react';
import friendService from '../services/friendService'
import styles from './friends.css'
import {v4 as idGen} from "uuid"

// TODO: remove later once user is properly set up
const USER_ID = idGen();

export default function FriendsPage() {
    const [friends, setFriends] = useState([]);

    //TODO: add a "search" - just writes the name and adds
    const add = async () => {
        let newFriend = { userId: USER_ID, friendId: idGen() };
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
            await friendService.deleteFriend(USER_ID, id);
            fetchFriends();
        } catch (error){
            console.error('Error deleting friend:', error);
        }

    };

    const fetchFriends = async () => {
        try {
            await friendService.getAllFriends(USER_ID)
            .then(res => {
                console.log(res)
                setFriends(res);
            })
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    return (
        <div className="container" >
            <button className="add" onClick={() => add()}>Add Friend</button>
            <ul className="friendsList">
                {friends?.map((friend) => (
                    <li key={friend.friend_id} className="friend">
                        {friend.name} 
                        <button className="remove" onClick={() => remove(friend._id)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
} 