import React from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { getOtherUser, terminateFriendship, acceptFriendship, rejectFriendship, cancelFriendship, sendFriendship } from './actions.js';

class OtherUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {

        if (this.props.params.id == this.props.id) {
            console.log('attempting to view logged in user');
            browserHistory.push('/');
        } else {
            this.props.getOtherUser(this.props.params.id);
        }

    }

    componentWillReceiveProps(newProps) {
        if (this.props.params.id == this.props.id) {
            console.log('attempting to view logged in user');
            browserHistory.push('/');
        } else if( newProps.params.id !== this.props.params.id ) {
             this.props.getOtherUser(newProps.params.id)
        }
    }

    render() {

        const {otherUser, id} = this.props

        return (
            <div className="profilePersepctive">
                {otherUser &&
                <div className="profile">
                    <div className="otherUserImageBoxWrapper">
                        <div className="otherUserImageBox">
                            <img src={otherUser[0].profile_pic || 'http://www.htmlcsscolor.com/preview/gallery/FF69B4.png'} alt={otherUser[0].first} />
                        </div>
                    </div>

                    {(otherUser[0].status === 1 && otherUser[0].recipient_id === id) &&
                        <div>
                            <button onClick={() => this.props.acceptFriendship(otherUser[0].id)} type="submit">-accept friend request-</button>
                            <button className="rejectButton" onClick={() => this.props.rejectFriendship(otherUser[0].id)} type="submit">-reject-</button>
                        </div>
                    }

                    {(otherUser[0].status === 1 && otherUser[0].recipient_id !== id) &&
                        <div><button onClick={() => this.props.cancelFriendship(otherUser[0].id)} type="submit">-cancel friend request-</button></div>
                    }

                    {otherUser[0].status === 2 &&
                        <div><button onClick={() => this.props.terminateFriendship(otherUser[0].id)} type="submit">-terminate friendship-</button></div>
                    }

                    {!otherUser[0].status &&
                        <div><button onClick={() => this.props.sendFriendship(otherUser[0].id)} type="submit">-send friend request-</button></div>
                    }

                    {(otherUser[0].status === 3 || otherUser[0].status === 4 || otherUser[0].status === 5) &&
                        <div><button onClick={() => this.props.sendFriendship(otherUser[0].id)} type="submit">-send friend request-</button></div>
                    }

                    <div className="bioWrapper"><p>//{otherUser[0].first} {otherUser[0].last}</p></div>
                    <div className="bioWrapper"><p>{otherUser[0].bio}</p></div>

                </div>
                }
            </div>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        otherUser: state.otherUser
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getOtherUser(id) {
            dispatch(getOtherUser(id))
        },
        terminateFriendship(id) {
            dispatch(terminateFriendship(id))
        },
        acceptFriendship(id) {
            dispatch(acceptFriendship(id))
        },
        rejectFriendship(id) {
            dispatch(rejectFriendship(id))
        },
        cancelFriendship(id) {
            dispatch(cancelFriendship(id))
        },
        sendFriendship(id) {
            dispatch(sendFriendship(id))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OtherUser)
