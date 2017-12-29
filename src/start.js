import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory, browserHistory } from 'react-router';
import Welcome from './welcome.js';
import Register from './register.js';
import Login from './login.js';
import App from './app.js'
import Profile from './profile.js'
import OtherUser from './otheruser.js'
import Friends from './friends.js'
import { createStore, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducer.js';
import { Provider } from 'react-redux'
import { getSocket } from './socket.js';
export const store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)));

let router;

const notLoggedInRouter = (
    <Router history={hashHistory}>
        <Route path="/" component={Welcome}>
            <Route path="/login" component={Login} />
            <IndexRoute component={Register} />
  	    </Route>
    </Router>
);


if (location.pathname === '/welcome') {
    router = notLoggedInRouter;
} else {
    getSocket()
    const loggedInRouter = (
        <Provider store={store}>
            <Router history={browserHistory}>
                <Route path="/" component={App}>
                    <Route path="/user/:id" component={OtherUser} />
                    <IndexRoute component={Profile} />
          	    </Route>
            </Router>
        </Provider>
    );
    router = loggedInRouter;
}


ReactDOM.render(router, document.querySelector('main'));
