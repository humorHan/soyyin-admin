<!-- making.vue -->
<template>
    <div class="container-fluid">
        <ul class="breadcrumb">
            <li>订单系统</li>
            <li>制作管理</li>
        </ul>
        <ul class="nav nav-pills">
            <li :class="{'active': type === 'ASSIGNED'}" v-if="permissionList.assignToMeOrderList"><a @click="getList('ASSIGNED')">指派给我</a></li>
            <li :class="{'active': type === 'ALL'}" v-if="permissionList.allOrderList"><a @click="getList('ALL')">全部</a></li>
        </ul>
        <p class="clearfix"></p>
        <form class="form-inline" style="margin-bottom:10px;" v-if="permissionList.assignToMeOrderList || permissionList.allOrderList">
            <label class="control-label" for="fitlerType">筛选：</label>
            <select class="form-control input-sm" id="fitlerType" style="width:80px;" v-model="filterType">
                <option value="customer">客户信息</option>
                <option value="supplier">供应商</option>
                <option value="manager">客户经理</option>
            </select>
            <input v-if="filterType === 'customer'" class="form-control input-sm" style="width:120px;margin-left:20px;" type="text" placeholder="请输入客户信息" v-model="customerKeyword">
            <template v-else>
                <select v-if="filterType === 'supplier'" class="form-control input-sm" style="width:120px;margin-left:20px;" v-model="supplierChoosed" number>
                    <option value="0">全部</option>
                    <option v-for="supplier of supplierList" :value="supplier.id">{{supplier.name}}</option>
                </select>
                <select v-else class="form-control input-sm" style="width:120px;margin-left:20px;" v-model="managerChoosed" number>
                    <option value="0">全部</option>
                    <option v-for="manager of managerList" :value="manager.id">{{manager.display_name}}</option>
                </select>
            </template>
            <a class="btn btn-info btn-sm" style="margin-left:30px;padding:6px 20px;" @click="getList(type, '', getFilterParams())">查询</a>
        </form>
        <h5 v-show="filterParams.customer || filterParams.managerId || filterParams.supplierId">{{getQueryDesc()}}</h5>
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
                        <th style="width:8%;">产品名称</th>
                        <th style="width:17%;">参数</th>
                        <th style="width:8%;">数量</th>
                        <th style="width:9%;">到货时间要求</th>
                        <th style="width:8%;">印刷文件</th>
                        <th style="width:8%;">供应商</th>
                        <th style="width:8%;">制作负责人</th>
                        <th style="width:10%;">制作状态</th>
                        <th style="width:8%;">成本(元)</th>
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
                                <td style="width:8%;">{{item.detail.name}}</td>
                                <td style="width:17%;">{{item.detail.size}}{{(item.detail.size && (item.detail.caizhi || item.detail.others)) ? '_' : ''}}{{item.detail.caizhi}}{{(item.detail.caizhi && item.detail.others) ? '_' : ''}}{{item.detail.others}}</td>
                                <td style="width:8%;">{{item.detail.quantity}}</td>
                            </template>
                            <template v-else>
                                <td style="width:8%;">
                                    <a class="btn-link" :href="'http://www.soyyin.com/product?id='+item.product_id+'#'+item.brief" target="_blank">{{item.title}}</a>
                                </td>
                                <td style="width:17%;">{{item.brief}}</td>
                                <td style="width:8%;">{{item.quantity}}</td>
                            </template>
                            <td style="width:9%;">{{item.arrival_time}}</td>
                            <td style="width:8%;"><a class="btn-link" v-if="item.file" :href="item.file.file_key | getQiniuUrl" target="_blank">{{item.file.file_name}}</a></td>
                            <td style="width:8%;">{{item.supplier ? item.supplier.name : ''}}</td>
                            <td style="width:8%;">{{item.producer ? item.producer.name : ''}}</td>
                            <td style="width:10%;" v-if="!item.assigning">{{item.produce_status | produceStatusFilter}}</td>
                            <td style="width:10%;" v-else>
                                <select class="form-control input-sm" v-model="item.assigningProduceStatus">
                                    <option value="NOT_PRODUCE">尚未生产</option>
                                    <option value="PRODUCING">制作中</option>
                                    <option value="COST_ACCOUNTING">成本核算中</option>
                                    <option value="COMPLETE">制作完成</option>
                                </select>
                            </td>
                            <td style="width:8%;" v-if="!item.assigning">{{item.cost | realPrice}}</td>
                            <td style="width:8%;" v-else>
                                <input class="form-control input-sm" type="text" name="assigningCost" v-model="item.assigningCost | priceFilter">
                            </td>
                            <td style="width:10%;" v-if="!item.assigning"><a class="btn-link" v-if="permissionList.editProduceStatus && item.supplier && (orderItem.status === 'DELIVERY_CONFIRMED' || orderItem.status === 'DELIVERY_PAID' || orderItem.status === 'ONLINE_CONFIRMED')" @click="changeToEditProduceStatus(item)">编辑</a></td>
                            <td style="width:10%;" v-else>
                                <a class="btn-link" @click="assignProduceStatus(item)">确定</a>
                                <a class="btn-link" style="margin-left:15px;" @click="cancelEdit(item)">取消</a>  
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="panel panel-default" style="margin-bottom:0px;" v-show="orderItem.showAll">
                    <div class="panel-body">
                        <div>
                            <h4>备注信息</h4>
                            <p>{{orderItem.remark ? orderItem.remark : '无'}}</p>
                            <h4>发货物流</h4>
                            <template v-for="consigneeItem of orderItem.consignees">
                                <consignee-info-with-logistics :index="$index" :consignee-item="consigneeItem" :can-add-logistics="permissionList.recordLogistics && (orderItem.status === 'DELIVERY_CONFIRMED' || orderItem.status === 'DELIVERY_PAID' || orderItem.status === 'ONLINE_CONFIRMED')"></consignee-info-with-logistics>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <a class="btn btn-primary" v-if="sinceId" @click="getList(type, sinceId, filterParams)">查看更多</a>
        <record-logistics-dialog :show.sync="dataForRecordLogisticsDialog.show" :data="dataForRecordLogisticsDialog.data"></record-logistics-dialog>
        <popup-tips :show.sync="dataForPopupTips.show" :tips-type="dataForPopupTips.type" :tips-title="dataForPopupTips.title" :tips-content="dataForPopupTips.content"></popup-tips>
    </div>
</template>

<script>
import Vue from 'vue'
import popupTips from '../../components/popupTips.vue'
import consigneeInfoWithLogistics from './comp/consigneeInfoWithLogistics.vue'
import recordLogisticsDialog from './comp/recordLogisticsDialog.vue'
import { callback } from '../../store'
import { unique } from '../../filters'
import { orderValidator } from '../../store/dataValidator.js'
import { permissionValidator } from '../../store/rolePermission.js'

export default {
    name: 'OrderMakingView',
    components: {
        popupTips,
        consigneeInfoWithLogistics,
        recordLogisticsDialog,
    },
    data() {
        return {
            type: '',
            sinceId: '',
            orderList: [],
            permissionList: {
                assignToMeOrderList: permissionValidator.orderSystem.making.assignToMeOrderList(),
                allOrderList: permissionValidator.orderSystem.making.allOrderList(),
                editProduceStatus: permissionValidator.orderSystem.making.editProduceStatus(),
                recordLogistics: permissionValidator.orderSystem.making.recordLogistics(),
            },
            filterType: 'customer',
            customerKeyword: '',
            supplierChoosed: 0,
            supplierList: [],
            managerChoosed: 0,
            managerList: [],
            filterParams: {
                customer: '',
                supplierId: 0,
                managerId: 0,
            },
            dataForRecordLogisticsDialog: {
                show: false,
                data: {
                    consigneeId: '',
                    deliveryMethod: '',
                    express: '',
                    expressOrderId: '',
                    logisticsCost: '',
                    logisticsRemark: '',
                },
            },
            dataForPopupTips: {
                show: false,
                type: 'danger',
                title: '',
                content: '',
            },
        }
    },
    ready() {
        var getFilterItemsFlag = true;
        if (this.permissionList.assignToMeOrderList) {
            this.getList('ASSIGNED');
        } else if (this.permissions.allOrderList) {
            this.getList('ALL');
        } else {
            getFilterItemsFlag = false;
        }
        if (getFilterItemsFlag) {
            this.getManager();
            this.getSupplier();
        }
    },
    events: {
        'click-to-add-logistics'(consigneeItem) {
            this.dataForRecordLogisticsDialog.show = true;
            this.dataForRecordLogisticsDialog.data.consigneeId = consigneeItem.id;
            this.dataForRecordLogisticsDialog.data.deliveryMethod = '';
            this.dataForRecordLogisticsDialog.data.express = '';
            this.dataForRecordLogisticsDialog.data.expressOrderId = '';
            this.dataForRecordLogisticsDialog.data.logisticsCost = '';
            this.dataForRecordLogisticsDialog.data.logisticsRemark = '';
            this.dataForRecordLogisticsDialog.data.passingData = consigneeItem;
        },
        'add-logistics'(data, consigneeItem) {
            consigneeItem.logistics.push({
                id: '',
                create_time: (new Date()).getTime(),
                delivery_method: data.delivery_method,
                express: data.express,
                express_order_id: data.express_order_id,
                cost: data.cost,
                remark: data.remark,
            });
        },
    },
    methods: {
        getList(type, sinceId, filterParams) {
            var url = '/api/v2/admin/produce/order-list?limit=50&order_by=TIME&type=' + type;
            if (sinceId) {
                url += '&since_id=' + sinceId;
            }
            if (filterParams) {
                if (filterParams.customer) {
                    url += '&customer=' + filterParams.customer;
                } else if (filterParams.supplierId) {
                    url += '&supplier_id=' + filterParams.supplierId;
                } else if (filterParams.managerId) {
                    url += '&manager_id=' + filterParams.managerId;
                } 
            }
            this.$http.get(url)
            .then((response) => {
                if (!response.data.result || response.data.result === 0) {
                    var arr = [];
                    if (sinceId) {
                        arr = this.orderList.concat(this.preprocessData(response.data.orders, filterParams));
                    } else {
                        arr = this.preprocessData(response.data.orders, filterParams);
                    }
                    this.orderList = unique(arr);
                    this.type = type;
                    this.$set("sinceId", response.data.since_id || '');
                    if (filterParams) {
                        this.filterParams = filterParams;
                    } else {
                        this.filterParams = {
                            customer: '',
                            supplierId: 0,
                            managerId: 0,
                        };
                    }
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
        changeToEditProduceStatus(productItem) {
            productItem.assigningProduceStatus = productItem.produce_status;
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
        validateProduceStatus(productItem) {
            var result = orderValidator.validateProductCost(productItem.assigningCost, productItem.assigningProduceStatus === 'COMPLETE' ? false : true);
            if (!result.ok) {
                return result.errorMsg;
            }
            return;
        },
        assignProduceStatus(productItem) {
            var result = this.validateProduceStatus(productItem);
            if (result) {
                this.dataForPopupTips.show = true;
                this.dataForPopupTips.title = '输入有误';
                this.dataForPopupTips.content = result;
                return;
            }
            var url = '/api/v2/admin/produce/update-status?item_id=' + productItem.id;
            var data = {
                status: productItem.assigningProduceStatus,
            };
            if (productItem.assigningCost) {
                data.cost = productItem.assigningCost;
            }
            this.$http.post(url, data)
            .then((response) => {
                if(!response.data.result || response.data.result === 0) {
                    productItem.produce_status = data.status;
                    productItem.cost = data.cost;
                    productItem.assigning = false;
                } else {
                    callback.success(response.data);
                }
            },(response) => {
                callback.error(response);
            });
        },
        getManager() {
            var url = '/api/v2/admin/permissions/manager-list';
            this.$http.get(url)
            .then((response) => {
                if(!response.data.result || response.data.result === 0){
                    this.managerList = response.data.data;
                } else {
                    callback.success(response.data);
                }
            },(response) => {
                callback.error(response);
            })
        },
        getManagerName(managerId) {
            for (let i = 0; i < this.managerList.length; i++) {
                if (this.managerList[i].id === managerId) {
                    return this.managerList[i].display_name;
                }
            }
            return '';
        },
        getSupplier() {
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
        getSupplierName(supplierId) {
            for (let i = 0; i < this.supplierList.length; i++) {
                if (this.supplierList[i].id === supplierId) {
                    return this.supplierList[i].name;
                }
            }
            return '';
        },
        getFilterParams() {
            var filterParams = {
                customer: '',
                supplierId: 0,
                managerId: 0,
            };
            if (this.filterType === 'customer') {
                filterParams.customer = this.customerKeyword;
            } else if (this.filterType === 'supplier') {
                filterParams.supplierId = this.supplierChoosed;
            } else {
                filterParams.managerId = this.managerChoosed;
            }
            return filterParams;
        },
        getQueryDesc() {
            if (!this.filterParams.customer && !this.filterParams.supplierId && !this.filterParams.managerId) {
                return;
            }
            if (this.filterParams.customer) {
                return '客户信息 {' + this.filterParams.customer + '} 的查询结果：';
            }
            if (this.filterParams.supplierId) {
                return '供应商 {' + this.getSupplierName(this.filterParams.supplierId) + '} 的查询结果：';
            }
            if (this.filterParams.managerId) {
                return '客户经理 {' + this.getManagerName(this.filterParams.managerId) + '} 的查询结果：';
            }
        },
        preprocessData(orderList, filterParams) {
            if (filterParams && filterParams.supplierId) {
                for (let i = 0; i < orderList.length; i++) {
                    let items = [];
                    let productItems = orderList[i].items;
                    for (let j = 0; j < productItems.length; j++) {
                        if (productItems[j].supplier && productItems[j].supplier.id === filterParams.supplierId) {
                            items.push(productItems[j]);
                        }
                    }
                    orderList[i].items = items;
                }
            }
            return orderList;
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