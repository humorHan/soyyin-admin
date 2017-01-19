<!-- suppliers.vue -->
<template>
    <div class="container-fluid">
        <ul class="breadcrumb">
            <li>CRM系统</li>
            <li>供应商管理</li>
        </ul>
        <a class="pull-right btn btn-info btn-sm" v-if="permissionList.addSupplier" @click="addSupplier">添加供应商</a>
        <p class="clearfix"></p>
        <table class="table table-bordered table-hover supplier-table">
            <thead>
                <tr>
                    <th style="width:5%;">ID</th>
                    <th style="width:12%;">供应商名称</th>
                    <th style="width:16%;">供应商品</th>
                    <th style="width:15%;">覆盖范围</th>
                    <th style="width:15%;">所在地</th>
                    <th style="width:12%;">联系人</th>
                    <th style="width:12%;">下单数量/金额</th>
                    <th style="width:13%;">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="supplierItem of supplierList">
                    <td>{{supplierItem.id}}</td>
                    <td>{{supplierItem.name}}</td>
                    <td>{{supplierItem.product}}</td>
                    <td>{{supplierItem.region}}</td>
                    <td>{{supplierItem.address}}</td>
                    <td>{{supplierItem.contact}}</td>
                    <td>{{supplierItem.order_count}}/{{supplierItem.total_cost | realPrice}}元</td>
                    <td>
                        <a class="btn-link" v-if="permissionList.editSupplier" @click="editSupplier(supplierItem)">编辑</a>
                        <a class="btn-link" style="margin-left:20px;" v-if="permissionList.deleteSupplier" @click="showDeleteSupplierDialog(supplierItem)">删除</a>
                    </td>
                </tr>
            </tbody>
        </table>
        <edit-or-add-supplier-dialog :show.sync="dataForEditOrAddSupplierDialog.show" :data="dataForEditOrAddSupplierDialog.data"></edit-or-add-supplier-dialog>
        <popup-dialog :show-dialog.sync="dataForPopupDialog.show" :dialog-title="dataForPopupDialog.title" :dialog-content="dataForPopupDialog.content"></popup-dialog>
    </div>
</template>

<script>
import popupDialog from '../../components/popupDialog.vue'
import editOrAddSupplierDialog from './comp/editOrAddSupplierDialog.vue'
import { callback } from '../../store/index.js'
import { permissionValidator } from '../../store/rolePermission.js'

const DELETE_SUPPLIER = "DELETE_SUPPLIER";

export default {
    name: 'CrmSuppliersView',
    components: {
        popupDialog,
        editOrAddSupplierDialog,
    },
    data() {
        return {
            supplierList: [],
            permissionList: {
                view: permissionValidator.crmSystem.supplier.view(),
                addSupplier: permissionValidator.crmSystem.supplier.addSupplier(),
                deleteSupplier: permissionValidator.crmSystem.supplier.deleteSupplier(),
                editSupplier: permissionValidator.crmSystem.supplier.editSupplier(),
            },
            dataForEditOrAddSupplierDialog: {
                show: false,
                data: {
                    supplierId: '',
                    name: '',
                    product: '',
                    region: '',
                    address: '',
                    contact: '',
                },
            },
            dataForPopupDialog: {
                show: false,
                title: '删除确认',
                content: '',
            },
        }
    },
    ready() {
        if (this.permissionList.view) {
            this.getList();
        }
    },
    events: {
        'click-positive-button'() {
            if (this.dataForPopupDialog.dialogId === DELETE_SUPPLIER) {
                this.deleteSupplier(this.dataForPopupDialog.passingData);
            }
        },
        'add-supplier'() {
            location.reload();
        },
        'edit-supplier'() {
            location.reload();
        },
    },
    methods: {
        getList() {
            var url = '/api/v2/admin/suppliers/list';
            this.$http.get(url)
            .then((response) => {
                if (!response.data.result || response.data.result === 0) {
                    this.supplierList = response.data.suppliers;
                } else {
                    callback.success(response.data);
                }
            },(response) => {
                callback.error(response);
            })
        },
        addSupplier() {
            this.dataForEditOrAddSupplierDialog.show = true;
            this.dataForEditOrAddSupplierDialog.data.supplierId = '';
            this.dataForEditOrAddSupplierDialog.data.name = '';
            this.dataForEditOrAddSupplierDialog.data.product = '';
            this.dataForEditOrAddSupplierDialog.data.region = '';
            this.dataForEditOrAddSupplierDialog.data.address = '';
            this.dataForEditOrAddSupplierDialog.data.contact = '';
        },
        editSupplier(supplierItem) {
            this.dataForEditOrAddSupplierDialog.show = true;
            this.dataForEditOrAddSupplierDialog.data.supplierId = supplierItem.id;
            this.dataForEditOrAddSupplierDialog.data.name = supplierItem.name;
            this.dataForEditOrAddSupplierDialog.data.product = supplierItem.product;
            this.dataForEditOrAddSupplierDialog.data.region = supplierItem.region;
            this.dataForEditOrAddSupplierDialog.data.address = supplierItem.address;
            this.dataForEditOrAddSupplierDialog.data.contact = supplierItem.contact;
        },
        showDeleteSupplierDialog(supplierItem) {
            this.dataForPopupDialog.show = true;
            this.dataForPopupDialog.content = "确定删除此供应商？";
            this.dataForPopupDialog.dialogId = DELETE_SUPPLIER;
            this.dataForPopupDialog.passingData = supplierItem;
        },
        deleteSupplier(supplierItem) {
            var url = '/api/v2/admin/suppliers/delete?id=' + supplierItem.id;
            this.$http.delete(url)
            .then((response) => {
                if(!response.data.result || response.data.result === 0){
                    location.reload();
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
.supplier-table, {
    table-layout: fixed;
}

.supplier-table td, .supplier-table th {
    text-align: center;
    vertical-align: middle;
}

.supplier-table td .btn-link {
    text-decoration: none;
    cursor: pointer;
}

.supplier-table td .btn-link:hover {
    text-decoration: underline;
}
</style>