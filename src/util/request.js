const createXHR = () => {
    let ajax;
    if (window.XMLHttpRequest) {
        ajax = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        ajax = new ActiveXObject('Microsoft.XMLHTTP');
    }
    return ajax;
};

const preProcessRes = (res, resolve, reject) => {
    const result = typeof res === 'string' ? JSON.parse(res) : res;
    result.errno ? reject(result) : resolve(result);
};

const getUrlString = param => {
    const {url} = param;
    delete param['url'];
    let paramList = [];
    for (let key in param) {
        paramList.push(`${key}=${param[key]}`);
    }
    return `${url}?${paramList.join('&')}`;
};

export default {
    get(params) {
        const xhr = createXHR();
        if (xhr) {
            return new Promise((resolve, reject) => {
                xhr.open('GET', getUrlString(params));
                xhr.withCredentials = true;
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        preProcessRes(xhr.response, resolve, reject);
                    } else if (xhr.readyState === 4) {
                        reject(xhr.response);
                    }
                };
                xhr.send();
            }).catch(err => {
                if (err.errno === 3) {
                    sessionStorage.removeItem('userName');
                    location.hash = '/'
                } else {
                    return err;
                }
            });
        } else {
            return this.jsonp(params);
        }
    },
    post(params) {
        const xhr = createXHR();
        if (xhr) {
            return new Promise((resolve, reject) => {
                const {url} = params;
                xhr.open('POST', url);
                xhr.withCredentials = true;
                xhr.setRequestHeader('content-type', 'application/json');
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        preProcessRes(xhr.response, resolve, reject);
                    } else if (xhr.readyState === 4) {
                        reject(xhr.response);
                    }
                };
                xhr.send(JSON.stringify(params));
            }).catch(err => {
                if (err.errno === 3) {
                    sessionStorage.removeItem('userName');
                    location.hash = '/'
                } else {
                    return err;
                }
            });
        } else {
            return this.jsonp(params);
        }
    },
    jsonp(params) {
        const cbName = `cb_${new Date().getTime()}`;
        const url = getUrlString({...params, callback: cbName});
        const script = document.createElement('script');
        script.src = url;
        return new Promise((resolve, reject) => {
            document.body.appendChild(script);
            window[cbName] = res => {
                document.body.removeChild(script);
                delete window[cbName];
                preProcessRes(res, resolve, reject);
            };
        });
    }
};
