// // COMPRESSION
// // Reduces file size, as the name suggests.
// //
// //
// // Client side code goes in SRC start.js.
//
// import React from 'react';
// import ReactDOM from 'react-dom';
//
// function log() {
//     console.log('hi')
// }
//
// ReactDOM.render(
//     <Hello receiver="Kitty" fn="log" />,  //----jsx syntax tag, Kitty is a prop
//     document.querySelector('main')  //----this is where you want the above to go
// );
//
// function Hello(props) {  //----this is a component
//     console.log(props)
//     props.fn()
//     return (
//         <div>Hello, {props.receiver} <World />!</div>  //----this is not html even though it looks like it, it will be converted to html later. Inject with {}.
//     );
// }
//
// function World() {
//     return <strong>World</strong>
// }
//
// =============================================
//
// function Hello(props) {  //----do not change props!!
//     console.log(props)
//     props.fn()
//     return (
//         <div>Hello, <Receiver name="Kitty" />!</div>
//     );
// }
//
// function Receiver(props) {
//     return <strong>{props.name}</strong>
// }
//
// //
// // STATES
// // Components made with function don't have state. They have to be made with class to have state.
// //Classes have to be declared at the top of the page.
//
// class Hello extends React.component {
//     constructor(props) {
//         super(props);
//         console.log(this.props);
//         this.state = {};
//     }
//     render() {
//         return (
//             <div>Hello, <Receiver name="{this.props.name}" />!</div>
//         )
//     }
// }
//
// =============================================
//
// class Hello extends React.component {
//     constructor(props) {
//         super(props);
//         console.log(this.props);
//         this.state = {
//             name = 'kitty'
//         };
//     }
//     render() {
//         return (
//             <div onClick={(e) => this.setState(name: 'World ')}>Hello, <Receiver name="{this.state.name}" />!</div>
//         )
//     }
// }
//
// ReactDOM.render(
//     <Hello />,
//     document.querySelector('main')
// );
//
// function Receiver(props) {
//     return <strong>{props.name}</strong>
// }
//
// =============================================
//
// class Hello extends React.component {
//     constructor(props) {
//         super(props);
//         console.log(this.props);
//         this.state = {
//             name = 'kitty'
//         };
//     }
//     render() {
//         return (
//             <div onClick={(e) => this.setState(name: 'World ')}>Hello, <Receiver name="{this.state.name}" />!</div>
//             <PrettyInput />
//         )
//     }
// }
//
// ReactDOM.render(
//     <Hello />,
//     document.querySelector('main')
// );
//
// function Receiver(props) {
//     return <strong>{props.name}</strong>
// }
//
// function PrettyInput() {
//     const style = {
//         border: '1px red dotted',
//         color: 'green',
//         fontSize: '20px',
//         fontStyle: 'italic'
//     }
//     return (
//         <input style={style} type="text"></input>
//     )
// }
//
// =============================================
//
// //Make seperate file for each element
//
// import React from 'react'
// import Register from './register.js'
//
// export default function Welcome() {
//     return (
//         <div>
//             Hi
//             <Register />
//         </div>
//     )
// }
//
// //Do everything with ajax request instead of knowing whether the user is logged in or not.
// //Use URL to determine if theyre logged in or not.
//
// app.get('*', (req, res) => {
//     if (!req.session.user && req.url != '/welcome') {
//         res.redirect('/welcome');
//         return;
//     }
//     res.sendFile(__dirname + '/index.html')
// })
//
// let component;
// if (location.pathname == 'welcome') {
//     component = <Welcome />
// } else {
//     component = <Logo />
// }
//
// ReactDOM.render(
//     component,
//     document.querySelector('main')
// );
//
// //Need to use axios to do ajax requests
//
// import React from 'react';
// import axios from 'axios';
//
// export class Register extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {};
//     }
//     handleChange() {
//
//     }
//     handleSubmit() {
//         axios.post('/register', {
//             first: this.first,
//             email: this.email,
//             password: this.password
//         }).then(resp => {
//             if (resp.data.success) {
//                 location.replace('/');
//             } else {
//                 this.setState({
//                     error: true
//                 })
//             }
//         })
//     }
//     render() {
//         return (
//             <div>
//                 {this.state.error && <div>YOU MESSED UP</div>}
//                 <input onChange={() => this.handleChange(e.target.name, e.target.value) }/>
//                 <input />
//                 <input />
//                 <input />
//                 <button onClick={() => this.submit() }></button>
//             </div>
//         )
//     }
// }
//
//
// //CLIENT SIDE ROUTING=====================================================================
//
// // When not logged in direct to /welcome
// // in /welcome we load the Welcome component
// //  -Switching component based on the url
//
//
// //When logged in direct to the app component
//
// import React from 'react';
// import ReactDOM from 'react-dom';
// import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';
// import { Welcome, Registration, Login } from './welcome';
//
//
// const router = (
//     <Router history={hashHistory}>  //----using hashHistory not browserHistory
//         <Route path="/" component={Welcome}>
//             <Route path="/login" component={Login} />  //----routes nested in other routes is how you swap out specifc components
//             <IndexRoute component={Registration} />  //----the is what automatically appears
//   	</Route>
//     </Router>
// );
//
// ReactDOM.render(router, document.querySelector('main'));
//
//
// // ============================================================
//
// function Welcome(props) {
// 	return (
// 		<div>
//       			<h1>Welcome to this site!</h1>
//       			{props.children}  //----this where the components load
//       		</div>
//   	);
//
//
// }
//
//
//
// //SERVER DICTATES WHETEHER WE GO TO /WELCOME OR NOT
//
// app.get('/welcome', (req, res) => {
//     if(req.session.user) {
//         res.redirect('/')
//     }
// })
//
// app.get('/', (req, res) => {
//     if(!req.session.user) {
//         res.redirect('/welcome')
//     }
// })
//
//
// //SPECIAL TYPE OF Link
//
// import { Link } from 'react-router';
//
// <Link to="/login">login</Link>
//
//
// //DESTRUCTURING
//
// const { first, last, email, password } = this.state
//
// //APP PAGE
//
// 3 components, logo, profile pic and profile pic upload.
// Will need multer and s3.
//
// class App extends React.Component {
//     render() {
//
//         // The best place to do axios is immediately after the component has been put in the DOM.
//
//         componentDidMount() {
//             axios.get('/user').then(({data}) => {
//                 this.setState(data);
//             })
//         }
//
//         if (!this.state.id) {
//             return null;
//         }
//
//         return (
//             <div>
//                 <Logo />
//                 <ProfilePic
//                     image={this.state.profilePic}
//                     first={this.state.first}
//                     last={this.state.last}
//                     showUploader={() => this.setState({ uploaderIsVisible: true })}
//                 />
//                 {this.state.uploaderIsVisible && <UploadProfilePic setImage={(imgUrl) => {
//                     this.setState({
//                         profilePic: imgUrl
//                     })
//                 }}/>}
//             </div>
//         )
//     }
// }
//
// //in SERVER
//
// app.get('/user', (req, res) => {
//     db.getUser(req.session.user.id).then((user) => {
//         res.json(user)
//     })
// })
//
//
// //LOGGED IN EXPERIENCE
//
// React.cloneElement - makes a copy of a component and merge in other data that will become props of the cloned component.
// {this.props.children} is a component coming from the router that changes depending on the url.
//
// For logged in pass browserHistory.
//
// class MyComponent extends React.Component {
//     log(msg) {
//         console.log(msg);
//     }
//     render() {
//         const children = React.cloneElement(this.props.children, {
//             log: this.log
//         });
//         return (
//             <div>
//                 {children}
//             </div>
//         );
//     }
// }
//
//
// //OTHER PEOPLES PROFILES
//
// // Create two components, one for the logged in users profile and a second for all other users.
// //
// // //Friends
// //
// // Data that needs to be passed to the button:
// //     - The status of the friendship, stored in a database.
// //         - Who made the request and who received it and the status.
// //         - Make a friend requests table.
// //         - CREATE TABLE friend_status(
// //             id SERIAL PRIMARY KEY,
// //             sender_id INTEGER NOT NULL,
// //             recipient_id INTERGER NOT NULL,
// //             status (this could be done with numbers, 1=pending, 2= accepted, 3=cancelled, 4=terminated) INTEGER NOT NULL,
// //             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// //             updated_at TIMESTAMP
// //           );
// //     - To feed the data into the friend button component, pass the id of the other user as a prop and do a db query to get the status of the friendship.
// //
// // Clicking on the button:
// //     - The button needs to make an ajax request.
// //     - Change the state when clicked.
// //
// // //csurf
// //
// // <Redirect from='*' to='/' />
//
//
// // //REDUX
// //
// // A global place for storing state information.
// // Currently app.js is acting like a redux system. All user info flows through there.
// //
// // Actions represent any occurrence that should result in a change in your application's state.
// //
// // function updateBio(bio) {
// //     return {
// //         type: 'UPDATE_BIO',
// //         bio: bio
// //     };
// // }
// //
// // After you create an action, you send it to a reducer.
// //
// // Reducers are pure functions.
// //
// // Pure functions are functions that do not change anything that they did not create.
// //
// // Redux changes the state by creating a whole new state and replacing the pevious one with the new one.
// //
// // There is onyl one reducer is your app  ut because it can get quite big it can be split up.
// //
// // -Store:
// //     -The store holds the state.\
// //
// // Middleware:
// //     -Redux promise
// //
// //
// // Redux flow:
// //     -Starts in the action whch is a function that returns an object (action is where we do post and get requests).
// //     -That whole object travels to the reducer.
// //     -The reducer looks at changes made to the state and changes just those parts of the page not thw whole thing.
// //     -The reducer creates the new state (the state is never directly changed, the state is cloned and changes are made to that).
// //     -In Object.assign in the reducer the first argument is an empty object, then the current state, then the properties of the state that you want to change.
// //     -The reducer send the new state to the store which then sends it out to the app.
// //     -The state is received by the mapStateToProps function.
// //     -Then use the connect function to bring it all together.
// //     -Connect runs and we pass it mapStateToProps and then pass all that to the component.
// //
// // In Redux in componentDidMount we dont make an axios call instead we have to dispatch an action.
// //
// // React state and Redux state are different.
// //
// // mapDispatchToProps - recieves the dispatch function as an argument (dispatch function is not something you need to define)
// //
// //
// //
// // Friends Page
// // Need a new route in the router
//
//
// //SOCKET
//
// in socket.js:
//
// import * as io from 'socket.io-client';
// import { userJoined } from './actions'
// import { store } from './start.js'
//
//
// let socket;
//
// function getSocket() {
//     if (socket) {
//         socket = io.connect();
//         socket.on('connect', () => {
//             axios.get('/connected/' + socket.id)
//         })
//         socket.on('userJoined', () => {
//             store.dispatch(userJoined(data))
//         })
//     }
//     return socket;
// }
//
// export getSocket as socket;
//
// in
//
// import { socket } from './socket';
//
// class App extends React.component {
//     componentDidMount() {
//         socket();
//     }
// }
//
// //ONLINE users
//
// Make an online route
//
// server.js - import server.io, pass app
//           - change app.listen to server.listening
//           - handle io.connection and hook up on socket a disconnet event or you can hook up disconnect event in the /connected/:socketid
//           - make an empty array to store online users
//           - /connect/:socketid
//             - add to online users array an object with the socket id and the user id
//             - emit event to the socket that just connected with the full list of the online users in the payload - db query
//             - broadcast to everybody userjoined event with info about only the user who just connect ONLY IF the user was not already in the list
//           - in disconnect event, remove obj with the socket id from list of online users
//           - in disconnet event handler, emit to all sockets the id of the user who disconnected only if user is no longer in list
//
//         app.get('/connected/:socketId', (req, res) => {
//             const ids = onlineUsers.map(id => obj.userId)
//             db.getUsers(ids).then((users) => {
//                 io.sockets.socket[socketId].emit('onlineUsers', {
//                     users
//                 })
//             })
//         })
//
//         in the db:
//
//         function getUsersByIds(arrayOfIds) {
//             const query = `SELECT * FROM users WHERE id = ANY($1)`;
//             return db.query(query, [arrayOfIds]);
//         }
//
// start.js - export store
//
// app.js or start.js - import socket initializing function and call it only if user is logged in
//
// socket.js - import store
//           - export function to initialize socket connection, function should make sure it doesnt initialize if it has already initialized
//           - initalization
//             - io.connected
//             - axios request to /connected/ + socket id
//             - socket.on for onlineUsers, userJoined, userLeft
//             - all event handlers should idspatch actions
//
// online.js - connected component that shows online users from global state
//
//
// //CHAT
//
// -Add messages to the store.
// -Make a UI that shows messages.
// -WHen user hits enter a socket.emit needs to happen.
//
// this.elem.scrollTop = this.elem.scrollHeight - this.elem.clientHeight
// componentDidUpdate()
//
// class Chat extends React.Component {
//     componentDidUpdate() {
//         this.elem.scrollTop = this.elem.scrollHeight - this.elem.clientHeight
//     }
//     render() {
//         return (
//             <div ref={elem => this.elem = elem} id="chat-messages"></div>
//         )
//     }
// }


//SYMBOLS

var s = Symbol('my symbol')

// An alternative for naming properties

var obj = {
    name: 'leo',
    [s]: 42
}

// You know that the name you've created is unique.
// It's hard to find the symbol key.
// The only way to see the symbol is with .getOwnPropertySymbols()

//SETS AND MAPS

// Sets and maps are new way of storing data like arrays and objects. Sets can only contain unique values.
// You cant call set without new.

const s = new Set;

s.add(10);
s.add(20);
s.add(30);

console.log(s); // Set {10, 20, 30}

s.add(10);

console.log(s); // Set {10, 20, 30} - ignores the second add 10.

// Sets are iterable.
// They don't have a length property, they have size instead.


// Maps are like objects, key value pairs.
// In maps the key can be anything, not just a string or a symbol. Can be an object.

// Map must be called with new.


// WEAK MAP AND WEAK SET


//ASYNC functions

async funcion myAsyncFunc(){
    return 10
}

myAsyncFunc().then((val) => {
    console.log(val);
})

//Do this if you want to make a function into a promise.

async funcion myAsyncFunc(){
    var data = await getProm();
    console.log(data);
}

function getProm() {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve('yep')
        }, 1500)
    })
}
