import React from 'react';
import axios from 'axios';


export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        return (
                    <div className="profilePersepctive">
                    <div className="profile">
                        <div className="otherUserImageBoxWrapper">
                            <div className="otherUserImageBox">
                                <img src={this.props.profile_pic} alt={this.props.first} />
                            </div>
                        </div>
                        <div><button onClick={this.props.showUploader} type="submit">-edit pic-</button></div>
                        <div className="bioWrapper"><p>//{this.props.first} {this.props.last}</p></div>
                        <div className="bioWrapper"><p>{this.props.bio}</p></div>
                        <div><button onClick={this.props.editBio} type="submit">-edit bio-</button></div>
                    </div>
            </div>
        )
    }

}
