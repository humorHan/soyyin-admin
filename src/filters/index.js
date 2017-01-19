/*时间戳转化为时间格式*/
export function dateFormat(time, type = 'toMinute') {
    if (!time) {
        return '';
    }
    const set_time = new Date(time);
    let y = set_time.getFullYear();
    let m = String(set_time.getMonth()+1);
    let d = String(set_time.getDate());
    var h = String(set_time.getHours());
    var i = String(set_time.getMinutes());
    var s = String(set_time.getSeconds());
    if (m.length === 1) {
        m = "0" + m;
    }
    if (d.length === 1) {
        d = "0" + d;
    }
    if (h.length === 1) {
        h = "0" + h;
    }
    if (i.length === 1) {
        i = "0" + i;
    }
    if (s.length === 1) {
        s = "0" + s;
    }
    if (type === 'toDate') {
        return `${y}-${m}-${d}`;
    } else if (type === 'toHour') {
        return `${y}-${m}-${d} ${h}`;
    } else if (type === 'toMinute') {
        return `${y}-${m}-${d} ${h}:${i}`;
    } else if (type === 'toSecond') {
        return `${y}-${m}-${d} ${h}:${i}:${s}`;
    }
    return '';
}

//对日期输入框进行双向过滤
export var datePickerFilter = {
    //双向过滤器
    read(val) {
        return dateFormat(val, 'toDate');
    },
    write(val, oldVal) {
        if (!val) return 0;
        var dates = val.split('-');
        var date = new Date();
        date.setFullYear(dates[0], dates[1] - 1, dates[2]);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
    }
};

//数组去重
export function unique(arr) {
    let result = [];
    let hash = {};
    if (!arr.length) {
        return result;
    }
    arr.forEach((current) => {
        if (!hash[current.id]) {
            result.push(current);
            hash[current.id] = 1;
        }
    })
    return result;
}

//七牛上传的文件地址前缀
export function getQiniuUrl(key) {
    return "http://source.soyyin.com/" + key;
}

//把接口的price字段变成实际显示的钱数：2230 -》 22.30
export function realPrice(p) {
    if (!p) {
        return p;
    }
    return (p / 100 + '');
}

//把输入的价格转换成接口字段：22.30 -》2230
export function dataPrice(s) {
    var value = parseFloat(s);
    if (!value) {
        return 0;
    }
    return Math.round(value * 100);
}

//对input输入框进行双向过滤
export var priceFilter = {
    //双向过滤器
    read(val) {
        return realPrice(val);
    },
    write(val, oldVal) {
        var number = val.replace(/[^\d.-]/g, '');
        return dataPrice(number);
    }
};

//订单状态
export function orderStatusFilter(orderStatus) {
    var orderStatusMap = {
        SUBMITTED: "订单已提交",
        DELIVERY_CONFIRMED: "商家已接单",
        DELIVERY_PAID: "付款成功",
        ONLINE_PAID: "付款成功",
        ONLINE_CONFIRMED: "商家已接单",
        FINISHED: "订单已完成",
        CANCELED: "订单已取消",
    }
    return orderStatusMap[orderStatus];
};

//发票状态
export function invoiceStatusFilter(invoiceStatus) {
    var invoiceStatusMap = {
        WAIT_INVOICING: '待开票',
        WAIT_DELIVERY: '待配送',
        FINISHED: '已完成',
    }
    return invoiceStatusMap[invoiceStatus];
};

//制作状态
export function produceStatusFilter(produceStatus) {
    var produceStatusMap = {
        NOT_PRODUCE: '尚未生产',
        PRODUCING: '制作中',
        COST_ACCOUNTING: '成本核算中',
        COMPLETE: '制作完成',
    }
    return produceStatusMap[produceStatus];
};

//退款类型
export function refundTypeFilter(refundType) {
    var refundTypeMap = {
        BY_HAND: '人工申请退款',
        TRANSACTION_FAILED: '交易失败自动退款',
        CANCELED: '取消订单自动退款',
    }
    return refundTypeMap[refundType];
};

//退款状态
export function refundStatusFilter(refundStatus) {
    var refundStatusMap = {
        WAITING: '待退款',
        PINGXX_PENDING: 'Ping++退款中',
        FINISHED: '已完成',
    }
    return refundStatusMap[refundStatus];
};

//退款渠道
export function refundWayFilter(refundWay) {
    var refundWayMap = {
        BANK_TRANSFER: '银行转账',
        ALIPAY_TRANSFER: '支付宝转账',
        PINGXX: 'Ping++支付',
    }
    return refundWayMap[refundWay];
};

