<!-- customers.vue -->
<template>
    <div class="container-fluid">
        <ul class="breadcrumb">
            <li>CRM系统</li>
            <li>客户管理</li>
        </ul>
        <a class="pull-right btn btn-info btn-sm" v-if="permissionList.addCustomer" @click="addCustomer">添加客户</a>
        <form class="form-inline" style="margin-bottom:10px;" v-if="permissionList.view">
            <label class="control-label" for="customerInput">筛选：</label>
            <input class="form-control input-sm" style="width:120px;" type="text" placeholder="请输入客户信息" id="customerInput" v-model="customerInput">
            <a class="btn btn-info btn-sm" style="margin-left:20px;padding:6px 20px;" @click="getList(true, customerInput)">查询</a>
        </form>
        <p class="clearfix"></p>
        <h5 v-show="customerQueryKeyword">{{'客户信息 {' + customerQueryKeyword + '} 的查询结果：'}}</h5>
        <table class="table table-bordered table-hover customer-table">
            <thead>
                <tr>
                    <th style="width:5%;">ID</th>
                    <th style="width:10%;">客户名称</th>
                    <th style="width:18%;">公司</th>
                    <th style="width:9%;">联系电话</th>
                    <th style="width:9%;">QQ</th>
                    <th style="width:18%;">地址</th>
                    <th style="width:10%;">备注</th>
                    <th style="width:10%;">创建时间</th>
                    <th style="width:11%;">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="customerItem of customerList">
                    <td>{{customerItem.id}}</td>
                    <td>{{customerItem.name}}</td>
                    <td>{{customerItem.company}}</td>
                    <td>{{customerItem.phone}}</td>
                    <td>{{customerItem.qq}}</td>
                    <td>{{customerItem.address}}</td>
                    <td>{{customerItem.remark}}</td>
                    <td>{{customerItem.create_time | dateFormat 'toDate'}}</td>
                    <td>
                        <a class="btn-link" v-if="permissionList.editCustomer" @click="editCustomer(customerItem)">编辑</a>
                        <a class="btn-link" style="margin-left:20px;" v-if="permissionList.deleteCustomer" @click="showDeleteCustomerDialog(customerItem)">删除</a>
                    </td>
                </tr>
            </tbody>
        </table>
        <a class="btn btn-primary" v-show="showMore" @click="getList(false, customerQueryKeyword)">查看更多</a>
        <edit-or-add-customer-dialog :show.sync="dataForEditOrAddCustomerDialog.show" :data="dataForEditOrAddCustomerDialog.data"></edit-or-add-customer-dialog>
        <popup-dialog :show-dialog.sync="dataForPopupDialog.show" :dialog-title="dataForPopupDialog.title" :dialog-content="dataForPopupDialog.content"></popup-dialog>
        <popup-tips :show.sync="dataForPopupTips.show" :tips-type="dataForPopupTips.type" :tips-title="dataForPopupTips.title" :tips-content="dataForPopupTips.content"></popup-tips>
    </div>
</template>

<script>
import Vue from 'vue'
import popupDialog from '../../components/popupDialog.vue'
import popupTips from '../../components/popupTips.vue'
import editOrAddCustomerDialog from './comp/editOrAddCustomerDialog.vue'
import { callback } from '../../store/index.js'
import { unique } from '../../filters'
import { permissionValidator } from '../../store/rolePermission.js'

const DELETE_CUSTOMER = "DELETE_CUSTOMER";

export default {
    name: 'CustomersView',
    components: {
        popupDialog,
        popupTips,
        editOrAddCustomerDialog,
    },
    data() {
        return {
            customerList: [],
            permissionList: {
                view: permissionValidator.crmSystem.customer.view(),
                addCustomer: permissionValidator.crmSystem.customer.addCustomer(),
                deleteCustomer: permissionValidator.crmSystem.customer.deleteCustomer(),
                editCustomer: permissionValidator.crmSystem.customer.editCustomer(),
            },
            customerInput: '',
            customerQueryKeyword: '',
            showMore: false,
            dataForEditOrAddCustomerDialog: {
                show: false,
                data: {
                    customerId: '',
                    name: '',
                    company: '',
                    phone: '',
                    qq: '',
                    address: '',
                    remark: '',
                },
            },
            dataForPopupDialog: {
                show: false,
                title: '删除确认',
                content: '',
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
        if (this.permissionList.view) {
            this.getList(true, '');
        }
    },
    events: {
        'click-positive-button'() {
            if (this.dataForPopupDialog.dialogId === DELETE_CUSTOMER) {
                this.deleteCustomer(this.dataForPopupDialog.passingData);
            }
        },
        'add-customer'() {
            location.reload();
        },
        'edit-customer'(result) {
            var customerItem = this.findCustomerItem(result.id);
            if (customerItem) {
                customerItem.name = result.data.name;
                customerItem.company = result.data.company;
                Vue.set(customerItem, 'phone', result.data.phone);
                Vue.set(customerItem, 'qq', result.data.qq);
                Vue.set(customerItem, 'address', result.data.address);
                Vue.set(customerItem, 'remark', result.data.remark);
            }
        },
    },
    methods: {
        findCustomerItem(id) {
            for (var i = 0; i < this.customerList.length; i++) {
                if (this.customerList[i].id === id) {
                    return this.customerList[i];
                }
            }
        },
        getList(firstLoad, customerKeywordToQuery) {
            var url = '/api/v2/admin/customers/list?limit=30';
            if (!firstLoad) {
                url += '&offset=' + this.customerList.length;
            }
            if (customerKeywordToQuery) {
                url += '&keyword=' + customerKeywordToQuery;
            }
            this.$http.get(url)
            .then((response) => {
                if (!response.data.result || response.data.result === 0) {
                    var arr = [];
                    if (!firstLoad) {
                        arr = this.customerList.concat(response.data.customers);
                    } else {
                        arr = response.data.customers;
                    }
                    this.customerList = unique(arr);
                    if (response.data.customers.length < 30) {
                        this.showMore = false;
                    } else {
                        this.showMore = true;
                    }
                    this.customerQueryKeyword = customerKeywordToQuery;
                } else {
                    callback.success(response.data);
                }
            },(response) => {
                callback.error(response);
            })
        },
        showPupupTips(title, content, type = 'danger') {
            this.dataForPopupTips.show = true;
            this.dataForPopupTips.type = type;
            this.dataForPopupTips.title = title;
            this.dataForPopupTips.content = content;
        },
        addCustomer() {
            this.dataForEditOrAddCustomerDialog.show = true;
            this.dataForEditOrAddCustomerDialog.data.customerId = '';
            this.dataForEditOrAddCustomerDialog.data.name = '';
            this.dataForEditOrAddCustomerDialog.data.company = '';
            this.dataForEditOrAddCustomerDialog.data.phone = '';
            this.dataForEditOrAddCustomerDialog.data.qq = '';
            this.dataForEditOrAddCustomerDialog.data.address = '';
            this.dataForEditOrAddCustomerDialog.data.remark = '';
        },
        editCustomer(customerItem) {
            this.dataForEditOrAddCustomerDialog.show = true;
            this.dataForEditOrAddCustomerDialog.data.customerId = customerItem.id;
            this.dataForEditOrAddCustomerDialog.data.name = customerItem.name;
            this.dataForEditOrAddCustomerDialog.data.company = customerItem.company;
            this.dataForEditOrAddCustomerDialog.data.phone = customerItem.phone;
            this.dataForEditOrAddCustomerDialog.data.qq = customerItem.qq;
            this.dataForEditOrAddCustomerDialog.data.address = customerItem.address;
            this.dataForEditOrAddCustomerDialog.data.remark = customerItem.remark;
        },
        showDeleteCustomerDialog(customerItem) {
            this.dataForPopupDialog.show = true;
            this.dataForPopupDialog.content = "确定删除此客户？";
            this.dataForPopupDialog.dialogId = DELETE_CUSTOMER;
            this.dataForPopupDialog.passingData = customerItem;
        },
        deleteCustomer(customerItem) {
            var url = '/api/v2/admin/customers/delete?id=' + customerItem.id;
            this.$http.delete(url)
            .then((response) => {
                if(!response.data.result || response.data.result === 0){
                    this.customerList.$remove(customerItem);
                    this.showPupupTips('操作成功', '删除客户成功', 'success');
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
.customer-table, {
    table-layout: fixed;
}

.customer-table td, .customer-table th {
    text-align: center;
    vertical-align: middle;
}

.customer-table td .btn-link {
    text-decoration: none;
    cursor: pointer;
}

.customer-table td .btn-link:hover {
    text-decoration: underline;
}
</style>
