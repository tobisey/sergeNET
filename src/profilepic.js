import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';

export default class ProfilePic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        axios.get('/number-friends').then(({data}) => {
            this.setState({
                numberFriends: data.numberFriends
            })
        })
    }

    logout() {
        location.replace('/logout');
    }

    render() {

        return (
            <div>
                <div className="imageBoxWrapper">
                    <div className="imageBox">
                        <Link to="/"><img src={this.props.profile_pic} alt={this.props.first} /></Link>
                    </div>
                </div>
                <div className="userInfo">
                    <div><a href="/logout"><button type="submit">-log out-</button></a></div>
                </div>
                <hr className="ppHr" />
                <div className="number"><a onClick={this.props.showFriends}><h1>{this.state.numberFriends}</h1></a></div>
                <div className="link">
                <a onClick={this.props.showChat}><h1>chat</h1></a>
                <a onClick={this.props.showOnlineUsers}><h1>who's online</h1></a>
                </div>
            </div>
        )
    }

}
