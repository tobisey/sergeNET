import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';

const spaces = /^\s+$/;

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.state = {
            first: '',
            last: '',
            email: '',
            password: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit() {

        this.setState({ error: false })
        const { first, last, email, password } = this.state

        if (!first || !last || !email || !password) {
            this.setState({ error: 'fill out the whole form' })
        } else if (email.indexOf('@') === -1) {
            this.setState({ error: 'enter a valid email' })
        } else if (spaces.test(first) || spaces.test(last) || spaces.test(password)) {
            this.setState({ error: 'spaces...seriously?' })
        } else {
            axios.post('/register', { first, last, email, password }).then(resp => {
                if (resp.data.success) {
                    location.replace('/');
                } else {
                    this.setState({ error: true })
                }
            })
        }

    }

    render() {
        return (
            <div>
                <div className="inputs">
                    <p>register</p>
                    <hr />
                    <div><input className="one" onChange={this.handleChange} name="first" type="text" placeholder="first name"></input></div>
                    <div><input onChange={this.handleChange} name="last" type="text" placeholder="last name"></input></div>
                    <div><input onChange={this.handleChange} name="email" type="email" placeholder="email"></input></div>
                    <div><input onChange={this.handleChange} name="password" type="password" placeholder="password"></input></div>
                    <div><button onClick={this.handleSubmit} type="submit">-register-</button></div>
                    <hr />
                    <div><p>already registered? <Link to="/login">login</Link></p></div>
                    {this.state.error && <div className="error"><p>{this.state.error}</p></div>}
                </div>
            </div>
        )
    }
}
