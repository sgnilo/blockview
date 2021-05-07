import {useEffect, useState} from 'react';
import Popup from '../popup/popup.jsx';
import './home.less';
import cache from '../util/cache';
import toast from '../toast/toast';
import Ajax from '../util/request';
import Profile from '../profile/profile.jsx';

const Home = props => {
    const [isLogin, setIsLoginState] = useState(true);
    const [hasPopup, setPopupState] = useState(false);
    const [name, setName] = useState('');
    const [psd, setPsd] = useState('');
    const [repeatPsd, setRepeatPsd] = useState('');
    const [nickName, setNickName] = useState('');
    const [query, setQuery] = useState('');

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user') || '{}');
        if (user.user && user.time && user.time + 300000 > new Date().getTime()) {
            setNickName(user.name);
            console.log(user.name);
            // cache.setCache('userName', user.user);
        }
    }, []);

    const loginOrRegister = () => {
        if (cache.getCache('userName')) {
            location.hash = '/user';
        } else {
            setPopupState(true);
        }
    };

    const onPopupClose = e => {
        setPopupState(false);
    };

    const inputName = e => {
        setName(e.target.value);
    }

    const inputPsd = e => {
        setPsd(e.target.value);
    }

    const inputRepeatPsd = e => {
        setRepeatPsd(e.target.value);
    }

    const switchMode = mode => {
        setRepeatPsd('');
        setIsLoginState(mode);
    }

    const login = () => {
        if (name && psd) {
            Ajax.post({url: 'http://localhost:3000/login', name, psd})
            .then(res => {
                const {username} = res.data;
                // cache.setCache('userName', username);
                sessionStorage.setItem('user', JSON.stringify({
                    user: username,
                    time: new Date().getTime()
                }));
                setNickName(username);
                window.location.hash = '/user';
            })
            .catch(err => toast.fail({content: err.errMsg}));
        } else {
            toast.fail({content: '用户名或密码未填写'});
        }
    };

    const register = () => {
        if (name && psd && repeatPsd) {
            if (psd !== repeatPsd) {
                toast.fail({content: '两次密码填写不一致！'});
            } else {
                Ajax.post({url: 'http://localhost:3000/register', name, psd})
                .then(res => {
                    const {username} = res.data;
                    // cache.setCache('userName', username);
                    sessionStorage.setItem('user', JSON.stringify({
                        user: username,
                        time: new Date().getTime()
                    }));
                    setNickName(username);
                    window.location.hash = '/user';
                })
                .catch(err => toast.fail({content: err.errMsg}));
            }
        } else {
            toast.fail({content: '请填写所有项目！'});
        }
    };

    const inPutWd = e => {
        setQuery(e.target.value);
    };

    const search = () => {
        if (query) {
            cache.setCache('query', query);
            location.hash = '/result';
        } else {
            toast.fail({content: '无效输入！'});
        }
    };


    return <div className="home-wrapper">
        <div className="home-head">
            <div className="name-area" onClick={loginOrRegister}>
                {nickName ? <Profile name={nickName} /> : <div className="login">Pro</div>}
            </div>
        </div>
        <div className="home-search-box">
            <div className="search-input-box">
                <input className="input-label search-input" type="text" onInput={inPutWd} placeholder='通过关键字搜索相关版权' />
                <div className="search-button" onClick={search}>
                    <svg t="1620206667278" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6603" width="200" height="200"><path d="M918.63 873.37L670.99 625.74c-0.44-0.5-0.89-0.98-1.36-1.46-12.5-12.49-32.76-12.49-45.25 0.01C573 675.69 504.68 704 432 704c-149.98 0-272-122.02-272-272s122.02-272 272-272 272 122.02 272 272c0 24.26-3.19 48.3-9.48 71.46-4.63 17.06 5.44 34.64 22.5 39.27 17.05 4.63 34.63-5.44 39.27-22.5C764.06 491.61 768 461.92 768 432c0-45.35-8.89-89.35-26.42-130.8-16.92-40.01-41.15-75.94-71.99-106.79s-66.78-55.07-106.79-71.99C521.35 104.89 477.35 96 432 96s-89.35 8.89-130.8 26.42c-40.01 16.92-75.94 41.15-106.79 71.99s-55.07 66.78-71.99 106.79C104.89 342.65 96 386.65 96 432s8.89 89.35 26.42 130.8c16.92 40.01 41.15 75.94 71.99 106.79s66.78 55.07 106.79 71.99C342.65 759.11 386.65 768 432 768c45.36 0 89.38-8.89 130.83-26.43 30.15-12.76 57.98-29.66 83.06-50.42l227.48 227.48c6.25 6.25 14.44 9.37 22.63 9.37s16.38-3.12 22.63-9.37c12.49-12.5 12.49-32.76 0-45.26z" p-id="6604"></path></svg>
                </div>
            </div>
        </div>
        {hasPopup && <Popup maskClose={false} onClose={onPopupClose}>
            <div className="user-box">
                {isLogin ? <div className="login-box">
                    <p className="box-title">登录</p>
                    <input className="text-input" type="text" onInput={inputName} placeholder="请输入用户名" />
                    <input className="text-input" type="password" onInput={inputPsd} placeholder="请输入密码" />
                    <div className="box-button" onClick={login}>登录</div>
                    <p className="box-bottom-tip">
                        还未拥有账户？
                        <span className="to-another" onClick={() => switchMode(false)}>去注册</span>
                    </p>
                </div> : <div className="register-box">
                    <p className="box-title">注册</p>
                    <input className="text-input" type="text" onInput={inputName} placeholder="请输入用户名" />
                    <input className="text-input" type="password" onInput={inputPsd} placeholder="请输入密码" />
                    <input className="text-input" type="password" onInput={inputRepeatPsd} placeholder="请再次输入密码" />
                    <div className="box-button" onClick={register}>注册</div>
                    <p className="box-bottom-tip">
                        已拥有账户？
                        <span className="to-another" onClick={() => switchMode(true)}>去登录</span>
                    </p>
                </div>}
            </div>
        </Popup>}
    </div>;
};


export default Home;