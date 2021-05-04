import React, {useState, useEffect} from 'react';
import './assets/css/reset.css';
import './assets/css/index.css';
import Home from './home/home.jsx';
import User from './user/user.jsx';
import Result from './result/result.jsx';
import {HashRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import cache from './util/cache';

function App(props) {

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user') || '{}');
        if (user.user && user.time && user.time + 300000 > new Date().getTime()) {
            cache.setCache('userName', user.user);
        }
    }, []);

    return <div className="all-wrapper">
        <div id="toast">
            <div className="toast-icon">
                <svg className="success-icon icon" t="1620147196867" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3262" width="200" height="200"><path d="M512 960C264.6 960 64 759.4 64 512S264.6 64 512 64s448 200.6 448 448-200.6 448-448 448z m0-821.3c-206.2 0-373.3 167.1-373.3 373.3S305.8 885.3 512 885.3 885.3 718.2 885.3 512 718.2 138.7 512 138.7z m-9.1 547.2c-14.6 14.6-38.2 14.6-52.7 0-2.7-2.9-4.9-6.2-6.5-9.7L305 533.3c-14.6-14.6-14.6-38.2-0.1-52.8 14.6-14.6 38.2-14.6 52.8-0.1l0.7 0.7 120.1 123.6 229.3-229.3c14.8-14.3 38.5-13.9 52.8 0.9 14 14.5 14 37.4 0 51.8L502.9 685.9z" p-id="3263" fill="#1afa29"></path></svg>
                <svg className="fail-icon icon" t="1620147314209" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5739" width="200" height="200"><path d="M639.6 685.9c-11.5 0-22.9-4.4-31.7-13.1L351.2 416c-17.5-17.5-17.5-45.9 0-63.4s45.9-17.5 63.4 0l256.7 256.7c17.5 17.5 17.5 45.9 0 63.4-8.8 8.8-20.3 13.2-31.7 13.2z" fill="#d81e06" p-id="5740"></path><path d="M382.8 685.9c-11.5 0-22.9-4.4-31.7-13.1-17.5-17.5-17.5-45.9 0-63.4l256.7-256.7c17.5-17.5 45.9-17.5 63.4 0s17.5 45.9 0 63.4L414.5 672.7c-8.7 8.8-20.2 13.2-31.7 13.2z" fill="#d81e06" p-id="5741"></path><path d="M511.2 960.7c-114.8 0-229.5-43.7-316.9-131.1-174.8-174.8-174.8-459.1 0-633.9C369 21 653.4 21 828.1 195.8c174.8 174.8 174.8 459.1 0 633.9-87.3 87.3-202.1 131-316.9 131z m0-806.4c-91.8 0-183.6 35-253.5 104.8-139.8 139.8-139.8 367.3 0 507.1s367.3 139.8 507.1 0 139.8-367.3 0-507.1C694.9 189.3 603 154.3 511.2 154.3z m285.3 643.6h0.2-0.2z" fill="#d81e06" p-id="5742"></path></svg>
            </div>
            <div className="toast-content"></div>
        </div>
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