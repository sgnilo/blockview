import { useEffect, useState } from 'react';
import './profile.less';

const Profile = props => {
    const {name} = props;
    const [photo, setPhoto] = useState('');

    useEffect(() => {
        name && setPhoto(name.split('')[0]);
    }, [name]);
    return <div className="user-profile">
        <div className="user-photo">{photo}</div>
        <div className="user-name">{name}</div>
    </div>
};


export default Profile;