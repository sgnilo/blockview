import {useState} from 'react';
import {Link} from 'react-router-dom';

const Home = props => {
    return <div>
        主页
        <Link to='/user' >去用户页</Link>
    </div>;
};


export default Home;