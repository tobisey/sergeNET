import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

class OnlineUsers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        console.log(this.props.users);

        const {users} = this.props

        return (
            <div className="onlineUsersPerspective">
            <div className="oUX"><a onClick={this.props.hideOnlineUsers}>X</a></div>
                <div className="onlineUsers">
                {users && users.map((elem) => {
                    let url = `/user/${elem.id}`
                    return (
                        <div className="onlineUser">
                            <div className="onlineUserImageBoxWrapper">
                                <div className="onlineUserImageBox">
                                    <Link to={url}><img src={elem.profile_pic || 'http://www.htmlcsscolor.com/preview/gallery/FF69B4.png'} alt={elem.first} /></Link>
                                </div>
                            </div>
                            <div className="nameAndButtons">
                                <p>{elem.first}</p>
                            </div>
                        </div>
                    )
                })}
                </div>
            </div>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        users: state.users && state.users,
    }
}

export default connect(mapStateToProps)(OnlineUsers)
