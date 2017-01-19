<!-- supplier.vue -->
<template>
    <div class="container-fluid">
        <ul class="breadcrumb">
            <li>订单系统</li>
            <li>供应商分配</li>
        </ul>
        <ul class="nav nav-pills">
            <li :class="{'active': orderType === 'FROM_WEB'}" v-if="permissionList.soyyinOrderList"><a @click="getList('FROM_WEB', type)">酱印网订单</a></li>
            <li :class="{'active': orderType === 'MY_CREATED'}" v-if="permissionList.createByMeOrderList"><a @click="getList('MY_CREATED', type)">由我创建</a></li>
            <li :class="{'active': orderType === 'ALL'}" v-if="permissionList.allOrderList"><a @click="getList('ALL', type)">全部订单</a></li>
        </ul>
        <p class="clearfix"></p>
        <ul class="nav nav-pills">
            <li :class="{'active': type === 'NOT_ASSIGNED'}" v-if="this.permissionList.soyyinOrderList || this.permissionList.createByMeOrderList || this.permissionList.allOrderList"><a @click="getList(orderType, 'NOT_ASSIGNED')">待分配</a></li>
            <li :class="{'active': type === 'ASSIGNED'}" v-if="this.permissionList.soyyinOrderList || this.permissionList.createByMeOrderList || this.permissionList.allOrderList"><a @click="getList(orderType, 'ASSIGNED')">已分配</a></li>
        </ul>
        <p class="clearfix"></p>
        <table class="table order-thead-table" style="margin-bottom:0px;">
            <thead>
                <tr style="height:40px;background-color:#eee;">
                    <th style="width:6%;">序号</th>
                    <th style="width:13%;">订单日期</th>
                    <th style="width:18%;">订单编号</th>
                    <th style="width:15%;">客户经理/客服</th>
                    <th style="width:40%;">客户名称/公司</th>
                    <th style="width:8%;">操作</th>
                </tr>
            </thead>
        </table>
        <div style="margin-left:15px;">
            <table class="table product-thead-table">
                <thead>
                    <tr style="background-color:#eee;font-size:14px;">
                        <th style="width:6%;">ID</th>
                        <th style="width:10%;">产品名称</th>
                        <th style="width:22%;">参数</th>
                        <th style="width:8%;">数量</th>
                        <th style="width:14%;">到货时间要求</th>
                        <th style="width:10%;">供应商*</th>
                        <th style="width:10%;">制作负责人*</th>
                        <th style="width:10%;">成本(元)</th>
                        <th style="width:10%;">操作</th>
                    </tr>
                </thead>
            </table>
        </div>
        <template v-for="orderItem in orderList">
            <table class="table table-bordered table-hover order-table" style="margin-bottom:0px;">
                <tbody>
                    <tr style="height:45px;">
                        <td style="width:6%;"><b>{{$index + 1}}</b></td>
                        <td style="width:13%;">{{orderItem.time | dateFormat 'toDate'}}</td>
                        <td style="width:18%;"><a class="btn-link" v-link="{path:'/order/detail/'+orderItem.id}" target="_blank">{{orderItem.id}}</a></td>
                        <td style="width:15%;">{{orderItem.manager ? orderItem.manager.display_name : ''}}</td>
                        <td style="width:40%;">{{orderItem.customer.name + (orderItem.customer.company ? '/' + orderItem.customer.company : '')}}</td>
                        <td style="width:8%;"><a class="btn-link" @click="showOrHideOrderItem(orderItem)">{{orderItem.showAll ? '收起' : '展开'}}</a></td>
                    </tr>
                </tbody>
            </table>
            <div style="margin-left:15px;margin-bottom:15px;">
                <table class="table table-bordered table-hover product-table" style="margin-bottom:0px;">
                    <tbody>
                        <tr v-for="item of orderItem.items">
                            <td style="width:6%;">{{item.id}}</td>
                            <template v-if="item.is_custom">
                                <td style="width:10%;">{{item.detail.name}}</td>
                                <td style="width:22%;">{{item.detail.size}}{{(item.detail.size && (item.detail.caizhi || item.detail.others)) ? '_' : ''}}{{item.detail.caizhi}}{{(item.detail.caizhi && item.detail.others) ? '_' : ''}}{{item.detail.others}}</td>
                                <td style="width:8%;">{{item.detail.quantity}}</td>
                            </template>
                            <template v-else>
                                <td style="width:10%;">
                                    <a class="btn-link" :href="'http://www.soyyin.com/product?id='+item.product_id+'#'+item.brief" target="_blank">{{item.title}}</a>
                                </td>
                                <td style="width:22%;">{{item.brief}}</td>
                                <td style="width:8%;">{{item.quantity}}</td>
                            </template>
                            <td style="width:14%;">{{item.arrival_time}}</td>
                            <td style="width:10%;" v-if="!item.assigning">{{item.supplier ? item.supplier.name : ''}}</td>
                            <td style="width:10%;" v-else>
                                <select class="form-control input-sm" v-model="item.assigningSupplier" number>
                                    <option v-for="supplier of supplierList" :value="supplier.id">{{supplier.name}}</option>
                                </select>
                            </td>
                            <td style="width:10%;" v-if="!item.assigning">{{item.producer ? item.producer.name : ''}}</td>
                            <td style="width:10%;" v-else>
                                <select class="form-control input-sm" v-model="item.assigningProducer" number>
                                    <option v-for="producer of producerList" :value="producer.id">{{producer.display_name}}</option>
                                </select>
                            </td>
                            <td style="width:10%;" v-if="!item.assigning">{{item.cost | realPrice}}</td>
                            <td style="width:10%;" v-else>
                                <input class="form-control input-sm" type="text" name="assigningCost" v-model="item.assigningCost | priceFilter">
                            </td>
                            <td style="width:10%;" v-if="!item.assigning"><a class="btn-link" v-if="permissionList.assignSupplier && item.produce_status !== 'COMPLETE' && (orderItem.status === 'DELIVERY_CONFIRMED' || orderItem.status === 'DELIVERY_PAID' || orderItem.status === 'ONLINE_CONFIRMED')" @click="changeToEditSupplierStatus(item)">分配供应商</a></td>
                            <td style="width:10%;" v-else>
                                <a class="btn-link" @click="assignSupplier(item)">确定</a>
                                <a class="btn-link" style="margin-left:15px;" @click="cancelEdit(item)">取消</a>  
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="panel panel-default" style="margin-bottom:0px;" v-show="orderItem.showAll">
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h4>收货信息</h4>
                                <template v-for="consigneeItem in orderItem.consignees">
                                    <p>{{$index+1}}. 收货地址：{{consigneeItem.address}}</p>
                                    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收货备注：{{consigneeItem.remark}}</p>
                                </template>
                            </div>
                            <div class="col-md-5">
                                <h4>备注信息</h4>
                                <p>{{orderItem.remark}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <a class="btn btn-primary" v-if="sinceId" @click="getList(orderType, type, sinceId)">查看更多</a>
        <popup-tips :show.sync="dataForPopupTips.show" :tips-type="dataForPopupTips.type" :tips-title="dataForPopupTips.title" :tips-content="dataForPopupTips.content"></popup-tips>
    </div>
</template>

<script>
import Vue from 'vue'
import popupTips from '../../components/popupTips.vue'
import { callback } from '../../store'
import { unique } from '../../filters'
import { orderValidator } from '../../store/dataValidator.js'
import { permissionValidator } from '../../store/rolePermission.js'
import $ from 'jquery'

export default {
    name: 'AssignSupplierView',
    components: {
        popupTips,
    },
    data() {
        return {
            userId: parseInt($.cookie("id")),
            orderType: '',
            type: '',
            sinceId: '',
            orderList: [],
            permissionList: {
                soyyinOrderList: permissionValidator.orderSystem.supplier.soyyinOrderList(),
                createByMeOrderList: permissionValidator.orderSystem.supplier.createByMeOrderList(),
                allOrderList: permissionValidator.orderSystem.supplier.allOrderList(),
                assignSupplier: permissionValidator.orderSystem.supplier.assignSupplier(),
            },
            supplierList: [],
            producerList: [],
            dataForPopupTips: {
                show: false,
                type: 'danger',
                title: '',
                content: '',
            },
        }
    },
    ready() {
        if (this.permissionList.soyyinOrderList) {
            this.getList('FROM_WEB', 'NOT_ASSIGNED');
        } else if (this.permissionList.createByMeOrderList) {
            this.getList('MY_CREATED', 'NOT_ASSIGNED');
        } else if (this.permissionList.allOrderList) {
            this.getList('ALL', 'NOT_ASSIGNED');
        }
        if ((this.permissionList.soyyinOrderList || this.permissionList.createByMeOrderList || this.permissionList.allOrderList) && this.permissionList.assignSupplier) {
            this.getSuppliers();
            this.getProducers();
        }
    },
    methods: {
        findSupplier(id) {
            for (var i = 0; i < this.supplierList.length; i++) {
                if (this.supplierList[i].id === id) {
                    return this.supplierList[i];
                }
            }
        },
        findProducer(id) {
            for (var i = 0; i < this.producerList.length; i++) {
                if (this.producerList[i].id === id) {
                    return this.producerList[i];
                }
            }
        },
        getSuppliers() {
            var url = '/api/v2/admin/suppliers/brief-list';
            this.$http.get(url)
            .then((response) => {
                if(!response.data.result || response.data.result === 0){
                    this.supplierList = response.data.suppliers;
                } else {
                    callback.success(response.data);
                }
            },(response) => {
                callback.error(response);
            });
        },
        getProducers() {
            var url = '/api/v2/admin/permissions/producer-list';
            this.$http.get(url)
            .then((response) => {
                if(!response.data.result || response.data.result === 0){
                    this.producerList = response.data.data;
                } else {
                    callback.success(response.data);
                }
            },(response) => {
                callback.error(response);
            });
        },
        getList(orderType, type, sinceId) {
            var url = '/api/v2/admin/suppliers/order-list?limit=50&order_by=TIME&type=' + type + '&order_type=' + orderType;
            if (sinceId) {
                url += '&since_id=' + sinceId;
            }
            this.$http.get(url)
            .then((response) => {
                if (!response.data.result || response.data.result === 0) {
                    var arr = [];
                    if(sinceId){
                        arr = this.orderList.concat(response.data.orders);
                    } else {
                        arr = response.data.orders;
                    }
                    this.orderList = unique(arr);
                    this.orderType = orderType;
                    this.type = type;
                    this.$set("sinceId", response.data.since_id || '');
                } else {
                    callback.success(response.data);
                }
            },(response) => {
                callback.error(response);
            })
        },
        showOrHideOrderItem(orderItem) {
            if (orderItem.showAll === undefined) {
                Vue.set(orderItem, 'showAll', true);
            } else {
                orderItem.showAll = !orderItem.showAll;
            }
        },
        changeToEditSupplierStatus(productItem) {
            productItem.assigningSupplier = productItem.supplier ? productItem.supplier.id : undefined;
            if (productItem.producer) {
                productItem.assigningProducer = productItem.producer.id;
            } else {
                let flag = false;
                for (let i = 0; i < this.producerList.length; i++) {
                    if (this.producerList[i].id === this.userId) {
                        productItem.assigningProducer = this.producerList[i].id;
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    productItem.assigningProducer = undefined;
                }
            }
            Vue.set(productItem, 'assigningCost', productItem.cost);
            if (productItem.assigning === undefined) {
                Vue.set(productItem, 'assigning', true);
            } else {
                productItem.assigning = true;
            }
        },
        cancelEdit(productItem) {
            productItem.assigning = false;
        },
        validateSupplier(productItem) {
            var result = orderValidator.validateProductCost(productItem.assigningCost, true);
            if (!result.ok) {
                return result.errorMsg;
            }
            if (!productItem.assigningSupplier) {
                return "请选择供应商";
            }
            if (!productItem.assigningProducer) {
                return "请选择制作负责人";
            }
            return;
        },
        assignSupplier(productItem) {
            var result = this.validateSupplier(productItem);
            if (result) {
                this.dataForPopupTips.show = true;
                this.dataForPopupTips.title = '输入有误';
                this.dataForPopupTips.content = result;
                return;
            }
            var url = '/api/v2/admin/suppliers/assign-supplier?item_id=' + productItem.id;
            var data = {
                supplier_id: productItem.assigningSupplier,
                producer_id: productItem.assigningProducer,
            };
            if (productItem.assigningCost) {
                data.cost = productItem.assigningCost;
            }
            this.$http.post(url, data)
            .then((response) => {
                if(!response.data.result || response.data.result === 0) {
                    var supplier = this.findSupplier(data.supplier_id);
                    var producer = this.findProducer(data.producer_id);
                    if (supplier) {
                        productItem.supplier = {
                            id: supplier.id,
                            name: supplier.name,
                        };
                    }
                    if (producer) {
                        productItem.producer = {
                            id: producer.id,
                            name: producer.display_name,
                        };
                    }
                    productItem.cost = data.cost;
                    productItem.assigning = false;
                } else {
                    callback.success(response.data);
                }
            },(response) => {
                callback.error(response);
            });
        },
    }
}
</script>

<style scoped>
.nav-pills > li > a{
    cursor: pointer;
}

.order-table, .order-thead-table, .product-table, .product-thead-table{
    table-layout: fixed;
}

.order-table td, .order-thead-table th, .product-table td, .product-thead-table th {
    text-align: center;
    vertical-align: middle;
}

.order-table td .btn-link, .product-table td .btn-link, .btn-link {
    text-decoration: none;
    cursor: pointer;
}

.order-table td .btn-link:hover, .product-table td .btn-link:hover, .btn-link:hover {
    text-decoration: underline;
}
</style>