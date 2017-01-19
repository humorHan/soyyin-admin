<!-- invoice.vue -->
<template>
    <div class="container-fluid">
        <ul class="breadcrumb">
            <li>订单系统</li>
            <li>订单管理</li>
            <li>合并开票</li>
        </ul>
        <div class="pull-right">
            <a class="btn btn-info btn-sm" v-if="permissionList.applyInvoice" :disabled="chosenOrders.length === 0" @click="clickToApplyInvoice">申请开票</a>
            <a class="btn btn-info btn-sm" v-link="{path: '/order/list'}">取消</a>
        </div>
        <ul class="nav nav-pills">
            <li :class="{'active': type === 'UNHANDLED'}" v-if="permissionList.soyyinOrderList"><a @click="getList('UNHANDLED')">未处理酱印网订单</a></li>
            <li :class="{'active': type === 'ASSIGNED'}" v-if="permissionList.myOrderList"><a @click="getList('ASSIGNED')">我的订单</a></li>
            <li :class="{'active': type === 'CREATED'}" v-if="permissionList.createByMeOrderList"><a @click="getList('CREATED')">由我创建</a></li>
            <li :class="{'active': type === 'ALL'}" v-if="permissionList.allOrderList"><a @click="getList('ALL')">全部订单</a></li>
        </ul>
        <p class="clearfix"></p>
        <form class="form-inline" style="margin-bottom:10px;" v-if="permissionList.soyyinOrderList || permissionList.myOrderList || permissionList.createByMeOrderList || permissionList.allOrderList">
            <label class="control-label" for="fitlerType">筛选：</label>
            <select class="form-control input-sm" id="fitlerType" style="width:80px;" v-model="filterType">
                <option value="customer">客户信息</option>
                <option value="manager">客户经理</option>
            </select>
            <input v-if="filterType === 'customer'" class="form-control input-sm" style="width:120px;margin-left:20px;" type="text" placeholder="请输入客户信息" v-model="customerKeyword">
            <select v-else class="form-control input-sm" style="width:120px;margin-left:20px;" v-model="managerChoosed" number>
                <option value="0">全部</option>
                <option v-for="manager of managerList" :value="manager.id">{{manager.display_name}}</option>
            </select>
            <a class="btn btn-info btn-sm" style="margin-left:30px;padding:6px 20px;" @click="getList(type, '', getFilterParams())">查询</a>
        </form>
        <h5 v-show="filterParams.customer || filterParams.managerId">{{getQueryDesc()}}</h5>
        <table class="table table-bordered table-hover order-table">
            <thead>
                <tr>
                	<th style="width:3%;"><input type="checkbox" v-model="chooseAllOrNot"></th>
                    <th style="width:10%;">订单日期</th>
                    <th style="width:10%;">订单号</th>
                    <th style="width:20%;">客户</th>
                    <th style="width:9%;">客户经理</th>
                    <th style="width:11%;">总价/利润</th>
                    <th style="width:10%;">订单状态</th>
                    <th style="width:9%;">开票情况</th>
                    <th style="width:10%;">付款情况</th>
                    <th style="width:8%;">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item of orderList">
                	<td><input type="checkbox" value="{{item.id}}" :disabled="!((item.status == 'DELIVERY_CONFIRMED' || item.status == 'DELIVERY_PAID' || item.status == 'ONLINE_CONFIRMED' || item.status == 'FINISHED') && (item.amount + item.freight - item.invoiced_amount > 0))" v-model="chosenOrders" number></td>
                    <td>{{item.time | dateFormat 'toDate'}}</td>
                    <td>{{item.id}}</td>
                    <td>{{item.customer.name + (item.customer.company ? '/' + item.customer.company : '')}}</td>
                    <td>{{item.manager ? item.manager.display_name : ''}}</td>
                    <td>{{(item.amount + item.freight) | realPrice}}{{item.is_priced ? '' : '+?'}} / {{(item.status === 'FINISHED' ? (item.amount + item.freight - item.cost - item.extra_cost - item.logistics_cost - item.invoice_logistics_cost - item.refunded_amount) : '') | realPrice}}{{item.status === 'FINISHED' ? '' : '?'}}元</td>
                    <td v-bind:class="{'text-success': item.status === 'FINISHED', 'text-danger': item.status === 'CANCELED'}">{{item.status | orderStatusFilter}}</td>
                    <td>{{item.invoiced_amount > 0 ? (item.invoiced_amount >= item.amount + item.freight ? '已开票' : '已部分开票') : ''}}</td>
                    <td>{{item.paid_amount > 0 ? (item.paid_amount === item.amount + item.freight ? '已付款' : '已付款' + Math.round(item.paid_amount / (item.amount + item.freight) *100) + '%') : ''}}</td>
                    <td><a class="btn-link" v-link="{path:'/order/detail/'+item.id}" target="_blank">查看详情</a></td>
                </tr>
            </tbody>
        </table>
        <a class="btn btn-primary" v-if="sinceId" @click="getList(type, sinceId, filterParams)">查看更多</a>
        <apply-invoice-dialog v-if="permissionList.applyInvoice" :show.sync="dataForApplyInvoiceDialog.show" :order-ids="dataForApplyInvoiceDialog.orderIds" :invoice-info="dataForApplyInvoiceDialog.invoiceInfo" :max-apply-amount="dataForApplyInvoiceDialog.maxApplyAmount"></apply-invoice-dialog>
    </div>
</template>

<script>
import { callback } from '../../store'
import { unique } from '../../filters'
import { permissionValidator } from '../../store/rolePermission.js'
import applyInvoiceDialog from './comp/applyInvoiceDialog.vue'

export default {
    name: 'OrderInvoiceView',
    components: {
        applyInvoiceDialog,
    },
    data() {
        return {
            type: '',
            sinceId: '',
            orderList: [],
            chosenOrders: [],
            chooseAllOrNot: false,
            permissionList: {
                applyInvoice: permissionValidator.orderSystem.order.applyInvoice(),
                soyyinOrderList: permissionValidator.orderSystem.order.soyyinOrderList(),
                myOrderList: permissionValidator.orderSystem.order.myOrderList(),
                createByMeOrderList: permissionValidator.orderSystem.order.createByMeOrderList(),
                allOrderList: permissionValidator.orderSystem.order.allOrderList(),
            },
            filterType: 'customer',
            customerKeyword: '',
            managerChoosed: 0,
            managerList: [],
            filterParams: {
                customer: '',
                managerId: 0,
            },
            dataForApplyInvoiceDialog: {
                show: false,
                orderIds: [],
                invoiceInfo: {
                    amount: '',
                    content: '',
                    title: '',
                    zengzhishui: undefined,
                    remark: '',
                    consignee_name: '',
                    consignee_phone: '',
                    address: '',
                },
                maxApplyAmount: '',
            },
        }
    },
    ready() {
        var getManagerFlag = true;
        if (this.permissionList.soyyinOrderList) {
            this.getList('UNHANDLED');
        } else if (this.permissionList.myOrderList) {
            this.getList('ASSIGNED');
        } else if (this.permissionList.createByMeOrderList) {
            this.getList('CREATED');
        } else if (this.permissionList.allOrderList) {
            this.getList('ALL');
        } else {
            getManagerFlag = false;
        }
        if (getManagerFlag) {
            this.getManager();
        }
    },
    events: {
        'apply-invoice'() {
            location.reload();
        },
    },
    watch: {
        chooseAllOrNot(val, oldVal) {
        	this.chosenOrders = [];
            if (val) {
            	for (let i = 0; i < this.orderList.length; i++) {
            		let item = this.orderList[i];
    				if ((item.status == 'DELIVERY_CONFIRMED' || item.status == 'DELIVERY_PAID' || item.status == 'ONLINE_CONFIRMED' || item.status == 'FINISHED') && (item.amount + item.freight - item.invoiced_amount > 0)) {
    					this.chosenOrders.push(item.id);
    				}
    			}
            }
        },
    },
    methods: {
    	getOrderFromId(orderId) {
    		for (let i = 0; i < this.orderList.length; i++) {
    			if (this.orderList[i].id === orderId) {
    				return this.orderList[i];
    			}
    		}
    	},
        getList(type, sinceId, filterParams) {
            var url = '/api/v2/admin/orders/list-v2?order_by=TIME&type=' + type;
            if (sinceId) {
                url += '&since_id=' + sinceId;
            }
            if (filterParams) {
                if (filterParams.customer) {
                    url += '&customer=' + filterParams.customer;
                } else if (filterParams.managerId) {
                    url += '&manager_id=' + filterParams.managerId;
                }
            }
            this.$http.get(url)
            .then((response) => {
                if (!response.data.result || response.data.result === 0) {
                    var arr = [];
                    if (sinceId) {
                        arr = this.orderList.concat(response.data.orders);
                    } else {
                        arr = response.data.orders;
                        this.chooseAllOrNot = false;
                        this.chosenOrders = [];
                    }
                    this.orderList = unique(arr);
                    this.type = type;
                    this.$set("sinceId", response.data.since_id || '');
                    if (filterParams) {
                        this.filterParams = filterParams;
                    } else {
                        this.filterParams = {
                            customer: '',
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
        clickToApplyInvoice() {
            this.dataForApplyInvoiceDialog.show = true;
            this.dataForApplyInvoiceDialog.orderIds = this.chosenOrders;
            this.dataForApplyInvoiceDialog.maxApplyAmount = 0;
            for (let i = 0; i < this.chosenOrders.length; i++) {
            	let orderNow = this.getOrderFromId(this.chosenOrders[i]);
            	this.dataForApplyInvoiceDialog.maxApplyAmount += orderNow.amount + orderNow.freight - orderNow.invoiced_amount;
            }
            this.dataForApplyInvoiceDialog.invoiceInfo = {
                amount: '',
                content: '',
                title: '',
                zengzhishui: undefined,
                remark: '',
                consignee_name: '',
                consignee_phone: '',
                address: '',
            };
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
        getFilterParams() {
            var filterParams = {
                customer: '',
                managerId: 0,
            };
            if (this.filterType === 'customer') {
                filterParams.customer = this.customerKeyword;
            } else {
                filterParams.managerId = this.managerChoosed;
            }
            return filterParams;
        },
        getQueryDesc() {
            if (!this.filterParams.customer && !this.filterParams.managerId) {
                return;
            }
            if (this.filterParams.customer) {
                return '客户信息 {' + this.filterParams.customer + '} 的查询结果：';
            }
            if (this.filterParams.managerId) {
                return '客户经理 {' + this.getManagerName(this.filterParams.managerId) + '} 的查询结果：';
            }
        },
    }
}
</script>

<style scoped>
.nav-pills > li > a{
    cursor: pointer;
}

.order-table {
    table-layout: fixed;
}

.order-table th, .order-table td{
    text-align: center;
    vertical-align: middle;
}

.order-table td .btn-link {
    text-decoration: none;
    cursor: pointer;
}

.order-table td .btn-link:hover {
    text-decoration: underline;
}
</style>