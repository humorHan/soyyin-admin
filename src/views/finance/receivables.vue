<!-- receivables.vue -->
<template>
    <div class="container-fluid">
        <ul class="breadcrumb">
            <li>财务系统</li>
            <li>收款管理</li>
        </ul>
        <ul class="nav nav-pills">
            <li :class="{'active': type === 'WAITING'}" v-if="permissionList.view"><a @click="getList('WAITING')">待付款录入</a></li>
            <li :class="{'active': type === 'ALL'}" v-if="permissionList.view"><a @click="getList('ALL')">全部</a></li>
        </ul>
        <p class="clearfix"></p>
        <form class="form-inline" style="margin-bottom:10px;" v-if="permissionList.view">
            <label class="control-label" for="fitlerType">筛选：</label>
            <select class="form-control input-sm" id="fitlerType" style="width:80px;" v-model="filterType">
                <option value="customer">客户信息</option>
            </select>
            <input v-if="filterType === 'customer'" class="form-control input-sm" style="width:120px;margin-left:20px;" type="text" placeholder="请输入客户信息" v-model="customerKeyword">
            <a class="btn btn-info btn-sm" style="margin-left:30px;padding:6px 20px;" @click="getList(type, '', getFilterParams())">查询</a>
        </form>
        <h5 v-show="filterParams.customer">{{getQueryDesc()}}</h5>
        <table class="table order-thead-table">
            <thead>
                <tr style="height:45px;background-color:#eee;">
                    <th style="width:8%;">序号</th>
                    <th style="width:20%;">订单日期</th>
                    <th style="width:20%;">订单编号</th>
                    <th style="width:40%;">客户名称/公司</th>
                    <th style="width:12%;">订单金额</th>
                </tr>
            </thead>
        </table>
        <template v-for="orderItem in orderList">
            <table class="table table-bordered table-hover order-table" style="margin-bottom:0px;">
                <tbody>
                    <tr style="height:45px;">
                        <td style="width:8%;">{{$index + 1}}</td>
                        <td style="width:20%;">{{orderItem.time | dateFormat 'toDate'}}</td>
                        <td style="width:20%;"><a class="btn-link" v-link="{path:'/order/detail/'+orderItem.id}" target="_blank">{{orderItem.id}}</a></td>
                        <td style="width:40%;">{{orderItem.customer.name + (orderItem.customer.company ? '/' + orderItem.customer.company : '')}}</td>
                        <td style="width:12%;">{{orderItem.amount + orderItem.freight | realPrice}}元</td>
                    </tr>
                </tbody>
            </table>
            <table class="table table-bordered table-hover receivables-table">
                <thead>
                    <tr style="background-color:#eee;">
                        <th style="width:5%;">序号</th>
                        <th style="width:14%;">付款时间</th>
                        <th style="width:8%;">付款途径</th>
                        <th style="width:10%;">付款方式</th>
                        <th style="width:21%;">支付单号</th>
                        <th style="width:10%;">付款金额</th>
                        <th style="width:8%;">付款比例</th>
                        <th style="width:14%;">付款备注</th>
                        <th style="width:10%;">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="orderItem.records.length === 0">
                        <td colspan="7">尚无付款记录</td>
                        <td>{{orderItem.payment_remark}}</td>
                        <td>
                            <a class="btn btn-info btn-sm" @click="clickToShowReceivablesRecordDialog(orderItem)" v-if="permissionList.recordReceivables">收款录入</a>
                        </td>
                    </tr>
                    <template v-else>
                        <tr v-for="item of orderItem.records">
                            <td>{{$index + 1}}</td>
                            <td>{{item.create_time | dateFormat}}</td>
                            <td>{{item.method === 'PINGXX' ? '线上支付' : '线下转账'}}</td>
                            <td>{{item.method === 'PINGXX' ? 'Ping++支付' : (item.method === 'BANK_TRANSFER' ? '银行转账' : '支付宝转账')}}</td>
                            <td>{{item.payment_order_id}}</td>
                            <td>{{item.amount | realPrice}}元</td>
                            <td>{{Math.round(item.amount / (orderItem.amount + orderItem.freight) * 100)}}%</td>
                            <td v-if="$index === 0" :rowspan="orderItem.records.length">{{orderItem.payment_remark}}</td>
                            <td v-if="$index === 0" :rowspan="orderItem.records.length">
                                <template v-if="orderItem.status === 'DELIVERY_PAID' || orderItem.status === 'ONLINE_PAID' || orderItem.status === 'ONLINE_CONFIRMED' || orderItem.status === 'FINISHED'">
                                    付款成功
                                </template>
                                <template v-else>
                                    <a class="btn btn-info btn-sm" @click="clickToShowReceivablesRecordDialog(orderItem)" v-if="permissionList.recordReceivables">收款录入</a>
                                </template>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </template>
        <a class="btn btn-primary" v-if="sinceId" @click="getList(type, sinceId, filterParams)">查看更多</a>
        <record-receivables-dialog :show.sync="dataForRecordReceivablesDialog.show" :data="dataForRecordReceivablesDialog.data"></record-receivables-dialog>
    </div>
</template>

<script>
import recordReceivablesDialog from './comp/recordReceivablesDialog.vue'
import { callback } from '../../store'
import { unique } from '../../filters'
import { permissionValidator } from '../../store/rolePermission.js'

export default {
    name: 'FinanceReceivablesView',
    components: {
        recordReceivablesDialog,
    },
    data() {
        return {
            type: '',
            sinceId: '',
            orderList: [],
            permissionList: {
                view: permissionValidator.financeSystem.receivable.view(),
                recordReceivables: permissionValidator.financeSystem.receivable.recordReceivables(),
            },
            filterType: 'customer',
            customerKeyword: '',
            filterParams: {
                customer: '',
            },
            dataForRecordReceivablesDialog: {
                show: false,
                data: {
                    orderId: '',
                    paymentMethod: '',
                    paymentAmount: '',
                    paymentOrderId: '',
                    maxPaymentAmount: '',
                },
            },
        }
    },
    ready() {
        if (this.permissionList.view) {
            this.getList('WAITING');
        }
    },
    events: {
        'add-receivables'(data, orderItem) {
            location.reload();
        },
    },
    methods: {
        getList(type, sinceId, filterParams) {
            var url = '/api/v2/admin/payment/order-list?order_by=TIME&type=' + type;
            if (sinceId) {
                url += '&since_id=' + sinceId;
            }
            if (filterParams) {
                if (filterParams.customer) {
                    url += '&customer=' + filterParams.customer;
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
                    }
                    this.orderList = unique(arr);
                    this.type = type;
                    this.$set("sinceId", response.data.since_id || '');
                    if (filterParams) {
                        this.filterParams = filterParams;
                    } else {
                        this.filterParams = {
                            customer: '',
                        };
                    }
                } else {
                    callback.success(response.data);
                }
            },(response) => {
                callback.error(response);
            })
        },
        clickToShowReceivablesRecordDialog(orderItem) {
            var maxPaymentAmount = orderItem.amount + orderItem.freight;
            for (let i = 0; i < orderItem.records.length; i++) {
                maxPaymentAmount -= orderItem.records[i].amount;
            }
            this.dataForRecordReceivablesDialog.show = true;
            this.dataForRecordReceivablesDialog.data.orderId = orderItem.id;
            this.dataForRecordReceivablesDialog.data.paymentMethod = '';
            this.dataForRecordReceivablesDialog.data.paymentAmount = '';
            this.dataForRecordReceivablesDialog.data.paymentOrderId = '';
            this.dataForRecordReceivablesDialog.data.maxPaymentAmount = maxPaymentAmount;
            this.dataForRecordReceivablesDialog.data.passingData = orderItem;
        },
        getFilterParams() {
            var filterParams = {
                customer: '',
            };
            if (this.filterType === 'customer') {
                filterParams.customer = this.customerKeyword;
            }
            return filterParams;
        },
        getQueryDesc() {
            if (!this.filterParams.customer) {
                return;
            }
            if (this.filterParams.customer) {
                return '客户信息 {' + this.filterParams.customer + '} 的查询结果：';
            }
        },
    }
}
</script>

<style scoped>
.nav-pills > li > a{
    cursor: pointer;
}

.order-table, .order-thead-table, .receivables-table{
    table-layout: fixed;
}

.order-table td, .order-thead-table th, .receivables-table td, .receivables-table th {
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