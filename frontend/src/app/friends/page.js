"use client";

import { useState, useEffect } from 'react';
import friendService from '../services/friendService'
import User from '../services/user'
import { Button } from '@mantine/core';

import styles from './friends.css'
import axios from 'axios';

import { useRouter } from 'next/navigation';

// TODO: remove later once user is properly set up
// const USER_ID = '65fa73b955410eecb776f5b1';
// const FRIEND_ID = '65fcabc9668f4f329e89992a'

// const USER_ID = '65fcabc9668f4f329e89992a';
// const FRIEND_ID = '65fa73b955410eecb776f5b1'

export default function FriendsPage() {
    const router = useRouter([]);
    const [friends, setFriends] = useState([]);
    const [pendingFriends, setPendingFriends] = useState([]);
    const [acceptedFriends, setAcceptedFriends] = useState([]);
    const [pendingFriendRequests, setPendingFriendRequests] = useState([]);

    const [pendingFriendRequestsLength, setPendingFriendRequestsLength] = useState([]);
    const [pendingFriendsLength, setpendingFriendsLength] = useState([]);
    const [acceptedFriendsLength, setacceptedFriendsLength] = useState([]);

    const [user, setuser] = useState({});

    const [userName, setUserName] = useState([]);

    useEffect(() => {
        let getSession = async () => {
            await User.getcurrentSession().then(res => {
                setuser(res.data)
                // console.log(user);
                fetchFriends(res.data)
            })
            .catch(err => {
                alert(err.status)
            })
        }
        getSession()
    },[])

    const remove = async (id) => {
        await friendService.deleteFriend(id).then(res => {
            console.log(res)
            fetchFriends(user)
        })

    };

    const fetchFriends = async (u) => {
        console.log(u)
        // await getPendingFriends(u);
        await getAcceptedFriends(u).then(async res => {
            await getPendingFriends(u).then(async res2 => {
                await getPendingFriendRequests(u).then(() => {
                    console.log("Done getting friends info")
                })
            })
        })
        // await getPendingFriendRequests(u);
    }

    const getPendingFriends = async (u) => {
        console.log("before calling getpendingfriends",u._id);
        await friendService.getPendingFriends(u._id)
            .then(res => {
                console.log("fetching pending friends:", res);
                setPendingFriends(res);
            })
            .catch(error => alert(error.message));
    }

    const getAcceptedFriends = async (u) => {
        await friendService.getAcceptedFriends(u._id)
            .then(res => {
                console.log("fetching accepted friends:", res);
                setAcceptedFriends(res)
            })
            .catch(error => alert(error.message))
    }


    const getPendingFriendRequests = async (u) => {
        console.log('getting pending friend requests')
        await axios.get(process.env.SERVER_URL + `/friends/get/requests?userId=${u._id}`, {withCredentials: true})
            .then(res => {
                console.log("fetching pending friend requests:", res.data);
                setPendingFriendRequests(res.data);
                if (res === null || res === undefined){
                    setPendingFriendRequestsLength(0);
                } else{
                    setPendingFriendRequestsLength (res.length);
                }
            })
            .catch(error => alert(error.message))
    }

    const acceptFriendRequest = async (request) => {
        let newFriend = { userId: user._id, friendId: request.user_id };
        await friendService.addFriend(newFriend)
        fetchFriends();
        getPendingFriendRequests();
    }

    const searchPeople = async (userName) =>{    
        let f;
        try {
            await friendService.searchPeople(userName)
                .then(friend => {
                    console.log(friend);
                    f = friend 
                })
                .catch(error => alert(error.message))
            console.log(f);
            let f_id = f[0]._id;
            // await friendService.addFriend(f_id);
            console.log(user._id)
            await axios.post(process.env.SERVER_URL + `/friends/add?friendId=${f_id}&userId=${user._id}`, {withCredentials: true})
            .then(res => {
                alert(res.data.message)
                fetchFriends(user)
            })
            .catch(error => alert(error.message))
        }
        catch (error){
            alert(error)
        }
    }

    
    const message = async (friendId) => {
        try {
            // Redirect to another page with user ID and friend ID as query parameters
            window.location.href = `/Messaging?userId=${encodeURIComponent(user._id)}&friendId=${encodeURIComponent(friendId)}`;
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
    // useEffect(() => {
    //     setuser(User.getUserInfo())
    //     fetchFriends()
    //     // getPendingFriendRequests()
    // }, []);

    useEffect(() => {
        if (acceptedFriends === null || acceptedFriends === undefined) {
            setacceptedFriendsLength(0);
        } else {
            setacceptedFriendsLength(acceptedFriends.length);
        }
    }, [acceptedFriends]);

    useEffect(() => {
        if (pendingFriends === null || pendingFriends === undefined) {
            setpendingFriendsLength(0);
        } else {
            setpendingFriendsLength(pendingFriends.length);
        }
    }, [pendingFriends]);


    // console.log(user);

    return (
        <div className="container" >
            <form onSubmit={handleSubmit}>
                <input type='text' placeholder='Search User Name...' className='searchFriend' value={userName} onChange={handleInputChange}></input>
                <button type="search" className='search'>Add</button>
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
                            {/* <p>{friend._id} ' ' </p> */}
                            <p> {friend.fname} {friend.lname}</p> 
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
                            {/* <h4>{friend._id}</h4> */}
                            <p>{friend.fname} {friend.lname}</p>
                            {/* <p>- {friend.username}</p> */}
                            <Button className='message' onClick={() => message(friend._id)}>Message</Button> 
                            <Button className="remove" onClick={() => remove(friend._id)}>Remove</Button>
                        </div>
                    ))
                ) : 
                <p>Invite Some of Your Friends to Join Socializer or Meet New People at Events!!!</p> }
            </div>
        </div>
    );
} 