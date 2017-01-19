<!-- invoice.vue -->
<template>
    <div class="container-fluid">
        <ul class="breadcrumb">
            <li>财务系统</li>
            <li>开票管理</li>
        </ul>
        <ul class="nav nav-pills">
            <li :class="{'active': type === 'WAIT_INVOICING'}" v-if="permissionList.view"><a @click="getList('WAIT_INVOICING')">待开票</a></li>
            <li :class="{'active': type === 'WAIT_DELIVERY'}" v-if="permissionList.view"><a @click="getList('WAIT_DELIVERY')">待配送</a></li>
            <li :class="{'active': type === 'ALL'}" v-if="permissionList.view"><a @click="getList('ALL')">全部</a></li>
        </ul>
        <p class="clearfix"></p>
        <table class="table table-bordered table-hover invoice-table">
            <thead>
                <tr>
                    <th style="width:6%;">ID</th>
                    <th style="width:10%;">相关订单</th>
                    <th style="width:8%;">使用额度</th>
                    <th style="width:24%;">发票信息</th>
                    <th style="width:18%;">发票寄送至</th>
                    <th style="width:7%;">状态</th>
                    <th style="width:19%;">操作信息</th>
                    <th style="width:8%;">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="invoiceItem of invoiceList">
                    <td>{{invoiceItem.id}}</td>
                    <td>
                        <template v-for="orderId in invoiceItem.order_ids">
                            <a class="btn-link" v-link="{path:'/order/detail/' + orderId}" target="_blank">{{orderId}}</a>
                            <br>
                        </template>
                    </td>
                    <td>{{invoiceItem.amount | realPrice}}元</td>
                    <td>
                        类型：{{invoiceItem.data.zengzhishui ? '增值税发票' : '普通发票'}}<br>
                        抬头：{{invoiceItem.data.title}}<br>
                        内容：{{invoiceItem.data.content}}<br>
                        金额：{{invoiceItem.data.amount | realPrice}}元<br>
                        <template v-if="invoiceItem.data.remark">备注：{{invoiceItem.data.remark}}<br></template>
                        <a class="btn-link" v-if="invoiceItem.data.zengzhishui" @click="clickToShowZZSInvoiceInfoDialog(invoiceItem.data.zengzhishui)">更多信息</a>
                    </td>
                    <td>
                        收货人：{{invoiceItem.data.consignee_name}}<br>
                        联系方式：{{invoiceItem.data.consignee_phone}}<br>
                        收货地址：{{invoiceItem.data.address}}元<br>
                        <a class="btn-link" v-if="invoiceItem.logistics" @click="clickToShowInvoiceLogisticsDialog(invoiceItem.logistics)">物流信息</a>
                    </td>
                    <td :class="{'text-success': invoiceItem.status === 'FINISHED'}">{{invoiceItem.status | invoiceStatusFilter}}</td>
                    <td>
                        申请时间：{{invoiceItem.create_time | dateFormat}}<br>
                        <template v-if="invoiceItem.invoice_time">
                            开票时间：{{invoiceItem.invoice_time | dateFormat}}<br>
                        </template>
                        <template v-if="invoiceItem.finish_time">
                            完成时间：{{invoiceItem.finish_time | dateFormat}}<br>
                        </template>
                    </td>
                    <td>
                        <a class="btn btn-info btn-sm" v-if="invoiceItem.status === 'WAIT_INVOICING' && permissionList.finishInvoice" @click="showFinishInvoiceDialog(invoiceItem)">开票完成</a>
                        <a class="btn btn-info btn-sm" v-if="invoiceItem.status === 'WAIT_DELIVERY' && permissionList.recordLogistics" @click="showRecordLogisticsDialog(invoiceItem)">物流录入</a>
                    </td>
                </tr>
            </tbody>
        </table>
        <a class="btn btn-primary" v-if="sinceId" @click="getList(type, sinceId)">查看更多</a>
        <div class="modal" style="height:100%;" v-show="showZZSInvoiceInfoDialog">
            <div class="modal-dialog" style="top:30%;width:800px;">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" @click="closeZZSInvoiceInfoDialog">&times;</button>
                        <h4 class="modal-title">增值税发票信息</h4>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-lg-6"><b>纳税人识别号：</b>{{dataForZZSInvoiceInfoDialog.identifier}}</div>
                            <div class="col-lg-6"><b>电话：</b>{{dataForZZSInvoiceInfoDialog.phone}}</div>
                        </div>
                        <div class="row">
                            <div class="col-lg-12"><b>注册地址：</b>{{dataForZZSInvoiceInfoDialog.address}}</div>
                        </div>
                        <div class="row">
                            <div class="col-lg-6"><b>开户行：</b>{{dataForZZSInvoiceInfoDialog.bank}}</div>
                            <div class="col-lg-6"><b>银行账号：</b>{{dataForZZSInvoiceInfoDialog.account}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal" style="height:100%;" v-show="showInvoiceLogisticsDialog">
            <div class="modal-dialog" style="top:30%;width:500px;">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" @click="closeInvoiceLogisticsDialog">&times;</button>
                        <h4 class="modal-title">物流信息</h4>
                    </div>
                    <div class="modal-body">
                        <p>{{dataForInoviceLogisticsDialog.delivery_method}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{dataForInoviceLogisticsDialog.express}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{dataForInoviceLogisticsDialog.express_order_id}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{dataForInoviceLogisticsDialog.cost | realPrice}}元<br>{{dataForInoviceLogisticsDialog.remark}}</p>
                    </div>
                </div>
            </div>
        </div>
        <record-logistics-dialog :show.sync="dataForRecordLogisticsDialog.show" :data="dataForRecordLogisticsDialog.data"></record-logistics-dialog>
        <popup-dialog :show-dialog.sync="dataForPopupDialog.show" :dialog-title="dataForPopupDialog.title" :dialog-content="dataForPopupDialog.content"></popup-dialog>
    </div>
</template>

<script>
import Vue from 'vue'
import popupDialog from '../../components/popupDialog.vue'
import recordLogisticsDialog from './comp/recordLogisticsDialog.vue'
import { callback } from '../../store'
import { unique } from '../../filters'
import { permissionValidator } from '../../store/rolePermission.js'

const FINISH_INVOICE = "FINISH_INVOICE";

export default {
    name: 'FinanceInvoiceView',
    components: {
        popupDialog,
        recordLogisticsDialog,
    },
    data() {
        return {
            type: '',
            sinceId: '',
            invoiceList: [],
            permissionList: {
                view: permissionValidator.financeSystem.invoice.view(),
                finishInvoice: permissionValidator.financeSystem.invoice.finishInvoice(),
                recordLogistics: permissionValidator.financeSystem.invoice.recordLogistics(),
            },
            showZZSInvoiceInfoDialog: false,
            showInvoiceLogisticsDialog: false,
            dataForZZSInvoiceInfoDialog: {
                identifier: '',
                phone: '',
                address: '',
                bank: '',
                account: '',
            },
            dataForInoviceLogisticsDialog: {
                delivery_method: '',
                express: '',
                express_order_id: '',
                cost: '',
                remark: '',
            },
            dataForRecordLogisticsDialog: {
                show: false,
                data: {
                    invoiceId: '',
                    deliveryMethod: '',
                    express: '',
                    expressOrderId: '',
                    logisticsCost: '',
                    logisticsRemark: '',
                },
            },
            dataForPopupDialog: {
                show: false,
                title: '开票确认',
                content: '',
            },
        }
    },
    ready() {
        if (this.permissionList.view) {
            this.getList('WAIT_INVOICING');
        }
    },
    events: {
        'click-positive-button'() {
            if (this.dataForPopupDialog.dialogId === FINISH_INVOICE) {
                this.finishInvoice(this.dataForPopupDialog.passingData);
            }
        },
        'add-logistics'(data, invoiceItem) {
            invoiceItem.status = 'FINISHED';
            Vue.set(invoiceItem, 'finish_time', (new Date()).getTime());
            Vue.set(invoiceItem, 'logistics', {
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
        getList(type, sinceId) {
            this.type = type;
            var url = '/api/v2/admin/invoices/list?limit=30';
            if (type !== 'ALL') {
                url += '&status=' + type;
            }
            if(sinceId){
                url += '&since_id=' + sinceId;
            }
            this.$http.get(url)
            .then((response) => {
                if (!response.data.result || response.data.result === 0) {
                    var arr = [];
                    if (sinceId) {
                        arr = this.invoiceList.concat(response.data.data);
                    } else {
                        arr = response.data.data;
                    }
                    this.invoiceList = unique(arr);
                    this.$set("sinceId", response.data.since_id || '');
                } else {
                    callback.success(response.data);
                }
            },(response) => {
                callback.error(response);
            })
        },
        showFinishInvoiceDialog(invoiceItem) {
            this.dataForPopupDialog.show = true;
            this.dataForPopupDialog.content = "确定已开发票？";
            this.dataForPopupDialog.dialogId = FINISH_INVOICE;
            this.dataForPopupDialog.passingData = invoiceItem;
        },
        finishInvoice(invoiceItem) {
            var url = '/api/v2/admin/invoices/invoice-complete?invoice_id=' + invoiceItem.id;
            this.$http.put(url)
            .then((response) => {
                if(!response.data.result || response.data.result === 0){
                    invoiceItem.status = 'WAIT_DELIVERY';
                    Vue.set(invoiceItem, 'invoice_time', (new Date()).getTime());
                } else {
                    callback.success(response.data);
                }
            },(response) => {
                callback.error(response);
            });
        },
        showRecordLogisticsDialog(invoiceItem) {
            this.dataForRecordLogisticsDialog.show = true;
            this.dataForRecordLogisticsDialog.data.invoiceId = invoiceItem.id;
            this.dataForRecordLogisticsDialog.data.deliveryMethod = '';
            this.dataForRecordLogisticsDialog.data.express = '';
            this.dataForRecordLogisticsDialog.data.expressOrderId = '';
            this.dataForRecordLogisticsDialog.data.logisticsCost = '';
            this.dataForRecordLogisticsDialog.data.logisticsRemark = '';
            this.dataForRecordLogisticsDialog.data.passingData = invoiceItem;
        },
        clickToShowZZSInvoiceInfoDialog(zengzhishui) {
            this.showZZSInvoiceInfoDialog = true;
            this.dataForZZSInvoiceInfoDialog.identifier = zengzhishui.identifier;
            this.dataForZZSInvoiceInfoDialog.phone = zengzhishui.phone;
            this.dataForZZSInvoiceInfoDialog.address = zengzhishui.address;
            this.dataForZZSInvoiceInfoDialog.bank = zengzhishui.bank;
            this.dataForZZSInvoiceInfoDialog.account = zengzhishui.account;
        },
        clickToShowInvoiceLogisticsDialog(logistics) {
            this.showInvoiceLogisticsDialog = true;
            this.dataForInoviceLogisticsDialog.delivery_method = logistics.delivery_method;
            this.dataForInoviceLogisticsDialog.express = logistics.express;
            this.dataForInoviceLogisticsDialog.express_order_id = logistics.express_order_id;
            this.dataForInoviceLogisticsDialog.cost = logistics.cost;
            this.dataForInoviceLogisticsDialog.remark = logistics.remark;
        },
        closeZZSInvoiceInfoDialog() {
            this.showZZSInvoiceInfoDialog = false;
        },
        closeInvoiceLogisticsDialog() {
            this.showInvoiceLogisticsDialog = false;
        },
    },
}
</script>

<style scoped>
.nav-pills > li > a{
    cursor: pointer;
}

.invoice-table {
    table-layout: fixed;
}

.invoice-table th, .invoice-table td{
    text-align: center;
    vertical-align: middle;
}

.invoice-table td .btn-link {
    text-decoration: none;
    cursor: pointer;
}

.invoice-table td .btn-link:hover {
    text-decoration: underline;
}
</style>