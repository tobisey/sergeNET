import axios from 'axios';
import { browserHistory } from 'react-router';

export function getOtherUser(id) {
    return axios.get('/get-other-user/?id=' + id).then(({ data }) => {
        return {
            type: 'GET_OTHER_USER',
            otherUser: data.otherUser
        }
    })
}

export function getFriends() {
    return axios.get('/get-friends').then(({ data }) => {
        return {
            type: 'GET_FRIENDS',
            friends: data.friends
        };
    });
}

export function onlineUsers(data) {
    return {
        type: 'GET_THOSE_ONLINE',
        users: data.users
    }
}

export function userJoined(data) {
    return {
        type: 'USER_JOINED',
        users: data.users,
        text: data.text
    }
}

export function userLeft(data) {
    return {
        type: 'USER_LEFT',
        disconnectedId: data.disconnectedId
    }
}

export function chatMessages(data) {
    console.log('PREVIOUS MESSAGES IN ACTION: ', data);
    return {
        type: 'CHAT_MESSAGES',
        chatMessages: data.chatMessages
    }
}

export function messageText(data) {
    console.log('MESSAGE TEXT: ', data);
    return {
        type: 'MESSAGE_TEXT',
        message: data
    }
}

export function sendFriend(data) {
    console.log('SEND FRIEND: ', data);
    return {
        type: 'SEND_FRIEND',
        text: data.text
    }
}

export function newMessage(id, first, last, profile_pic, message) {
    console.log('NEW MESSAGE: ', id, first, last, profile_pic, message);
    return axios.post('/new-message', {id, first, last, profile_pic, message}).then((data) => {
        return {
            type: 'NEW_MESSAGE',
            chatMessages: data.chatMessages
        }
    })
}

export function terminateFriendship(id) {
    return axios.post('/terminate', {id}).then(() => {
        return {
            type: 'TERMINATE',
            id: id
        }
    })
}

export function acceptFriendship(id) {
    return axios.post('/accept', {id}).then(() => {
        return {
            type: 'ACCEPT',
            id: id
        }
    })
}

export function rejectFriendship(id) {
    return axios.post('/reject', {id}).then(() => {
        return {
            type: 'REJECT',
            id: id
        }
    })
}

export function cancelFriendship(id) {
    return axios.post('/cancel', {id}).then(() => {
        return {
            type: 'CANCEL',
            id: id
        }
    })
}

export function sendFriendship(id) {
    return axios.post('/send', {id}).then(() => {
        return {
            type: 'SEND',
            id: id
        }
    })
}
