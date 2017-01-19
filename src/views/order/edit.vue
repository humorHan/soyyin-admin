<!-- edit.vue -->
<template>
    <div class="container-fluid">
        <ul class="breadcrumb">
            <li>订单系统</li>
            <li>订单管理</li>
            <li>编辑订单：<a class="btn-link" v-link="{path:'/order/detail/'+orderId}" v-if="orderId">{{orderId}}</a></li>
        </ul>
        <form class="form-inline pull-right" style="margin-top: 16px;" v-if="orderId && permissionList.assignManager">
            <label>客户经理/客服：</label>
            <select class="form-control input-sm" style="width:100px;" v-model="manager.id" number @change="changeManager">
                <option v-for="manager of managerList" :value="manager.id">{{manager.display_name}}</option>
            </select>
        </form>
        <h3>编辑订单</h3>
        <p class="clearfix"></p>
        <div class="panel panel-default">
            <div class="panel-heading">商品清单</div>
            <div class="panel-body">
                <table class="table table-bordered table-hover product-table">
                    <thead>
                        <tr>
                            <th style="width:6%;">ID</th>
                            <th style="width:15%;">产品名称</th>
                            <th style="width:25%;">参数</th>
                            <th style="width:10%;">数量</th>
                            <th style="width:10%;">价格(元)</th>
                            <th style="width:22%;">到货时间要求</th>
                            <th style="width:12%;">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item of orderItems">
                            <td>{{item.id}}</td>
                            <template v-if="item.is_custom">
                                <td>{{item.detail.name}}</td>
                                <td>
                                    <a class="btn-link" @click="showProductDetailDialog(item)">
                                        {{item.detail.size}}{{(item.detail.size && (item.detail.caizhi || item.detail.others)) ? '_' : ''}}{{item.detail.caizhi}}{{(item.detail.caizhi && item.detail.others) ? '_' : ''}}{{item.detail.others}}
                                    </a>
                                </td>
                                <td>{{item.detail.quantity}}</td>
                            </template>
                            <template v-else>
                                <td>
                                    <a class="btn-link" :href="'http://www.soyyin.com/product?id='+item.product_id+'#'+item.brief" target="_blank">{{item.title}}</a>
                                </td>
                                <td>{{item.brief}}</td>
                                <td>{{item.quantity}}</td>
                            </template>
                            <td>{{item.price === 0 ? '暂无' : ''}}{{(item.price === 0 ? '' : item.price ) | realPrice}}</td>
                            <td>{{item.arrival_time}}</td>
                            <td>
                                <a class="btn-link" @click="editProduct(item)">编辑</a>
                                <a class="btn-link show-right" v-if="((!isPayed) && item.produce_status === 'NOT_PRODUCE')" @click="showDeleteProductDialog(item)">删除</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <a class="btn btn-info btn-sm" v-if="orderId && !isPayed" @click="addProduct">添加商品</a>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">收货人信息</div>
            <div class="panel-body">
                <table class="table table-bordered table-hover consignee-table">
                    <thead>
                        <tr>
                            <th style="width:10%;">姓名</th>
                            <th style="width:12%;">手机号</th>
                            <th style="width:28%;">地址</th>
                            <th style="width:8%;">邮编</th>
                            <th style="width:30%;">收货备注</th>
                            <th style="width:12%;">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item of consignees">
                            <td>{{item.name}}</td>
                            <td>{{item.phone}}</td>
                            <td>
                                <span v-for="region of item.regions">{{region.name}}</span>
                                {{item.address}}
                            </td>
                            <td>{{item.post_code}}</td>
                            <td>{{item.remark}}</td>
                            <td>
                                <a class="btn-link" @click="editConsignee(item)">编辑</a>
                                <a class="btn-link show-right" v-if="item.logistics.length === 0" @click="showDeleteConsigneeDialog(item)">删除</a>  
                            </td>
                        </tr>
                    </tbody>
                </table>
                <a class="btn btn-info btn-sm" v-if="orderId" @click="addConsignee">增加收货地址</a>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-7">
                <div class="panel panel-default">
                    <div class="panel-heading">付款方式</div>
                    <div class="panel-body">
                        <form class="form-horizontal">
                            <div class="radio">
                                <label>
                                    <input type="radio" id="payment1" :disabled="orderBasic.status !== 'SUBMITTED'" v-model="paymentData.payment" value="ONLINE">
                                    在线支付
                                </label>
                            </div>
                            <div class="radio form-inline">
                                <label>
                                    <input type="radio" id="payment2" :disabled="orderBasic.status !== 'SUBMITTED'" v-model="paymentData.payment" value="CASH_ON_DELIVERY">
                                    货到付款
                                </label>
                                <input class="form-control input-sm" style="width:300px;margin-left:10px;" type="text" placeholder="付款时间及金额说明(选填)" v-model="paymentData.remark">
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-lg-5">
                <div class="panel panel-default">
                    <div class="panel-heading">订单日期</div>
                    <div class="panel-body">
                        <div class="form-group">
                            <label class="control-label" for="orderDate">请选择日期<span class="text-danger">*</span></label>
                            <input class="form-control input-sm" id="orderDate" style="width:200px;" readOnly="true" v-model="orderDate | datePickerFilter">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">客户信息</div>
            <div class="panel-body">
                <form class="form-horizontal">
                    <div class="col-xs-2">
                        <label class="control-label" for="customerName">客户名称<span class="text-danger">*</span></label>
                        <input class="form-control input-sm" id="customerName" type="text" v-model="orderBasic.customer.name">
                    </div>
                    <div class="col-xs-2">
                        <label class="control-label" for="customerPhone">联系电话</label>
                        <input class="form-control input-sm" id="customerPhone" type="text" v-model="orderBasic.customer.phone">
                    </div>
                    <div class="col-xs-2">
                        <label class="control-label" for="customerQQ">QQ</label>
                        <input class="form-control input-sm" id="customerQQ" type="text" v-model="orderBasic.customer.qq">
                    </div>
                    <div class="col-xs-2">
                        <label class="control-label" for="customerCompany">公司</label>
                        <input class="form-control input-sm" id="customerCompany" type="text" v-model="orderBasic.customer.company">
                    </div>
                </form>
            </div>
        </div>
        <edit-invoice-info-component :edit-invoice-checked.sync="editInvoiceChecked" :invoice-data="invoiceInfo" :consignees="consigneesForInvoiceInfo"></edit-invoice-info-component>
        <div class="panel panel-default">
            <div class="panel-heading">其他信息</div>
            <div class="panel-body">
                <div class="form-group col-md-8">
                    <label class="control-label" for="orderRemark">备注：</label>
                    <textarea class="form-control" style="height:100px;" id="orderRemark" v-model="orderBasic.remark"></textarea>
                </div>
            </div>
        </div>
        <div>
            <a class="btn btn-info btn-lg pull-right" v-if="orderId" @click="editOrder">确认修改</a>
        </div>
        <edit-or-add-product-dialog :show.sync="dataForEditOrAddProductDialog.show" :data="dataForEditOrAddProductDialog.data"></edit-or-add-product-dialog>
        <product-detail-dialog :show.sync="dataForProductDetailDialog.show" :detail="dataForProductDetailDialog.detail"></product-detail-dialog>
        <edit-or-add-consignee-dialog :show.sync="dataForEditOrAddConsigneeDialog.show" :data="dataForEditOrAddConsigneeDialog.data"></edit-or-add-consignee-dialog>
        <popup-tips :show.sync="dataForPopupTips.show" :tips-type="dataForPopupTips.type" :tips-title="dataForPopupTips.title" :tips-content="dataForPopupTips.content"></popup-tips>
        <popup-dialog :show-dialog.sync="dataForPopupDialog.show" :dialog-title="dataForPopupDialog.title" :dialog-content="dataForPopupDialog.content"></popup-dialog>
    </div>
</template>

<script>
import Vue from 'vue'
import editInvoiceInfoComponent from './comp/editInvoiceInfoComponent.vue'
import popupDialog from '../../components/popupDialog.vue'
import productDetailDialog from './comp/productDetailDialog.vue'
import popupTips from '../../components/popupTips.vue'
import editOrAddProductDialog from './comp/editOrAddProductDialog.vue'
import editOrAddConsigneeDialog from './comp/editOrAddConsigneeDialog.vue'
import { callback } from '../../store/index.js'
import { orderValidator } from '../../store/dataValidator.js'
import { permissionValidator } from '../../store/rolePermission.js'
import $ from 'jquery'

const DELETE_PRODUCT = "DELETE_PRODUCT";
const DELETE_CONSIGNEEITEM = "DELETE_CONSIGNEEITEM";

export default {
    name: 'OrderEditView',
    components: {
        editInvoiceInfoComponent,
        productDetailDialog,
        popupTips,
        popupDialog,
        editOrAddProductDialog,
        editOrAddConsigneeDialog,
    },
    route: {
        data({to}) {
            var orderId = to.params.id
            if(!orderId) {
                this.$route.router.go({ path: '/order/list' });
            }
            this.getOrderDetial(orderId);
            if (this.permissionList.assignManager) {
                this.getManager();
            }
        }
    },
    ready() {
        $("#orderDate").datetimepicker({
            format: "yyyy-mm-dd",
            language: "zh-CN",
            todayHighlight: true,
            autoclose: true,
            minView: 2,
            endDate: new Date(),
        });
    },
    computed: {
        isPayed() {
            if (!this.orderBasic) {
                return false;
            }
            if (this.orderBasic.status == 'DELIVERY_PAID' || this.orderBasic.status == 'ONLINE_PAID' || this.orderBasic.status == 'ONLINE_CONFIRMED' || this.orderBasic.status == 'FINISHED') {
                return true;
            }
            return false;
        },
        consigneesForInvoiceInfo() {
            var result = [];
            for (let i = 0; i < this.consignees.length; i++) {
                var consignee = {
                    name: this.consignees[i].name,
                    phone: this.consignees[i].phone,
                    address: this.consignees[i].address,
                };
                consignee.fullRegionName = '';
                for (let j = 0; j < this.consignees[i].regions.length; j++) {
                    consignee.fullRegionName += this.consignees[i].regions[j].name;
                }
                result.push(consignee);
            }
            return result;
        },
    },
    data() {
        return {
            orderId: '',
            orderBasic: {
                customer: {
                },
            },
            manager: {},
            orderItems: [],
            consignees: [],
            paymentData: {},
            editInvoiceChecked: false,
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
            orderDate: 0,
            permissionList: {
                assignManager: permissionValidator.orderSystem.order.assignManager(),
            },
            managerList: [],
            dataForProductDetailDialog: {
                show: false,
                detail: {
                    name: '',
                    quantity: '',
                    size: '',
                    caizhi: '',
                    others:'',
                }
            },
            dataForEditOrAddProductDialog: {
                show: false,
                data: {
                    orderId: '',
                    orderProductId: '',
                    isCustom: true,
                    custom: {
                        name: '',
                        quantity: '',
                        size: '',
                        caizhi: '',
                        others: '',
                    },
                    standard: null,
                    price: '',
                    arrival_time: '',
                    isAllEditable: true,
                },
            },
            dataForEditOrAddConsigneeDialog: {
                show: false,
                data: {
                    orderId: '',
                    orderConsigneeId: '',
                    name: '',
                    phone: '',
                    regions: [],
                    region_id: 0,
                    address: '',
                    post_code: '',
                    remark: '',
                },
            },
            dataForPopupTips: {
                show: false,
                type: 'danger',
                title: '',
                content: '',
            },
            dataForPopupDialog: {
                show: false,
                title: '删除确认',
                content: '',
            },
        }
    },
    events: {
        'click-positive-button'() {
            if (this.dataForPopupDialog.dialogId === DELETE_PRODUCT) {
                this.deleteProduct(this.dataForPopupDialog.passingData);
            } else if (this.dataForPopupDialog.dialogId === DELETE_CONSIGNEEITEM) {
                this.deleteConsignee(this.dataForPopupDialog.passingData);
            }
        },
        'add-custom-product'(result) {
            var orderItem = {
                id: result.id,
                is_custom: true,
                price: result.data.price,
                detail: result.data.detail,
                arrival_time: result.data.arrival_time,
                produce_status: 'NOT_PRODUCE',
            };
            this.orderItems.push(orderItem);
        },
        'edit-custom-product'(result) {
            var orderItem = this.findOrderItem(result.id);
            if (orderItem) {
                orderItem.detail = result.data.detail;
                orderItem.price = result.data.price;
                if (orderItem.arrival_time === undefined) {
                    Vue.set(orderItem, 'arrival_time', result.data.arrival_time);
                } else {
                    orderItem.arrival_time = result.data.arrival_time;
                }
            }
        },
        'edit-product'(result) {
            var orderItem = this.findOrderItem(result.id);
            if (orderItem) {
                orderItem.quantity = result.data.quantity;
                orderItem.price = result.data.price;
                if (orderItem.arrival_time === undefined) {
                    Vue.set(orderItem, 'arrival_time', result.data.arrival_time);
                } else {
                    orderItem.arrival_time = result.data.arrival_time;
                }
            }
        },
        'edit-arrival-time'(result) {
            var orderItem = this.findOrderItem(result.id);
            if (orderItem) {
                if (orderItem.arrival_time === undefined) {
                    Vue.set(orderItem, 'arrival_time', result.data.arrival_time);
                } else {
                    orderItem.arrival_time = result.data.arrival_time;
                }
            }
        },
        'add-consignee'(result) {
            var consigneeItem = {
                id: result.id,
                name: result.data.name,
                phone: result.data.phone,
                region_id: result.data.region_id,
                address: result.data.address,
                post_code: result.data.post_code,
                remark: result.data.remark,
                regions: result.data.regions,
                logistics: [],
            };
            this.consignees.push(consigneeItem);
        },
        'edit-consignee'(result) {
            var consigneeItem = this.findConsigneeItem(result.id);
            if (consigneeItem) {
                consigneeItem.name = result.data.name;
                consigneeItem.phone = result.data.phone;
                consigneeItem.region_id = result.data.region_id;
                consigneeItem.address = result.data.address;
                if (consigneeItem.post_code === undefined) {
                    Vue.set(consigneeItem, 'post_code', result.data.post_code);
                } else {
                    consigneeItem.post_code = result.data.post_code;
                }
                if (consigneeItem.remark === undefined) {
                    Vue.set(consigneeItem, 'remark', result.data.remark);
                } else {
                    consigneeItem.remark = result.data.remark;
                }
                consigneeItem.regions = result.data.regions;
            }
        },
    },
    methods: {
        findOrderItem(id) {
            for (var i = 0; i < this.orderItems.length; i++) {
                if (this.orderItems[i].id === id) {
                    return this.orderItems[i];
                }
            }
        },
        findConsigneeItem(id) {
            for (var i = 0; i < this.consignees.length; i++) {
                if (this.consignees[i].id === id) {
                    return this.consignees[i];
                }
            }
        },
        showPupupTips(title, content, type = 'danger') {
            this.dataForPopupTips.show = true;
            this.dataForPopupTips.type = type;
            this.dataForPopupTips.title = title;
            this.dataForPopupTips.content = content;
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
            });
        },
        changeManager(event) {
            var url = '/api/v2/admin/orders/set-manager?order_id=' + this.orderId + '&manager_id=' + this.manager.id;
            this.$http.put(url)
            .then((response) => {
                if(!response.data.result || response.data.result === 0){
                    this.showPupupTips('操作成功', '修改客户经理/客服成功', 'success');
                } else {
                    callback.success(response.data);
                }
            },(response) => {
                callback.error(response);
            });
        },
        getOrderDetial(id) {
            var url = '/api/v2/admin/orders/detail-v2?id=' + id;
            this.$http.get(url)
            .then((response) => {
                if(!response.data.result || response.data.result === 0) { 
                    this.orderId = id;   
                    this.orderBasic = response.data.basic;
                    if (this.orderBasic.manager) {
                        this.manager = this.orderBasic.manager;
                    }
                    this.orderItems =response.data.items;
                    this.consignees = response.data.consignees;
                    this.paymentData = response.data.payment;
                    if (response.data.invoice) {
                        this.editInvoiceChecked = true;
                        this.invoiceInfo = response.data.invoice;
                    }
                    this.orderDate = response.data.time;
                } else {
                    callback.success(response.data);
                }
            },(response) => {
                callback.error(response);
            });
        },
        validateCustomer() {
            var result = orderValidator.validateCustomerName(this.orderBasic.customer.name);
            if (!result.ok) {
                return result.errorMsg;
            }
            return;
        },
        validateInvoiceInfo() {
            if (this.editInvoiceChecked) {
                var result = orderValidator.validateInvoiceAmount(this.invoiceInfo.amount);
                if (!result.ok) {
                    return result.errorMsg;
                }
                var infoName = ["开票内容", "开票抬头", "发票收货人", "发票收货人联系方式", "发票收货人收货地址"];
                var infoData = [this.invoiceInfo.content, this.invoiceInfo.title, this.invoiceInfo.consignee_name, this.invoiceInfo.consignee_phone, this.invoiceInfo.address];
                for (let i = 0; i < infoName.length; i++) {
                    result = orderValidator.validateInvoiceItem(infoName[i], infoData[i]);
                    if (!result.ok) {
                        return result.errorMsg;
                    }
                }
                if (this.invoiceInfo.zengzhishui) {
                    infoName = ["发票信息中纳税人识别号", "发票信息中注册地址", "发票信息中电话", "发票信息中开户行", "发票信息中账号"];
                    infoData = [this.invoiceInfo.zengzhishui.identifier, this.invoiceInfo.zengzhishui.address, this.invoiceInfo.zengzhishui.phone, this.invoiceInfo.zengzhishui.account, this.invoiceInfo.zengzhishui.bank];
                    for (let i = 0; i < infoName.length; i++) {
                        result = orderValidator.validateInvoiceItem(infoName[i], infoData[i]);
                        if (!result.ok) {
                            return result.errorMsg;
                        }
                    }
                }
            }
            return;
        },
        editOrder() {
            if (!this.orderDate) {
                this.dataForPopupTips.show = true;
                this.dataForPopupTips.title = '输入有误';
                this.dataForPopupTips.content = '订单日期不能为空';
                return;
            }
            var result = this.validateCustomer();
            if (result) {
                this.dataForPopupTips.show = true;
                this.dataForPopupTips.title = '输入有误';
                this.dataForPopupTips.content = result;
                return;
            }
            result = this.validateInvoiceInfo();
            if (result) {
                this.dataForPopupTips.show = true;
                this.dataForPopupTips.title = '输入有误';
                this.dataForPopupTips.content = result;
                return;
            }
            var url = '/api/v2/admin/orders/edit-basic?id=' + this.orderId;
            var data = {
                payment: this.paymentData.payment,
                payment_remark: this.paymentData.remark,
                customer: this.orderBasic.customer,
                remark: this.orderBasic.remark,
                time: this.orderDate,
            };
            if (this.editInvoiceChecked) {
                data.invoice = this.invoiceInfo;
            }
            this.$http.put(url, data)
            .then((response) => {
                if(!response.data.result || response.data.result === 0){
                    this.$route.router.go({ path: '/order/detail/' + this.orderId});
                } else {
                    callback.success(response.data);
                }
            },(response) => {
                callback.error(response);
            });
        },
        addProduct() {
            this.dataForEditOrAddProductDialog.show = true;
            this.dataForEditOrAddProductDialog.data.orderId = this.orderId;
            this.dataForEditOrAddProductDialog.data.orderProductId = '';
            this.dataForEditOrAddProductDialog.data.isCustom = true;
            this.dataForEditOrAddProductDialog.data.custom = {
                name: '',
                quantity: '',
                size: '',
                caizhi: '',
                others:'',
            };
            this.dataForEditOrAddProductDialog.data.standard = null;
            this.dataForEditOrAddProductDialog.data.price = '';
            this.dataForEditOrAddProductDialog.data.arrival_time = '';
            this.dataForEditOrAddProductDialog.data.isAllEditable = true;
        },
        editProduct(item) {
            this.dataForEditOrAddProductDialog.show = true;
            this.dataForEditOrAddProductDialog.data.orderId = this.orderId;
            this.dataForEditOrAddProductDialog.data.orderProductId = item.id;
            if (item.is_custom) {
                this.dataForEditOrAddProductDialog.data.isCustom = true;
                this.dataForEditOrAddProductDialog.data.custom = {
                    name: item.detail.name,
                    quantity: item.detail.quantity,
                    size: item.detail.size,
                    caizhi: item.detail.caizhi,
                    others: item.detail.others,
                };
                this.dataForEditOrAddProductDialog.data.standard = null;
            } else {
                this.dataForEditOrAddProductDialog.data.isCustom = false;
                this.dataForEditOrAddProductDialog.data.custom = null;
                this.dataForEditOrAddProductDialog.data.standard = {
                    quantity: item.quantity,
                };
            }
            this.dataForEditOrAddProductDialog.data.price = item.price;
            this.dataForEditOrAddProductDialog.data.arrival_time = item.arrival_time;
            this.dataForEditOrAddProductDialog.data.isAllEditable = ((!this.isPayed) && item.produce_status === 'NOT_PRODUCE');
        },
        showProductDetailDialog(item) {
            this.dataForProductDetailDialog.show = true;
            this.dataForProductDetailDialog.detail = {
                name: item.detail.name,
                quantity: item.detail.quantity,
                size: item.detail.size,
                caizhi: item.detail.caizhi,
                others: item.detail.others,
            }
        },
        showDeleteProductDialog(item) {
            this.dataForPopupDialog.show = true;
            this.dataForPopupDialog.content = "确定删除此条商品？";
            this.dataForPopupDialog.dialogId = DELETE_PRODUCT;
            this.dataForPopupDialog.passingData = item;
        },
        deleteProduct(item) {
            var url = '/api/v2/admin/orders/remove-item-v2?item_id=' + item.id;
            this.$http.delete(url)
            .then((response) => {
                if(!response.data.result || response.data.result === 0){
                    this.orderItems.$remove(item);
                    this.showPupupTips('操作成功', '删除商品成功', 'success');
                } else {
                    callback.success(response.data);
                }
            },(response) => {
                callback.error(response);
            });
        },
        addConsignee() {
            this.dataForEditOrAddConsigneeDialog.show = true;
            this.dataForEditOrAddConsigneeDialog.data.orderId = this.orderId;
            this.dataForEditOrAddConsigneeDialog.data.orderConsigneeId = '';
            this.dataForEditOrAddConsigneeDialog.data.name = '';
            this.dataForEditOrAddConsigneeDialog.data.phone = '';
            this.dataForEditOrAddConsigneeDialog.data.regions = [];
            this.dataForEditOrAddConsigneeDialog.data.region_id = 0;
            this.dataForEditOrAddConsigneeDialog.data.address = '';
            this.dataForEditOrAddConsigneeDialog.data.post_code = '';
            this.dataForEditOrAddConsigneeDialog.data.remark = '';
        },
        editConsignee(item) {
            var regions = [];
            for (var i = 0; i < item.regions.length; i++) {
                regions.push(item.regions[i].id);
            }
            this.dataForEditOrAddConsigneeDialog.show = true;
            this.dataForEditOrAddConsigneeDialog.data.orderId = this.orderId;
            this.dataForEditOrAddConsigneeDialog.data.orderConsigneeId = item.id;
            this.dataForEditOrAddConsigneeDialog.data.name = item.name;
            this.dataForEditOrAddConsigneeDialog.data.phone = item.phone;
            this.dataForEditOrAddConsigneeDialog.data.regions = regions;
            this.dataForEditOrAddConsigneeDialog.data.region_id = item.region_id;
            this.dataForEditOrAddConsigneeDialog.data.address = item.address;
            this.dataForEditOrAddConsigneeDialog.data.post_code = item.post_code;
            this.dataForEditOrAddConsigneeDialog.data.remark = item.remark;
        },
        showDeleteConsigneeDialog(item) {
            this.dataForPopupDialog.show = true;
            this.dataForPopupDialog.content = "确定删除此收货人？";
            this.dataForPopupDialog.dialogId = DELETE_CONSIGNEEITEM;
            this.dataForPopupDialog.passingData = item;
        },
        deleteConsignee(item) {
            var url = '/api/v2/admin/orders/remove-consignee?id=' + item.id;
            this.$http.delete(url)
            .then((response) => {
                if(!response.data.result || response.data.result === 0){
                    this.consignees.$remove(item);
                    this.showPupupTips('操作成功', '删除收货人成功', 'success');
                } else {
                    callback.success(response.data);
                }
            },(response) => {
                callback.error(response);
            })
        },
    }
}
</script>

<style scoped>
.product-table, .consignee-table {
    table-layout: fixed;
}

.product-table th, .product-table td, .consignee-table th, .consignee-table td {
    text-align: center;
    vertical-align: middle;
}

.product-table td .btn-link, .consignee-table td .btn-link {
    text-decoration: none;
    cursor: pointer;
}

.product-table td .btn-link:hover, .consignee-table td .btn-link:hover {
    text-decoration: underline;
}

.show-right{
    margin-left: 20px;
}
</style>