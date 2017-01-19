<!-- orderCreate.vue -->
<template>
    <div class="container-fluid">
        <ul class="breadcrumb">
            <li>订单系统</li>
            <li>订单管理</li>
            <li>创建订单</li>
        </ul>
        <form class="form-inline pull-right" style="margin-top: 16px;" v-if="permissionList.assignManager">
            <label>客户经理/客服：</label>
            <select class="form-control input-sm" style="width:100px;" v-model="managerId" number>
                <option value="0">请选择成员</option>
                <option v-for="manager of managerList" :value="manager.id">{{manager.display_name}}</option>
            </select>
        </form>
        <h3>创建订单</h3>
        <p class="clearfix"></p>
        <div class="panel panel-default">
            <div class="panel-heading">非标品</div>
            <div class="panel-body">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th style="width:15%;">产品名称<span class="text-danger">*</span></th>
                            <th style="width:10%;">数量<span class="text-danger">*</span></th>
                            <th style="width:18%;">产品尺寸</th>
                            <th style="width:18%;">材质</th>
                            <th style="width:15%;">其他要求</th>
                            <th style="width:10%;">价格(元)<span class="text-danger">*</span></th>
                            <th style="width:14%;">到货时间要求</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input class="form-control input-sm" type="text" name="name" v-model="newProduct.name"></td>
                            <td><input class="form-control input-sm" type="text" name="quantity" v-model="newProduct.quantity" placeholder="100本"></td>
                            <td><input class="form-control input-sm" type="text" name="size" v-model="newProduct.size" placeholder="长100*宽80，单位：毫米(mm)"></td>
                            <td><input class="form-control input-sm" type="text" name="caizhi" v-model="newProduct.caizhi" placeholder="150g铜版纸"></td>
                            <td><input class="form-control input-sm" type="text" name="others" v-model="newProduct.others" placeholder="需要烫金等"></td>
                            <td><input class="form-control input-sm" type="text" name="price" v-model="newProduct.price | priceFilter"></td>
                            <td><input class="form-control input-sm" type="text" name="arrival_time" v-model="newProduct.arrival_time"></td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <a class="pull-right btn btn-info btn-sm" @click="addProduct">添加商品</a>
                </div>
            </div>
        </div>
        <table class="table table-bordered table-hover product-table" v-if="products.length>0">
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
                <tr v-for="product of products">
                    <td>{{$index + 1}}</td>
                    <td>{{product.name}}</td>
                    <td>
                        <a class="btn-link" @click="showProductDetailDialog(product)">
                            {{product.size}}{{(product.size && (product.caizhi || product.others)) ? '_' : ''}}{{product.caizhi}}{{(product.caizhi && product.others) ? '_' : ''}}{{product.others}}
                        </a>
                    </td>
                    <td>{{product.quantity}}</td>
                    <td>{{product.price | realPrice}}</td>
                    <td>{{product.arrival_time}}</td>
                    <td><a class="btn-link" style="color:#e74c3c;" @click="deleteProduct(product)">删除</a></td>
                </tr>
            </tbody>
        </table>
        <div class="row">
            <div class="col-lg-7">
                <div class="panel panel-default">
                    <div class="panel-heading">付款方式</div>
                    <div class="panel-body">
                        <form class="form-inline">
                            <label class="radio">
                                <input type="radio" name="payment" id="payment" value="CASH_ON_DELIVERY" checked>
                                货到付款
                            </label>
                            <input class="form-control input-sm" style="width:300px; margin-left:10px;" type="text" name="" placeholder="付款时间及金额说明(选填)" v-model="paymentRemark">
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-lg-5">
                <div class="panel panel-default">
                    <div class="panel-heading">订单日期</div>
                    <div class="panel-body">
                        <form class="form-inline">
                            <label class="control-label" for="orderDate">请选择日期</label>
                            <input class="form-control input-sm" id="orderDate" style="width:200px; margin-left:10px;" readOnly="true" v-model="orderDate | datePickerFilter">
                        </form>
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
                        <input class="form-control input-sm" id="customerName" type="text" v-model="customer.name">
                    </div>
                    <div class="col-xs-2">
                        <label class="control-label" for="customerPhone">联系电话</label>
                        <input class="form-control input-sm" id="customerPhone" type="text" v-model="customer.phone">
                    </div>
                    <div class="col-xs-2">
                        <label class="control-label" for="customerQQ">QQ</label>
                        <input class="form-control input-sm" id="customerQQ" type="text" v-model="customer.qq">
                    </div>
                    <div class="col-xs-2">
                        <label class="control-label" for="customerCompany">公司</label>
                        <input class="form-control input-sm" id="customerCompany" type="text" v-model="customer.company">
                    </div>
                </form>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">收货人信息</div>
            <div class="panel-body">
                <template v-for="item of consignees">
                    <edit-consignee-item :item="item" :index="$index" :length="consignees.length"></edit-consignee-item>
                </template>
                <a class="btn btn-info" v-on:click="addConsignee">增加收货地址</a>
            </div>
        </div>
        <edit-invoice-info-component :edit-invoice-checked.sync="editInvoiceChecked" :invoice-data="invoiceInfo" :consignees="consignees"></edit-invoice-info-component>
        <div>
            <a class="btn btn-info btn-lg pull-right" @click="createOrder">提交订单</a>
        </div>
        <product-detail-dialog :show.sync="dataForProductDetailDialog.show" :detail="dataForProductDetailDialog.detail"></product-detail-dialog>
        <popup-tips :show.sync="dataForPopupTips.show" :tips-type="dataForPopupTips.type" :tips-title="dataForPopupTips.title" :tips-content="dataForPopupTips.content"></popup-tips>
        <popup-dialog :show-dialog.sync="dataForPopupDialog.show" :dialog-title="dataForPopupDialog.title" :dialog-content="dataForPopupDialog.content"></popup-dialog>
    </div>
</template>

<script>
import editConsigneeItem from './comp/editConsigneeItem.vue'
import editInvoiceInfoComponent from './comp/editInvoiceInfoComponent.vue'
import popupDialog from '../../components/popupDialog.vue'
import productDetailDialog from './comp/productDetailDialog.vue'
import popupTips from '../../components/popupTips.vue'
import { callback } from '../../store/index.js'
import { orderValidator } from '../../store/dataValidator.js'
import { permissionValidator } from '../../store/rolePermission.js'
import $ from 'jquery'

const DELETE_PRODUCT = "DELETE_PRODUCT";
const DELETE_CONSIGNEEITEM = "DELETE_CONSIGNEEITEM";

export default {
    name: 'OrderCreateView',
    components: {
        editConsigneeItem,
        editInvoiceInfoComponent,
        productDetailDialog,
        popupTips,
        popupDialog,
    },
    route: {
        data({to}) {
            var copyFromOrderId = to.params.id;
            if (copyFromOrderId) {
                this.getOrderDetial(copyFromOrderId);
            }
        }
    },
    ready() {
        if (this.permissionList.assignManager) {
            this.getManager();
        }
        $("#orderDate").datetimepicker({
            format: "yyyy-mm-dd",
            language: "zh-CN",
            todayHighlight: true,
            autoclose: true,
            minView: 2,
            endDate: new Date(),
        });
    },
    data() {
        return {
            paymentRemark: '',
            newProduct: {
                name: '',
                quantity: '',
                size: '',
                caizhi: '',
                others: '',
                price: '',
                arrival_time: '',
            },
            products: [],
            customer: {
                name: '',
                phone: '',
                qq: '',
                company: '',
            },
            consignees: [{
                name: '',
                phone: '',
                region_id: 0,
                address: '',
                post_code: '',
                remark: ''
            }],
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
            permissionList: {
                assignManager: permissionValidator.orderSystem.order.assignManager(),
            },
            managerId: 0,
            managerList: [],
            orderDate: 0,
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
        'delete-consignee'(item) {
            this.dataForPopupDialog.show = true;
            this.dataForPopupDialog.content = "确定删除此收货人？";
            this.dataForPopupDialog.dialogId = DELETE_CONSIGNEEITEM;
            this.dataForPopupDialog.passingData = item;
        },
        'click-positive-button'() {
            if (this.dataForPopupDialog.dialogId === DELETE_PRODUCT) {
                this.products.$remove(this.dataForPopupDialog.passingData);
            } else if (this.dataForPopupDialog.dialogId === DELETE_CONSIGNEEITEM) {
                this.consignees.$remove(this.dataForPopupDialog.passingData);
            }
        },
        'edit-consignee-region'(result) {
            result.target.region_id = result.data.regionId;
            result.target.fullRegionName = '';
            if (result.data.regionId !== 0) {
                for (let i = 0; i < result.data.allRegions.length; i++) {
                    result.target.fullRegionName += result.data.allRegions[i].name;
                }
            }
        },
    },
    methods: {
        getOrderDetial(id) {
            var url = '/api/v2/admin/orders/detail-v2?id=' + id
            this.$http.get(url)
            .then((response) => {
                if(!response.data.result || response.data.result === 0) {
                    var customerToCopy = response.data.basic.customer;
                    this.customer.name = customerToCopy.name;
                    this.customer.phone = customerToCopy.phone;
                    this.customer.qq = customerToCopy.qq;
                    this.customer.company = customerToCopy.company;

                    var consigneesToCopy = response.data.consignees;
                    this.consignees = [];
                    for (let i = 0; i < consigneesToCopy.length; i++) {
                        let regions = [];
                        for (let j = 0; j < consigneesToCopy[i].regions.length; j++) {
                            regions.push(consigneesToCopy[i].regions[j].id);
                        }
                        this.consignees.push({
                            name: consigneesToCopy[i].name,
                            phone: consigneesToCopy[i].phone,
                            region_id: consigneesToCopy[i].region_id,
                            regions: regions,
                            address: consigneesToCopy[i].address,
                            post_code: consigneesToCopy[i].post_code,
                            remark: consigneesToCopy[i].remark,
                        });
                    }

                    if (response.data.invoice) {
                        this.editInvoiceChecked = true;
                        this.invoiceInfo = response.data.invoice;
                    }
                } else {
                    callback.success(response.data);
                }
            },(response) => {
                callback.error(response);
            })
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
        addConsignee() {
            var consignee = {
                name: '',
                phone: '',
                region_id: 0,
                address: '',
                post_code: '',
                remark: ''
            };
            this.consignees.push(consignee);
        },
        dataHandle(product) {
            return {
                detail: {
                    name: product.name,
                    quantity: product.quantity,
                    size: product.size,
                    caizhi: product.caizhi,
                    others: product.others,
                },
                price: product.price,
                arrival_time: product.arrival_time
            }
        },
        validateProduct() {
            var result = orderValidator.validateProductName(this.newProduct.name);
            if (!result.ok) {
                return result.errorMsg;
            }
            result = orderValidator.validateProductQuantity(this.newProduct.quantity);
            if (!result.ok) {
                return result.errorMsg;
            }
            result = orderValidator.validateProductPrice(this.newProduct.price);
            if (!result.ok) {
                return result.errorMsg;
            }
            return;
        },
        addProduct() {
            var result = this.validateProduct();
            if(result) {
                this.dataForPopupTips.show = true;
                this.dataForPopupTips.title = '输入有误';
                this.dataForPopupTips.content = result;
                return;
            }
            var item = {
                name: this.newProduct.name,
                quantity: this.newProduct.quantity,
                size: this.newProduct.size,
                caizhi: this.newProduct.caizhi,
                others: this.newProduct.others,
                arrival_time: this.newProduct.arrival_time,
                price: this.newProduct.price,
            }
            this.products.push(item);
            this.newProduct = {
                name: '',
                quantity: '',
                size: '',
                caizhi: '',
                others: '',
                price: '',
                arrival_time: '',
            }
        },
        deleteProduct(product) {
            this.dataForPopupDialog.show = true;
            this.dataForPopupDialog.content = "确定删除此条商品？";
            this.dataForPopupDialog.dialogId = DELETE_PRODUCT;
            this.dataForPopupDialog.passingData = product;
        },
        validateCustomerAndConsignees() {
            var result = orderValidator.validateCustomerName(this.customer.name);
            if (!result.ok) {
                return result.errorMsg;
            }
            for (let i = 0; i < this.consignees.length; i++) {
                let consigneeNow = this.consignees[i];
                let resultPrefixString = "收货人" + (i+1) + "：";
                result = orderValidator.validateConsigneeName(consigneeNow.name);
                if (!result.ok) {
                    return resultPrefixString + result.errorMsg;
                }
                result = orderValidator.validateConsigneePhone(consigneeNow.phone);
                if (!result.ok) {
                    return resultPrefixString + result.errorMsg;
                }
                result = orderValidator.validateConsigneeAddress(consigneeNow.region_id, consigneeNow.address);
                if (!result.ok) {
                    return resultPrefixString + result.errorMsg;
                }
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
        createOrder() {
            if (this.products.length === 0) {
                this.dataForPopupTips.show = true;
                this.dataForPopupTips.title = '输入有误';
                this.dataForPopupTips.content = '请添加商品';
                return;
            }
            var result = this.validateCustomerAndConsignees();
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
            var data = {
                items: this.products.map(this.dataHandle),
                payment: 'CASH_ON_DELIVERY',
                payment_remark: this.paymentRemark,
                customer: this.customer,
                consignees: this.consignees,
            }
            if (this.permissionList.assignManager) {
                if (this.managerId === 0) {
                    this.dataForPopupTips.show = true;
                    this.dataForPopupTips.title = '输入有误';
                    this.dataForPopupTips.content = '请指定客服经理/客服';
                    return;
                }
                data.manager_id = this.managerId;
            }
            if (this.editInvoiceChecked) {
                data.invoice = this.invoiceInfo;
            }
            if (this.orderDate) {
                data.time = this.orderDate;
            }
            var url = '/api/v2/admin/orders/create'
            this.$http.post(url, data)
            .then((response) => {
                if(!response.data.result || response.data.result === 0){
                    this.$route.router.go({ path: '/order/detail/' + response.data.id })
                } else {
                    callback.success(response.data)
                }
            },(response) => {
                callback.error(response)
            })
        },
        showProductDetailDialog(item) {
            this.dataForProductDetailDialog.show = true;
            this.dataForProductDetailDialog.detail = {
                name: item.name,
                quantity: item.quantity,
                size: item.size,
                caizhi: item.caizhi,
                others: item.others,
            }
        },
    }
}
</script>

<style scoped>
.product-table {
    table-layout: fixed;
}

.product-table th, .product-table td{
    text-align: center;
    vertical-align: middle;
}

.product-table td .btn-link {
    text-decoration: none;
    cursor: pointer;
}

.product-table td .btn-link:hover {
    text-decoration: underline;
}
</style>