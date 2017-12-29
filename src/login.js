import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';

const spaces = /^\s+$/;

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.state = {};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit() {

        const {email, password } = this.state

        if (!email || !password) {
            this.setState({ error: 'fill out the whole form' })
        } else if (email.indexOf('@') === -1) {
            this.setState({ error: 'enter a valid email' })
        } else if (spaces.test(password)) {
            this.setState({ error: 'spaces...seriously?' })
        } else {
            this.setState({ error: false })
            axios.post('/login', { email, password }).then(resp => {
                if (resp.data.success) {
                    location.replace('/');
                } else {
                    this.setState({ error: 'incorrect email or password' })
                }
            })
        }

    }

    render() {
        return (
            <div>
                <div className="inputs">
                    <p>log in</p>
                    <hr />
                    <div><input onChange={this.handleChange} name="email" type="email" placeholder="email"></input></div>
                    <div><input onChange={this.handleChange} name="password" type="password" placeholder="password"></input></div>
                    <div><button onClick={this.handleSubmit} type="submit">-log in-</button></div>
                    <hr />
                    <div><p>actually i need to <Link to="/">register</Link></p></div>
                    {this.state.error && <div className="error"><p>{this.state.error}</p></div>}
                </div>
            </div>
        )
    }
}
