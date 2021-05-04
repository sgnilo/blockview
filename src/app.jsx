import React, {useState, useEffect} from 'react';
import './assets/css/reset.css';
import './assets/css/index.css';
import Home from './home/home.jsx';
import User from './user/user.jsx';
import Result from './result/result.jsx';
import {HashRouter as Router, Route, Switch, Redirect} from 'react-router-dom';

function App(props) {

    return <div className="all-wrapper">
        <Router >
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/user" component={User} />
                <Route path="/result" component={Result} />
                <Redirect to='/' />
            </Switch>
        </Router>
    </div>
};

export default <App />;