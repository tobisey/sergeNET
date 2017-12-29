import React from 'react';
import axios from 'axios';

export default class UploadProfilePic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        return (
            <div className="uploader">
                    <div className="x"><a onClick={this.props.hideUploader}>X</a></div>
                    <div><input className="file-input" onChange={this.props.handleChange} name="file" type="file" /></div>
                    <div><button onClick={this.props.handleSubmit} type="submit">-upload-</button></div>
                    {this.props.error && <div className="error"><p>{this.props.error}</p></div>}
            </div>
        )
    }
}
