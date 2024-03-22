
"use client";

import { useState, useEffect } from 'react';
import friendService from '../services/friendService'
import styles from './friends.css'


export default function FriendsPage() {
    const [friends, setFriends] = useState([]);

    /// TODO: to add eventuallyyyyy with a search  
    // currently just a simple add function to make sure add and remove works 

    ///////
    //TODO: add a "search" - just writes the name and adds
    const add = async (evt) => {
        //add a new friendddd 
        // const r = friendService.getFriendCount();
        // console.log(r);
        const newFriend = { userId: '1', friendId: '1' };;
        console.log('hi');
        try {
            console.log('adding new friend', newFriend);
            await friendService.addFriend(newFriend);
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
            const friendsData = await friendService.getAllFriends();
            setFriends(friendsData);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    useEffect(() => {
        fetchFriends();
    }, []);

    return (
        <div className="container" >
            <button className="add" onClick={add}>Add Friend</button>
            <ul className="friendsList">
                {friends?.map((friend) => (
                    <li key={friend.id} className="friend">
                        {friend.name} 
                        <button className="remove" onClick={() => remove(friend.id)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
} 