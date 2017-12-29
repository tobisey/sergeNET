import React from 'react';
import Register from './register.js'
import Login from './login.js'

export default class Welcome extends React.Component {
    constructor(props) {  //----only class can have a constructor function
        super(props);
        console.log(this.props);
        this.state = {};
    }
    render() {
        return (
            <div>
                { this.props.children }
            </div>
        )
    }
}
