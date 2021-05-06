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

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user') || '{}');
        if (user.user && user.time && user.time + 300000 > new Date().getTime()) {
            cache.setCache('userName', user.user);
        }
        setNickName(cache.getCache('userName'));
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
                cache.setCache('userName', username);
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
                    cache.setCache('userName', username);
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


    return <div className="home-wrapper">
        <div className="home-head">
            <div className="name-area" onClick={loginOrRegister}>
                {nickName ? <Profile name={nickName} /> : '注册/登陆'}
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