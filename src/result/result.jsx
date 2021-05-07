import {useState, useEffect} from 'react';
import cache from '../util/cache';
import Ajax from '../util/request';
import toast from '../toast/toast';
import Popup from '../popup/popup.jsx';
import './result.less';

const Result = props => {

    const [query, setQuery] = useState('');
    const [productList, setProductList] = useState([]);
    const [activeProduct, setActiveProduct] = useState(null);

    useEffect(() => {
        const wd = cache.getCache('query');
        if (wd) {
            setQuery(wd);
            getList(wd);
        }
    }, []);

    const inPutWd = e => {
        setQuery(e.target.value);
    }

    const getList = wd => {
        Ajax.get({url: 'http://localhost:3000/getproductlist', name: wd})
        .then(res => {
            const products = res.data.map(item => {
                const {block} = item;
                const date = new Date(block.head.timestamp);
                const timeStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
                return {...item, timeStr};
            });
            setProductList(products);
        })
        .catch(err => toast.fail({content: err.errMsg}));
    };

    const search = () => {
        if (query) {
            getList(query);
        } else {
            toast.fail({content: '无效输入！'});
        }
    }
    return <div className="result-box">
        <div className="result-head">
            <div className="back-btn" onClick={() => history.back()}>
                <svg t="1620384412659" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10244" width="200" height="200"><path d="M648 307.2H217.6l128-128c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0L118.4 315.2c-6.4 6.4-9.6 14.4-9.6 22.4s3.2 16 9.6 22.4l180.8 180.8c12.8 12.8 32 12.8 44.8 0 12.8-12.8 12.8-32 0-44.8l-124.8-124.8h428.8c120 0 216 96 216 216s-96 216-216 216H320c-17.6 0-32 14.4-32 32s14.4 32 32 32h328c155.2 0 280-124.8 280-280s-124.8-280-280-280z" fill="#4A576A" p-id="10245"></path></svg>
            </div>
            <div className="result-search-box">
                <div className="search-input-box">
                    <input className="input-label search-input" type="text" onInput={inPutWd} placeholder='通过关键字搜索相关版权' />
                    <div className="search-button" onClick={search}>
                        <svg t="1620206667278" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6603" width="200" height="200"><path d="M918.63 873.37L670.99 625.74c-0.44-0.5-0.89-0.98-1.36-1.46-12.5-12.49-32.76-12.49-45.25 0.01C573 675.69 504.68 704 432 704c-149.98 0-272-122.02-272-272s122.02-272 272-272 272 122.02 272 272c0 24.26-3.19 48.3-9.48 71.46-4.63 17.06 5.44 34.64 22.5 39.27 17.05 4.63 34.63-5.44 39.27-22.5C764.06 491.61 768 461.92 768 432c0-45.35-8.89-89.35-26.42-130.8-16.92-40.01-41.15-75.94-71.99-106.79s-66.78-55.07-106.79-71.99C521.35 104.89 477.35 96 432 96s-89.35 8.89-130.8 26.42c-40.01 16.92-75.94 41.15-106.79 71.99s-55.07 66.78-71.99 106.79C104.89 342.65 96 386.65 96 432s8.89 89.35 26.42 130.8c16.92 40.01 41.15 75.94 71.99 106.79s66.78 55.07 106.79 71.99C342.65 759.11 386.65 768 432 768c45.36 0 89.38-8.89 130.83-26.43 30.15-12.76 57.98-29.66 83.06-50.42l227.48 227.48c6.25 6.25 14.44 9.37 22.63 9.37s16.38-3.12 22.63-9.37c12.49-12.5 12.49-32.76 0-45.26z" p-id="6604"></path></svg>
                    </div>
                </div>
            </div>
        </div>
        <div className="result-product-list">
            {(productList && productList[0]) ? productList.map(item => <div className="result" onClick={() => setActiveProduct(item)}>
                <div className="author">@{item.block.userName}</div>
                <div className="result-title">{item.product_name}</div>
                <div className="result-text">{item.product_disc}</div>
            </div>) : (query ? <div className="no-result">目前还没有相关结果哦～</div> : '')}
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
    </div>;
};


export default Result;