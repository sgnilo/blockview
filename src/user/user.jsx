import {useEffect, useState, useRef} from 'react';
import Card from '../card/card.jsx';
import cache from '../util/cache';
import './user.less';
import Profile from '../profile/profile.jsx';
import toast from '../toast/toast';
import Ajax from '../util/request';
import Popup from '../popup/popup.jsx';

const examples = [
    {type: 1, color: '#28b5b5', describ: '加入了我们～', tip: '注册系统'},
    {type: 2, color: '#344fa1', describ: '生成了一个新的版权。', tip: '注册版权'},
    {type: 3, color: '#ff8882', describ: '转让了一个版权。', tip: '转让版权'}
];

const User = props => {


    const [userName, setUserName] = useState('--');
    const [timeStr, setTime] = useState('');
    const [psdVerifyed, setPsdVerifyState] = useState(false);
    const [psd ,setPsd] = useState('');
    const [registerTime, setRegisterTime] = useState('');
    const [productList, setProductList] = useState([]);
    const [actions, setActions] = useState([]);
    const [actionPopup, setActionPopup] = useState(false);
    const [productName, setProductName] = useState('');
    const [productDesc, setProductDesc] = useState('');
    const [uploadFile, setUploadFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [upLoadPopup, setUploadPopup] = useState(false);
    const [hasFinishUpload, setUploadState] = useState(false);
    const [uploadPersent, setUploadPercent] = useState(0);
    const [productPopup, setProductPopup] = useState(false);
    const [activeProduct, setActiveProduct] = useState(null);
    const [query, setQuery] = useState('');

    const computeTime = () => {
        const date = new Date();
        setTime(`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);
        setTimeout(computeTime, 1000);
    };

    const getData = () => {
        Ajax.get({url: 'http://localhost:3000/getuserinfo'})
        .then(res => {
            const {user_name, register_time, product_list, actions: his} = res.data;
            setUserName(user_name);
            const date = Math.ceil((new Date().getTime() - parseInt(register_time)) / 86400000);
            setRegisterTime(date);
            setProductList(product_list.map(item => ({...item, block: JSON.parse(item.product_block)})));
            const newHis = his.map(action => {
                const {color, describ} = examples.filter(example => example.type === action.action_type)[0];
                const tempDate = new Date(parseInt(action.time));
                return {...action, color, describ, dateStr: tempDate.toLocaleDateString(), timeStr: tempDate.toLocaleTimeString()};
            });
            setActions(newHis);
        })
        .catch(err => toast.fail({content: err.errMsg}));
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        let name = uploadFile ? uploadFile.name : '';
        if (name.length > 12) {
            const arr = name.split('');
            name = arr.slice(0, 4).join('') + '···' + arr.slice(-6).join('');
        }
        setFileName(name);
    }, [uploadFile]);


    const inPutPsd = e => {
        setPsd(e.target.value);
    }

    const verifyPsd = () => {
        if (!psd) {
            toast.fail({content: '请填写密码！'});
            return;
        }
        if (!psdVerifyed) {
            Ajax.post({url: 'http://localhost:3000/verifypsd', psd})
            .then(res => {
                toast.success({content: res.errMsg});
                setPsdVerifyState(true);
                setPsd('');
                document.querySelector('#psd-update').value = '';
            }).catch(err => toast.fail({content: err.errMsg}));
        } else {
            Ajax.post({url: 'http://localhost:3000/updatepsd', psd})
            .then(res => {
                toast.success({content: res.errMsg});
                setPsdVerifyState(false);
                setPsd('');
                document.querySelector('#psd-update').value = '';
            })
            .catch(err => toast.fail({content: err.errMsg}));
        }
    }

    const quit = () => {
        sessionStorage.removeItem('user');
        cache.setCache('userName', undefined);
        document.cookie = '';
        toast.success({content: '已退出'});
        setTimeout(() => {
            location.hash = '/';
        }, 2000);
    }

    const closeActionPopup = () => {
        setActionPopup(false);
    }
    const showActionPopup = () => {
        setActionPopup(true);
    };

    const inPutProductName = e => {
        setProductName(e.target.value);
    };
    const inPutProductDesc = e => {
        setProductDesc(e.target.value);
    };
    const inPutFile = e => {
        setUploadFile(e.target.files[0]);
    };

    const uploadProduct = () => {
        if (!productName || !productDesc || !uploadFile) {
            toast.fail({content: '请先完善版权相关信息！'});
            return;
        }
        const data = new FormData();
        data.append('productName', productName);
        data.append('productDesc', productDesc);
        data.append('productFile', uploadFile);
        setUploadPopup(true);
        Ajax.upload({
            url: 'http://localhost:3000/uploadproduct',
            data,
            uploadListener(context) {
                context.onprogress = e => {
                    const {total, loaded} = e;
                    setUploadPercent(((loaded / total) * 100).toFixed(2));
                };
                context.onload = () => {
                    setUploadState(true);
                };
                context.onerror = context.onabort = context.ontimeout = () => {
                    toast.fail({content: '上传失败！'});
                    setTimeout(closeUploadPopup, 2000);
                }
            }
        }).then(res => console.log(res)).catch(err => toast.fail({copntent: err.errMsg}));
    };

    const closeUploadPopup = () => {
        if (hasFinishUpload) {
            setUploadPopup(false);
            setUploadState(false);
            setProductName('');
            setProductDesc('');
            setUploadFile(null);
            document.querySelector('#product-name').value = '';
            document.querySelector('#product-desc').value = '';
            document.querySelector('#product-file').value = '';
            getData();
        } else {
            toast.fail({content: '正在上传，请勿进行其他操作'});
        }
    };

    const checkProductDetail = detail => {
        console.log(detail);
        const date = new Date(detail.block.head.timestamp);
        const timeStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        setActiveProduct({...detail, timeStr});
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
    return <div>
        <div className="left-block">
            <div className="left-top-block">
                <Card height="35vh" width="35vw" title={'Profile'}>
                    <div className="profile-box">
                        <div className="name-block">
                            <Profile name={userName} />
                            <div className="quit" onClick={quit}>退出</div>
                        </div>
                        <p className="register-tip">这是您加入我们的第{registerTime}天！</p>
                        <div className="fix-psd">
                            <span>修改密码</span>
                            <input id="psd-update" className="input-label fix-psd-input" type="password" onInput={inPutPsd} placeholder={psdVerifyed ? '请输入新密码' : '请输入原密码'} />
                            <div className="fix-psd-button" onClick={verifyPsd}>
                                {psdVerifyed ? '修改' : '验证'}
                            </div>
                        </div>
                    </div>
                </Card>
                <Card title="Upload" height="47vh" width="35vw">
                    <div className="upload-box">
                        <input id="product-name" className="input-label product-name" type="text" onInput={inPutProductName} placeholder={'版权名称'} />
                        <textarea id="product-desc" rows={3} className="input-label product-describ" type="text" onInput={inPutProductDesc} placeholder={'版权描述'} />
                        <div className="upload-bottom">
                            <div className="upload-file">
                                <div className="mock-input-file">选择文件</div>
                                <input id="product-file" className="input-file" type="file" onInput={inPutFile} placeholder={'选择文件'} />
                                {fileName && <span>{fileName}</span>}
                            </div>
                            <div className="upload-btn" onClick={uploadProduct}>上传</div>
                        </div>
                        {upLoadPopup && <Popup onClose={closeUploadPopup} maskClose={false}>
                            <div className="upload-status-box">
                                {hasFinishUpload && uploadPersent == 100 ? <div className="upload-success-box">
                                    <div className="upload-success-icon">
                                        <svg t="1620306427160" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7550" width="200" height="200"><path d="M409.429333 637.866667l337.92-337.92a34.133333 34.133333 0 1 1 48.213334 48.298666l-361.984 362.026667a34.005333 34.005333 0 0 1-48.298667 0L228.394667 553.386667a34.133333 34.133333 0 0 1 48.298666-48.298667l132.693334 132.778667zM512 947.2c240.341333 0 435.2-194.858667 435.2-435.2 0-240.341333-194.858667-435.2-435.2-435.2C271.658667 76.8 76.8 271.658667 76.8 512c0 240.341333 194.858667 435.2 435.2 435.2z m0 76.8C229.248 1024 0 794.752 0 512S229.248 0 512 0s512 229.248 512 512-229.248 512-512 512z" fill="#1afa29" p-id="7551"></path></svg>
                                    </div>
                                    <div className="upload-success-tip">上传成功，一段时间后将会自动生成版权。</div>
                                </div> : <div className="uploading-box">
                                    <div className="progress-box">
                                        <div className="progress" style={{width: `${uploadPersent * 400 * 0.01}px`}}></div>
                                    </div>
                                    <div className="progress-content">正在上传···（{uploadPersent}%）</div>
                                </div>}
                            </div>
                        </Popup>}
                    </div>
                </Card>
            </div>
        </div>
        <div className="right-block">
            <div className="search-block">
                <Card title={'Search'}>
                    <div className="search-input-box">
                        <input className="input-label search-input" type="text" onInput={inPutWd} placeholder='通过关键字搜索相关版权' />
                        <div className="search-button" onClick={search}>
                            <svg t="1620206667278" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6603" width="200" height="200"><path d="M918.63 873.37L670.99 625.74c-0.44-0.5-0.89-0.98-1.36-1.46-12.5-12.49-32.76-12.49-45.25 0.01C573 675.69 504.68 704 432 704c-149.98 0-272-122.02-272-272s122.02-272 272-272 272 122.02 272 272c0 24.26-3.19 48.3-9.48 71.46-4.63 17.06 5.44 34.64 22.5 39.27 17.05 4.63 34.63-5.44 39.27-22.5C764.06 491.61 768 461.92 768 432c0-45.35-8.89-89.35-26.42-130.8-16.92-40.01-41.15-75.94-71.99-106.79s-66.78-55.07-106.79-71.99C521.35 104.89 477.35 96 432 96s-89.35 8.89-130.8 26.42c-40.01 16.92-75.94 41.15-106.79 71.99s-55.07 66.78-71.99 106.79C104.89 342.65 96 386.65 96 432s8.89 89.35 26.42 130.8c16.92 40.01 41.15 75.94 71.99 106.79s66.78 55.07 106.79 71.99C342.65 759.11 386.65 768 432 768c45.36 0 89.38-8.89 130.83-26.43 30.15-12.76 57.98-29.66 83.06-50.42l227.48 227.48c6.25 6.25 14.44 9.37 22.63 9.37s16.38-3.12 22.63-9.37c12.49-12.5 12.49-32.76 0-45.26z" p-id="6604"></path></svg>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="right-left-block">
                <Card title={'My Product'} width="25vw">
                    <div className="product-list-box">
                        {(productList && productList[0]) ? productList.map((item, index) => (index < 5 ? <div className="product">
                            <div className="product-content">
                                <div className="product-name">{item.product_name}</div>
                                <div className="product-desc">{item.product_disc}</div>
                            </div>
                            <div className={`${item.block.hasBlock ? 'block-green-status' : 'block-yellow-status'}`} onClick={() => checkProductDetail(item)}>
                                <span></span>{item.block.hasBlock ? '查看版权' : '版权生成中'}
                            </div>
                        </div> : '')) : <div className="no-product-tip">还没有属于您的版权呢，多多上传吧～</div>}
                        {productList && productList.length > 5 && <div className="more-product" onClick={() => setProductPopup(true)}>点击查看更多</div>}
                        {productPopup && <Popup onClose={() => setProductPopup(false)} maskClose={false}>
                            <div className="product-list-box popup-product-list">
                                {(productList && productList[0]) ? productList.map(item => <div className="product">
                                <div className="product-content">
                                    <div className="product-name">{item.product_name}</div>
                                    <div className="product-desc">{item.product_disc}</div>
                                </div>
                                <div className={`${item.block.hasBlock ? 'block-green-status' : 'block-yellow-status'}`} onClick={() => checkProductDetail(item)}>
                                    <span></span>{item.block.hasBlock ? '查看版权' : '版权生成中'}
                                </div>
                            </div>) : <div className="no-product-tip">还没有属于您的版权呢，多多上传吧～</div>}
                            </div>
                        </Popup>}
                        {activeProduct && <Popup onClose={() => setActiveProduct(null)}>
                            <div className="product-info-box">
                                <div className="product-name">{activeProduct.product_name}</div>
                                <div className="product-desc">{activeProduct.product_disc}</div>
                                <div className="product-info-line">
                                    <div className="info-label">版权所属：</div>
                                    <div className="info-value user-color">@{activeProduct.block.userName}</div>
                                </div>
                                <div className="product-info-line">
                                    <div className="info-label">文件内容MD5：</div>
                                    <div className="info-value">{activeProduct.product_file}</div>
                                </div>
                                <div className="product-info-line">
                                    <div className="info-label">所在区块：</div>
                                    <div className="info-value height-color">{activeProduct.block.height}</div>
                                </div>
                                <div className="product-info-line">
                                    <div className="info-label">注册时间：</div>
                                    <div className="info-value">{activeProduct.timeStr}</div>
                                </div>
                                <div className="product-info-line">
                                    <div className="info-label">前一区块：</div>
                                    <div className="info-value">{activeProduct.block.head.preBlock}</div>
                                </div>
                                <div className="product-info-line">
                                    <div className="info-label">配置版本：</div>
                                    <div className="info-value version-color">V{activeProduct.block.head.version}</div>
                                </div>
                            </div>
                        </Popup>}
                    </div>
                </Card>
            </div>
            <div className="right-right-block">
                <Card title={'History'} width="25vw">
                    <div className="history-box">
                        <div className="example-tip">
                            {examples.map(example =>
                                (<div className="example">
                                    <div className="example-point" style={{background: example.color}}></div>
                                    <div className="example-describ">{example.tip}</div>
                                </div>
                            ))}
                        </div>
                        <div className="action-list">
                            {actions.map((action, index, arr) => (index < 6 ? <div className="action">
                                {index < arr.length - 1 && <div className="bottom-line"></div>}
                                {index > 0 && <div className="top-line"></div>}
                                <div className="action-color" style={{background: action.color}}></div>
                                <span>{action.dateStr} {action.timeStr}</span> {action.describ}
                            </div> : ''))}
                            {actions.length > 6 && <div className="more-action" onClick={showActionPopup}>点击查看更多</div>}
                        </div>
                        {actionPopup && <Popup onClose={closeActionPopup}>
                            <div className="action-list">
                                {actions.map((action, index, arr) => <div className="action">
                                    {index < arr.length - 1 && <div className="bottom-line"></div>}
                                    {index > 0 && <div className="top-line"></div>}
                                    <div className="action-color" style={{background: action.color}}></div>
                                    <span>{action.dateStr} {action.timeStr}</span> {action.describ}
                                </div>)}
                            </div>
                        </Popup>}
                    </div>
                </Card>
            </div>
        </div>
    </div>;
};


export default User;