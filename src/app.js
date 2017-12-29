import React from 'react';
import axios from 'axios';
import Logo from './logo.js'
import ProfilePic from './profilepic.js'
import UploadProfilePic from './uploadprofilepic.js'
import EditBio from './editbio.js'
import Profile from './profile.js'
import NewUserOnline from './newuseronline.js'
import Friends from './friends.js'
import Chat from './chat.js'
import OnlineUsers from './onlineusers.js'
import { Link } from 'react-router';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showUploader = this.showUploader.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
        this.editBio = this.editBio.bind(this);
        this.hideEditBio = this.hideEditBio.bind(this);
        this.handleBioChange = this.handleBioChange.bind(this);
        this.handleBioSubmit = this.handleBioSubmit.bind(this);
        this.showFriends = this.showFriends.bind(this);
        this.hideFriends = this.hideFriends.bind(this);
        this.showChat = this.showChat.bind(this);
        this.hideChat = this.hideChat.bind(this);
        this.showOnlineUsers = this.showOnlineUsers.bind(this);
        this.hideOnlineUsers = this.hideOnlineUsers.bind(this);
    }

    componentDidMount() {
        axios.get('/user').then(({data}) => {
            data.results.profile_pic = data.results.profile_pic || 'http://www.htmlcsscolor.com/preview/gallery/FF69B4.png'
            this.setState(data.results);
        })
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.files[0]
        })

    }

    handleSubmit() {

        console.log(this.state.file);

        this.setState({ error: false })

        if (!this.state.file) {
            this.setState({ error: 'select a file' })
        } else if (this.state.file.type.indexOf('image') === -1) {
            this.setState({ error: 'file not valid' })
        } else {
            console.log('submitting...');

            var formData = new FormData();
            formData.append('file', this.state.file);

            axios.post('/upload-image', formData).then(resp => {
                console.log('data: ', resp.data);
                if (resp.data.success) {
                    this.setState({
                        profile_pic: resp.data.results
                    })
                    // location.replace('/');
                } else {
                    this.setState({ error: 'upload failed' })
                }
            })
        }

    }

    showUploader() {
        this.setState({
            uploaderIsVisible: true
        })
    }

    hideUploader() {
        this.setState({
            uploaderIsVisible: false,
            error: false
         })
    }

    editBio() {
        this.setState({
            editBioIsVisible: true
        })
    }

    hideEditBio() {
        this.setState({
            editBioIsVisible: false,
            error: false
        })
    }

    handleBioChange(e) {
        this.setState({
            newbio: e.target.value
        })
        console.log(this.state);
    }

    handleBioSubmit() {

        console.log(this.state.newbio);

        this.setState({ error: false })

        if (!this.state.newbio) {
            this.setState({ error: 'write something' })
        } else {

            const {newbio} = this.state
            const data = {newbio}
            axios.post('/update-bio', data).then(resp => {
                if (resp.data.success) {
                    this.setState({
                        bio: resp.data.results
                    })
                    this.hideEditBio();
                    console.log('state: ', this.state);
                } else {
                    this.setState({ error: 'edit failed' })
                }
            }).catch((err) => {
                console.log(err);
            })
        }

    }

    showFriends() {
        this.setState({
            friendsIsVisible: true
        })
    }

    hideFriends() {
        this.setState({
            friendsIsVisible: false
        })
    }

    showChat() {
        this.setState({
            chatIsVisible: true
        })
    }

    hideChat() {
        this.setState({
            chatIsVisible: false
        })
    }

    showOnlineUsers() {
        this.setState({
            onlineUsersIsVisible: true
        })
    }

    hideOnlineUsers() {
        console.log('yep');
        this.setState({
            onlineUsersIsVisible: false
        })
    }

    render() {

        console.log(this.state);

        const { id, profile_pic, first, last, bio, error, editBioIsVisible, value } = this.state
        const children = React.cloneElement(this.props.children, {
            id,
            profile_pic,
            first,
            last,
            bio,
            error,
            editBioIsVisible,
            showUploader: this.showUploader,
            hideUploader: this.hideUploader,
            editBio: this.editBio,
            hideEditBio: this.hideEditBio,
            handleBioChange: this.handleBioChange,
            handleBioSubmit: this.handleBioSubmit,
            sendFriendRequest: this.sendFriendRequest
        });


        if (!this.state.id) {
            return (
                <div className="loading"><p>loading...</p></div>
            );
        }

        return (
            <div>
                <Logo />
                <ProfilePic
                    profile_pic={profile_pic}
                    first={first}
                    last={last}
                    showFriends={this.showFriends}
                    showChat={this.showChat}
                    showOnlineUsers={this.showOnlineUsers}
                />
                {this.state.uploaderIsVisible && <UploadProfilePic
                    handleChange={this.handleChange}
                    handleSubmit={this.handleSubmit}
                    hideUploader={this.hideUploader}
                    error={this.state.error}
                />}
                {this.state.editBioIsVisible && <EditBio
                    bio={bio}
                    value={value}
                    handleBioChange={this.handleBioChange}
                    handleBioSubmit={this.handleBioSubmit}
                    hideEditBio={this.hideEditBio}
                    error={this.state.error}
                />}
                {this.state.friendsIsVisible && <Friends
                    hideFriends={this.hideFriends}
                />}
                {this.state.chatIsVisible && <Chat
                    id={id}
                    profile_pic={profile_pic}
                    first={first}
                    last={last}
                    hideChat={this.hideChat}
                />}
                {this.state.onlineUsersIsVisible && <OnlineUsers
                    hideOnlineUsers={this.hideOnlineUsers}
                />}
                <NewUserOnline />
                {children}
            </div>
        )
    }
}
