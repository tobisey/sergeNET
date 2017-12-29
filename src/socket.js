import * as io from 'socket.io-client';
import axios from 'axios';
import { store } from './start.js';
import { onlineUsers, userJoined, userLeft, chatMessages, sendFriend } from './actions.js';


let socket;

export function getSocket() {
    if (!socket) {
        socket = io.connect();
        socket.on('connect', () => {
            console.log('connected m8');
            axios.get('/connected/' + socket.id)
        })
    }

    socket.on('onlineUsers', (data) => {
        console.log('ONLINE USERS: ', data);
        store.dispatch(onlineUsers(data))
    })

    socket.on('userJoined', (data) => {
        console.log('USER JOINED: ', data);
        store.dispatch(userJoined(data))
    })

    socket.on('userLeft', (data) => {
        console.log('USER LEFT: ', data);
        store.dispatch(userLeft(data))
    })

    socket.on('chatMessages', (data) => {
        console.log('CHAT MESSAGES: ', data);
        store.dispatch(chatMessages(data))
    })

    socket.on('sendFriend', (data) => {
        console.log('TEXT: ', data);
        store.dispatch(sendFriend(data))
    })

    return socket;
}
