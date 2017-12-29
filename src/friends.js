import React from 'react';
import { connect } from 'react-redux';
import { getFriends, terminateFriendship, acceptFriendship, rejectFriendship } from './actions.js';
import { Link } from 'react-router';

class Friends extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.props.getFriends();
    }

    render() {
        console.log('LOGGED IN USER ID', this.props.id);
        const {friends, requests, id, info} = this.props
        console.log(requests);

        return (
            <div className="friendsPerspective">
            <div className="friends">
                <div className="x"><a onClick={this.props.hideFriends}>X</a></div>
                <div className="friendsInner">
                <div>
                    {requests && <hr/>}
                    {requests && <h4>-requests-</h4>}
                    {requests && requests.map((elem) => {
                        let url = `/user/${elem.id}`
                        return (
                            <div className="request">
                                <div className="friendsImageBoxWrapper">
                                    <div className="friendsImageBox">
                                        <Link to={url}><img src={elem.profile_pic || 'http://www.htmlcsscolor.com/preview/gallery/FF69B4.png'} alt={elem.first} /></Link>
                                    </div>
                                </div>
                                <div className="nameAndButtons">
                                    <p>{elem.first} {elem.last}</p>
                                    <div><button onClick={() => this.props.acceptFriendship(elem.id)}>-accept-</button></div>
                                    <div><button onClick={() => this.props.rejectFriendship(elem.id)}>-reject-</button></div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div>
                    <hr/>
                    <h4>-friends-</h4>
                    {friends && friends.map((elem) => {
                        let url = `/user/${elem.id}`
                        return (
                            <div className="friend">
                                <div className="friendsImageBoxWrapper">
                                    <div className="friendsImageBox">
                                        <Link to={url}><img src={elem.profile_pic || 'http://www.htmlcsscolor.com/preview/gallery/FF69B4.png'} alt={elem.first} /></Link>
                                    </div>
                                </div>
                                <div className="nameAndButtons">
                                    <p>{elem.first} {elem.last}</p>
                                    <button onClick={() => this.props.terminateFriendship(elem.id)}>-terminate-</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
                </div>


            </div>
            </div>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        friends: state.friends && state.friends.filter(friend => friend.status == 2),
        requests: state.friends && state.friends.filter(friend => friend.status == 1)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getFriends() {
            dispatch(getFriends())
        },
        terminateFriendship(id) {
            dispatch(terminateFriendship(id))
        },
        acceptFriendship(id) {
            dispatch(acceptFriendship(id))
        },
        rejectFriendship(id) {
            dispatch(rejectFriendship(id))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Friends)
