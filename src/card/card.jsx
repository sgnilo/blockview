import {useEffect, useState} from 'react';
import './card.less';

const Card = props => {
    const {height, width, title} = props;
    const [style, setStyle] = useState({});
    useEffect(() => {
        setStyle({
            height,
            width
        })
    }, [height, width]);
    return <div className="card-wrapper" style={style}>
        {title && <div className="card-title">{title}</div>}
        {props.children}
    </div>
};


export default Card;