import $ from 'jquery'

//判断是否登录
export function checkLogin() {
    if (!$.cookie('display_name')) {
        location.href = "./index.html";
        return false;
    }
    return true;
}

//ajax错误的回调函数处理情况
export var callback = {
    success: function (data) {
        if (data.result === 8) {
            alert("没有权限");
            location.href = "index.html";
        } else if (data.error_message) {
            alert(data.error_message);
        } else if (data.result === 5) {
            alert("此条目不存在");
            location.reload();
        } else if (data.result === 6) {
            alert("不被允许的操作");
        } else {
            alert(data.result);
            location.href = 'main.html';
        }
    },
    error: function (request) {
        console.log(request);
        if (request.status === 503) {
            alert("Opps！酱油服务器正在维护中，请耐心等待，很快就好哦！");
        } else if (request.status === 403) {
            alert("用户身份验证失败");
        } else {
            alert("出错了，" + request.status + "," + request.statusText);
        }   
        location.href = "index.html";
    }
}

export var localStore = {
    fetch: function (storeName) {
        return JSON.parse(localStorage.getItem(storeName));
    },
    save: function (storeName,storeVal) {
        localStorage.setItem(storeName,JSON.stringify(storeVal));
    },
    delete: function (storeName) {
        localStorage.removeItem(storeName);
    },
    clear: function () {
        localStorage.clear();
    },
}

export var sessionStore = {
    fetch: function (storeName) {
        return JSON.parse(sessionStorage.getItem(storeName));
    },
    save: function (storeName,storeVal) {
        sessionStorage.setItem(storeName,JSON.stringify(storeVal));
    },
    delete: function (storeName) {
        sessionStorage.removeItem(storeName);
    },
    clear: function () {
        sessionStorage.clear();
    },
}