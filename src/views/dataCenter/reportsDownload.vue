<!-- reportsDownload.vue -->
<template>
    <div class="container-fluid">
        <ul class="breadcrumb">
            <li>数据中心</li>
            <li>报表下载</li>
        </ul>
        <ul class="nav nav-pills">
            <li :class="{'active': type === 'ORDER'}" v-if="permissionList.orderReport"><a @click="changeDownloadType('ORDER')">订单报表</a></li>
            <li :class="{'active': type === 'ORDER_ITEM'}" v-if="permissionList.orderItemReport"><a @click="changeDownloadType('ORDER_ITEM')">订单项报表</a></li>
            <li :class="{'active': type === 'FINISHED_ORDER'}" v-if="permissionList.finishedOrderReport"><a @click="changeDownloadType('FINISHED_ORDER')">已完成订单报表</a></li>
        </ul>
        <form v-if="permissionList.orderReport || permissionList.orderItemReport || permissionList.finishedOrderReport" class="form-inline" style="margin-top:20px;">
            <label class="control-label" style="width:120px;text-align:right;" for="startDate">{{type === 'FINISHED_ORDER' ? '订单完成日期：' : '订单日期：'}}</label>
            <input class="form-control input-sm" id="startDate" style="width:200px;" readOnly="true" v-model="startDate">
            <label class="control-label">至</label>
            <input class="form-control input-sm" id="endDate" style="width:200px;" readOnly="true" v-model="endDate">
        </form>
        <form v-if="permissionList.orderReport || permissionList.orderItemReport || permissionList.finishedOrderReport" class="form-inline" style="margin-top:20px;">
            <label class="control-label" style="width:120px;text-align:right;" for="fitlerType">筛选：</label>
            <select class="form-control input-sm" id="fitlerType" style="width:80px;margin-right:10px;" v-model="filterType">
                <option value="customer">客户信息</option>
                <option v-if="type === 'ORDER_ITEM'" value="supplier">供应商</option>
                <option value="manager">客户经理</option>
            </select>
            <customer-auto-complete-input v-show="filterType === 'customer'" @input="inputCustomer"></customer-auto-complete-input>
            <select v-show="filterType === 'supplier'" class="form-control input-sm" style="width:150px;" v-model="supplierChoosed" number>
                <option value="0">全部</option>
                <option v-for="supplier of supplierList" :value="supplier.id">{{supplier.name}}</option>
            </select>
            <select v-show="filterType === 'manager'" class="form-control input-sm" style="width:150px;" v-model="managerChoosed" number>
                <option value="0">全部</option>
                <option v-for="manager of managerList" :value="manager.id">{{manager.display_name}}</option>
            </select>
        </form>
        <div v-if="permissionList.orderReport || permissionList.orderItemReport || permissionList.finishedOrderReport" style="margin-top:20px; padding-left:50px;">
            <a class="btn btn-info btn-lg" @click="download">下载</a>
        </div>
        <popup-tips :show.sync="dataForPopupTips.show" :tips-type="dataForPopupTips.type" :tips-title="dataForPopupTips.title" :tips-content="dataForPopupTips.content"></popup-tips>
    </div>
</template>

<script>
import customerAutoCompleteInput from '../../components/customerAutoCompleteInput.vue'
import popupTips from '../../components/popupTips.vue'
import { callback } from '../../store'
import { permissionValidator } from '../../store/rolePermission.js'
import $ from 'jquery'

export default {
    name: 'ReportsDownloadView',
    components: {
        customerAutoCompleteInput,
        popupTips,
    },
    data() {
        return {
            type: '',
            permissionList: {
                orderReport: permissionValidator.dataCenter.downloads.downloadOrderReport(),
                orderItemReport: permissionValidator.dataCenter.downloads.downloadOrderItemReport(),
                finishedOrderReport: permissionValidator.dataCenter.downloads.downloadFinishedOrderReport(),
            },
            startDate: '',
            endDate: '',
            filterType: 'customer',
            customerInput: {
                type: 'text',
                value: '',
            },
            supplierChoosed: 0,
            supplierList: [],
            managerChoosed: 0,
            managerList: [],
            dataForPopupTips: {
                show: false,
                type: 'danger',
                title: '',
                content: '',
            },
        }
    },
    ready() {
        var isAccessible = true;
        if (this.permissionList.orderReport) {
            this.type = 'ORDER';
        } else if (this.permissionList.orderItemReport) {
            this.type = 'ORDER_ITEM';
        } else if (this.permissionList.finishedOrderReport) {
            this.type = 'FINISHED_ORDER';
        } else {
            isAccessible = false;
        }
        if (isAccessible) {
            this.getManager();
        }
        if (this.permissionList.orderItemReport) {
            this.getSupplier();
        }
        if (isAccessible) {
            $("#startDate").datetimepicker({
                format: "yyyy-mm-dd",
                language: "zh-CN",
                todayHighlight: true,
                autoclose: true,
                minView: 2,
                endDate: new Date(),
            });
            $("#endDate").datetimepicker({
                format: "yyyy-mm-dd",
                language: "zh-CN",
                todayHighlight: true,
                autoclose: true,
                minView: 2,
                endDate: new Date(),
            });
        }
    },
    watch: {
        startDate(val, oldVal) {
            $("#endDate").datetimepicker('setStartDate', val);
        },
        endDate(val, oldVal) {
            $("#startDate").datetimepicker('setEndDate', val);
        },
    },
    methods: {
        changeDownloadType(type) {
            this.type = type;
            if ((this.type === 'ORDER' || this.type === 'FINISHED_ORDER') && this.filterType === 'supplier') {
                this.filterType = 'customer';
            }
        },
        inputCustomer(result) {
            this.customerInput = result;
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
        getTime(val) {
            var dates = val.split('-');
            var date = new Date();
            date.setFullYear(dates[0], dates[1] - 1, dates[2]);
            date.setHours(0, 0, 0, 0);
            return date.getTime();
        },
        getStartDateTimestamp() {
            return this.getTime(this.startDate);
        },
        getEndDateTimestamp() {
            return this.getTime(this.endDate) + 24 * 60 * 60 * 1000 - 1;
        },
        download() {
            if (!this.startDate || !this.endDate) {
                this.dataForPopupTips.show = true;
                this.dataForPopupTips.title = '输入有误';
                this.dataForPopupTips.content = this.type === 'FINISHED_ORDER' ? '订单完成日期不能为空' : '订单日期不能为空';
                return;
            }
            if (this.type === 'ORDER') {
                var url = '/api/v2/admin/orders/orders-csv?';
            } else if (this.type === 'ORDER_ITEM') {
                var url = '/api/v2/admin/orders/order-items-csv?';
            } else {
                var url = '/api/v2/admin/orders/finished-orders-csv?';
            }
            url += 'start_time=' + this.getStartDateTimestamp() + '&end_time=' + this.getEndDateTimestamp();
            if (this.filterType === 'customer') {
                if (this.customerInput.type === 'text') {
                    if (this.customerInput.value) {
                        url += '&customer=' + this.customerInput.value;
                    }
                } else {
                    url += '&customer_id=' + this.customerInput.value.id;
                }
            } else if (this.filterType === 'supplier') {
                if (this.supplierChoosed) {
                    url += '&supplier_id=' + this.supplierChoosed;
                }
                
            } else if (this.filterType === 'manager') {
                if (this.managerChoosed) {
                    url += '&manager_id=' + this.managerChoosed;
                }
            }
            window.open(url);
        },
    },
}
</script>

<style scoped>
.nav-pills > li > a{
    cursor: pointer;
}
</style>
