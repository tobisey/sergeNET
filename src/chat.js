import React from 'react';
import { connect } from 'react-redux';
// import { reset } from 'redux-form';
import { getSocket } from './socket.js'
import { messageText, newMessage } from './actions.js';

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
           this.elem.scrollTop = this.elem.scrollHeight - this.elem.clientHeight
    }

    componentDidUpdate() {
           this.elem.scrollTop = this.elem.scrollHeight - this.elem.clientHeight
    }

    render() {

        const {chatMessages, id, first, last, profile_pic, message} = this.props

        return (
            <div className="perspective">
            <div className="chat">
            <div className="x"><a onClick={this.props.hideChat}>X</a></div>
                <div ref={elem => this.elem = elem} className="previousMessages">
                {chatMessages && chatMessages.map((elem) => {
                    return (
                        <div>
                            <div className="chatWrapper">
                                <div className="chatImageBoxWrapper">
                                    <div className="chatImageBox">
                                        <img src={elem.profile_pic || 'http://www.htmlcsscolor.com/preview/gallery/FF69B4.png'} alt={elem.first} />
                                    </div>
                                </div>
                                <div className="chatText">
                                    <p>//{elem.first} {elem.last}</p>
                                    <p>{elem.message}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
                </div>
                    <textarea onChange={(e) => this.textVal = (e.target.value)} ref="chat" className="writeMessage" name="writeMessage" rows="10" cols="65"></textarea>
                    <button onClick={() => {this.props.newMessage(id, first, last, profile_pic, this.textVal); this.refs.chat.value=""}} className="sendButton">-send-</button>
                </div>
            </div>

        )
    }

}

const mapStateToProps = (state) => {
    return {
        chatMessages: state.chatMessages && state.chatMessages,
        message: state.message && state.message
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        messageText(message) {
            dispatch(messageText(message))
        },
        newMessage(id, first, last, profile_pic, message) {
            dispatch(newMessage(id, first, last, profile_pic, message))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat)
