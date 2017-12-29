export default function reducer(state = {}, action) {

    if (action.type == 'GET_OTHER_USER') {
        state = Object.assign({}, state, {
            otherUser: action.otherUser
        })
    }

    if (action.type == 'GET_FRIENDS') {
        state = Object.assign({}, state, {
            friends: action.friends
        });
    }

    if (action.type == 'GET_THOSE_ONLINE') {
        state = Object.assign({}, state, {
            users: action.users
        });
    }

    if (action.type == 'USER_JOINED') {
        if (!state.users) {
            return state;
        } else {
            let x = state.users.some(user => user.id == action.users[0].id)
            if (x) {
                console.log('user already here');
                return state
            } else {
                state = Object.assign({}, state, {
                    users: state.users.concat(action.users),
                    text: action.text
                });
            }
        }
    }

    if (action.type == 'USER_LEFT') {
        if (!state.users) {
            return state;
        } else {
            state = Object.assign({}, state, {
                users: state.users.filter(user => user.id !== action.disconnectedId)
            });
        }
    }

    if (action.type == 'CHAT_MESSAGES') {
        console.log('PREVIOUS MESSAGES IN REDUCER: ', action);

        state = Object.assign({}, state, {
            chatMessages: action.chatMessages
        });
    }

    if (action.type == 'MESSAGE_TEXT') {
        state = Object.assign({}, state, {
            message: action.message
        });
    }

    if (action.type == 'SEND_FRIEND') {
        state = Object.assign({}, state, {
            text: action.text
        });
    }

    if (action.type == 'TERMINATE') {
        {state.friends &&
            (state = Object.assign({}, state, {
                friends: state.friends.filter(friend => friend.id !== action.id)
            }))
        }
        {state.otherUser &&
            (state = Object.assign({}, state, {
                otherUser: state.otherUser.map((user) => {
                    if (user.id == action.id) {
                        return Object.assign({}, user, {
                            status: 4
                        })
                    }
                    return user
                })
            }))
        }
    }

    if (action.type == 'ACCEPT') {
        {state.friends &&
            (state = Object.assign({}, state, {
                friends: state.friends.map((newFriend) => {
                    if (newFriend.id == action.id) {
                        return Object.assign({}, newFriend, {
                            status: 2
                        })
                    }
                    return newFriend
                })
            }))
        }
        {state.otherUser &&
            (state = Object.assign({}, state, {
                otherUser: state.otherUser.map((user) => {
                    if (user.id == action.id) {
                        return Object.assign({}, user, {
                            status: 2
                        })
                    }
                    return user
                })
            }))
        }

    }

    if (action.type == 'REJECT') {
        {state.friends &&
            (state = Object.assign({}, state, {
                friends: state.friends.filter(friend => friend.id !== action.id)
            }))
        }
        {state.otherUser &&
            (state = Object.assign({}, state, {
                otherUser: state.otherUser.map((user) => {
                    if (user.id == action.id) {
                        return Object.assign({}, user, {
                            status: 5
                        })
                    }
                    return user
                })
            }))
        }
    }

    if (action.type == 'CANCEL') {
        state = Object.assign({}, state, {
            otherUser: state.otherUser.map((user) => {
                if (user.id == action.id) {
                    return Object.assign({}, user, {
                        status: 3
                    })
                }
                return user
            })
        })
    }

    if (action.type == 'SEND') {
        state = Object.assign({}, state, {
            otherUser: state.otherUser.map((user) => {
                if (user.id == action.id) {
                    return Object.assign({}, user, {
                        status: 1,
                        recipient_id: user.id
                    })
                }
                return user
            })
        })
    }

    return state;
}
