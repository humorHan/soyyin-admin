<!-- refunds.vue -->
<template>
    <div class="container-fluid">
        <ul class="breadcrumb">
            <li>财务系统</li>
            <li>退款管理</li>
        </ul>
        <ul class="nav nav-pills">
            <li :class="{'active': type === 'WAITING'}" v-if="permissionList.view"><a @click="getList('WAITING')">待退款</a></li>
            <li :class="{'active': type === 'ALL'}" v-if="permissionList.view"><a @click="getList('ALL')">全部</a></li>
        </ul>
        <p class="clearfix"></p>
        <table class="table table-bordered table-hover refunds-table">
            <thead>
                <tr>
                    <th style="width:6%;">ID</th>
                    <th style="width:10%;">订单ID</th>
                    <th style="width:8%;">退款金额</th>
                    <th style="width:22%;">退款类型/信息</th>
                    <th style="width:16%;">退款原因</th>
                    <th style="width:10%;">状态</th>
                    <th style="width:19%;">操作信息</th>
                    <th style="width:9%;">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="refundItem of refundList">
                    <td>{{refundItem.id}}</td>
                    <td><a class="btn-link" v-link="{path:'/order/detail/' + refundItem.order_id}" target="_blank">{{refundItem.order_id}}</a></td>
                    <td>{{refundItem.amount | realPrice}}元</td>
                    <td>
                        类型：{{refundItem.type | refundTypeFilter}}<br>
                        退款渠道：{{refundItem.method | refundWayFilter}}<br>
                        <template v-if="refundItem.type === 'BY_HAND'">
                            对方账号：{{refundItem.account}}<br>
                            对方姓名：{{refundItem.name}}<br>
                        </template>
                    </td>
                    <td>{{refundItem.reason}}</td>
                    <td :class="{'text-success': refundItem.status === 'FINISHED'}">{{refundItem.status | refundStatusFilter}}</td>
                    <td>
                        创建时间：{{refundItem.create_time | dateFormat}}<br>
                        <template v-if="refundItem.finish_time">
                            完成时间：{{refundItem.finish_time | dateFormat}}<br>
                        </template>
                    </td>
                    <td>
                        <template v-if="refundItem.type === 'BY_HAND'">
                            <a class="btn btn-info btn-sm" v-if="refundItem.status === 'WAITING' && permissionList.finishRefund" @click="showFinishRefundDialog(refundItem)">退款完成</a>
                        </template>
                        <template v-else>
                            <a class="btn btn-info btn-sm" v-if="refundItem.pingxx_method === 'ALIPAY_PC' && refundItem.status !== 'FINISHED' && permissionList.finishRefund" @click="jumpToZhifubaoRefundLink(refundItem)">去退款</a>
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>
        <a class="btn btn-primary" v-if="sinceId" @click="getList(type, sinceId)">查看更多</a>
        <popup-dialog :show-dialog.sync="dataForPopupDialog.show" :dialog-title="dataForPopupDialog.title" :dialog-content="dataForPopupDialog.content"></popup-dialog>
    </div>
</template>

<script>
import popupDialog from '../../components/popupDialog.vue'
import { callback } from '../../store'
import { unique } from '../../filters'
import { permissionValidator } from '../../store/rolePermission.js'

const FINISH_REFUND = "FINISH_REFUND";

export default {
    name: 'FinanceRefundsView',
    components: {
        popupDialog,
    },
    data() {
        return {
            type: '',
            sinceId: '',
            refundList: [],
            permissionList: {
                view: permissionValidator.financeSystem.refund.view(),
                finishRefund: permissionValidator.financeSystem.refund.finishRefund(),
            },
            dataForPopupDialog: {
                show: false,
                title: '完成确认',
                content: '',
            },
        }
    },
    ready() {
        if (this.permissionList.view) {
            this.getList('WAITING');
        }
    },
    events: {
        'click-positive-button'() {
            if (this.dataForPopupDialog.dialogId === FINISH_REFUND) {
                this.finishRefund(this.dataForPopupDialog.passingData);
            }
        },
    },
    methods: {
        getList(type, sinceId) {
            this.type = type;
            var url = '/api/v2/admin/refunds/list?type=' + type;
            if(sinceId){
                url += '&since_id=' + sinceId;
            }
            this.$http.get(url)
            .then((response) => {
                if (!response.data.result || response.data.result === 0) {
                    var arr = [];
                    if (sinceId) {
                        arr = this.refundList.concat(response.data.refunds);
                    } else {
                        arr = response.data.refunds;
                    }
                    this.refundList = unique(arr);
                    this.$set("sinceId", response.data.since_id || '');
                } else {
                    callback.success(response.data);
                }
            },(response) => {
                callback.error(response);
            })
        },
        showFinishRefundDialog(refundItem) {
            this.dataForPopupDialog.show = true;
            this.dataForPopupDialog.content = "确定完成退款？";
            this.dataForPopupDialog.dialogId = FINISH_REFUND;
            this.dataForPopupDialog.passingData = refundItem;
        },
        finishRefund(refundItem) {
            var url = '/api/v2/admin/refunds/complete?refund_id=' + refundItem.id;
            this.$http.put(url)
            .then((response) => {
                if (!response.data.result || response.data.result === 0) {
                    location.reload();
                } else {
                    callback.success(response.data);
                }
            },(response) => {
                callback.error(response);
            });
        },
        jumpToZhifubaoRefundLink(refundItem) {
            var url = '/api/v2/admin/refunds/alipay-url?refund_id=' + refundItem.id;
            this.$http.get(url)
            .then((response) => {
                if (!response.data.result || response.data.result === 0) {
                    window.open(response.data.url);
                } else {
                    callback.success(response.data);
                }
            },(response) => {
                callback.error(response);
            });
        },
    },
}
</script>

<style scoped>
.nav-pills > li > a{
    cursor: pointer;
}

.refunds-table {
    table-layout: fixed;
}

.refunds-table th, .refunds-table td{
    text-align: center;
    vertical-align: middle;
}

.refunds-table td .btn-link {
    text-decoration: none;
    cursor: pointer;
}

.refunds-table td .btn-link:hover {
    text-decoration: underline;
}
</style>