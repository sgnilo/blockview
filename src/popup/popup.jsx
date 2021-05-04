import {useState} from 'react';
import './popup.less';

const Popup = props => {
    const {maskClose = true, onClose} = props;

    const maskClosePopup = e => {
        e.stopPropagation();
        maskClose && onClose && onClose(e);
    };

    const closePopup = e => {
        e.stopPropagation();
        onClose && onClose(e);
    };

    return <div className="popup-mask" onClick={maskClosePopup}>
        <div className="popup-board">
            <div className="popup-close-btn" onClick={closePopup}>
                <svg t="1620142528243" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1127" width="200" height="200"><path d="M583.168 523.776L958.464 148.48c18.944-18.944 18.944-50.176 0-69.12l-2.048-2.048c-18.944-18.944-50.176-18.944-69.12 0L512 453.12 136.704 77.312c-18.944-18.944-50.176-18.944-69.12 0l-2.048 2.048c-19.456 18.944-19.456 50.176 0 69.12l375.296 375.296L65.536 899.072c-18.944 18.944-18.944 50.176 0 69.12l2.048 2.048c18.944 18.944 50.176 18.944 69.12 0L512 594.944 887.296 970.24c18.944 18.944 50.176 18.944 69.12 0l2.048-2.048c18.944-18.944 18.944-50.176 0-69.12L583.168 523.776z" p-id="1128"></path></svg>
            </div>
            {props.children}
        </div>
    </div>
};


export default Popup;