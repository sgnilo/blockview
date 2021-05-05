import {useEffect, useState} from 'react';
import Card from '../card/card.jsx';
import cache from '../util/cache';
import './user.less';
import Profile from '../profile/profile.jsx';

const User = props => {

    const [userName, setUserName] = useState('');
    const [timeStr, setTime] = useState('');

    const computeTime = () => {
        const date = new Date();
        setTime(`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);
        setTimeout(computeTime, 1000);
    };

    useEffect(() => {
        const name = cache.getCache('userName') || JSON.parse(sessionStorage.getItem('user') || '{}').user;
        setUserName(name);
        computeTime();
    }, []);
    return <div>
        <div className="left-block">
            <div className="left-top-block">
                {/* {userName && <div className="hello-block">
                    <Card title={`你好，${userName}！`} />
                    <Card title={timeStr} />
                </div>} */}
                <Card height="50vh" width="35vw" title={'Profile'}>
                    <div className="profile-box">
                        <Profile name={userName} />
                    </div>
                </Card>
                <Card title="Upload" width="35vw">
                    <div className="upload-box">

                    </div>
                </Card>
            </div>
        </div>
        <div className="right-block">
            <div className="search-block">
                <Card title={'Search'}>
                    <div className="search-input-box">
                        <input className="input-label search-input" type="text" placeholder='通过关键字搜索相关版权' />
                        <div className="search-button">
                            <svg t="1620206667278" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6603" width="200" height="200"><path d="M918.63 873.37L670.99 625.74c-0.44-0.5-0.89-0.98-1.36-1.46-12.5-12.49-32.76-12.49-45.25 0.01C573 675.69 504.68 704 432 704c-149.98 0-272-122.02-272-272s122.02-272 272-272 272 122.02 272 272c0 24.26-3.19 48.3-9.48 71.46-4.63 17.06 5.44 34.64 22.5 39.27 17.05 4.63 34.63-5.44 39.27-22.5C764.06 491.61 768 461.92 768 432c0-45.35-8.89-89.35-26.42-130.8-16.92-40.01-41.15-75.94-71.99-106.79s-66.78-55.07-106.79-71.99C521.35 104.89 477.35 96 432 96s-89.35 8.89-130.8 26.42c-40.01 16.92-75.94 41.15-106.79 71.99s-55.07 66.78-71.99 106.79C104.89 342.65 96 386.65 96 432s8.89 89.35 26.42 130.8c16.92 40.01 41.15 75.94 71.99 106.79s66.78 55.07 106.79 71.99C342.65 759.11 386.65 768 432 768c45.36 0 89.38-8.89 130.83-26.43 30.15-12.76 57.98-29.66 83.06-50.42l227.48 227.48c6.25 6.25 14.44 9.37 22.63 9.37s16.38-3.12 22.63-9.37c12.49-12.5 12.49-32.76 0-45.26z" p-id="6604"></path></svg>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="right-left-block">
                <Card title={'My Product'} width="25vw">
                    <div className="product-list-box"></div>
                </Card>
            </div>
            <div className="right-right-block">
                <Card title={'History'} width="25vw">
                    <div className="history-box"></div>
                </Card>
            </div>
        </div>
    </div>;
};


export default User;