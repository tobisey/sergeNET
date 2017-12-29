import React from 'react';
import { connect } from 'react-redux';
// import { getConvo } from './actions.js';

class NewUserOnline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.text !== this.props.text) {
            this.refs.note.className = "animate"
            setTimeout(() => {
                return this.refs.note.className = "note"
            }, 3000)
        }
    }

    render() {

        const { text } = this.props
        console.log("text", text);

        return (
                <div className="newUserOnline">
                    <p ref="note" className="note">{text}</p>
                </div>
        )
    }

}

const mapStateToProps = (state) => {
    // console.log('brap brap brap', state.text);
    return {
        text: state.text && state.text
    }
}

export default connect(mapStateToProps)(NewUserOnline)
