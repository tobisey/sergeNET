import React from 'react';
import axios from 'axios';

export default class EditBio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        return (
            <div className="editBio">
                <div className="x"><a onClick={this.props.hideEditBio}>X</a></div>
                <textarea onChange={this.props.handleBioChange} ref="bio" name="bio" rows="10" cols="55" defaultValue={this.props.bio}></textarea>
                <div><button onClick={this.props.handleBioSubmit} type="submit">-submit-</button></div>
                {this.props.error && <div className="error"><p>{this.props.error}</p></div>}
            </div>
        )
    }
}
