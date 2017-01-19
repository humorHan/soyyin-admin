<!-- editOrAddProductDialog.vue -->
<template>
    <div class="modal" v-show="show">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" @click="closeDialog">&times;</button>
                    <h4 class="modal-title">{{title}}</h4>
                </div>
                <div class="modal-body">
                    <form class="form-horizontal">
                        <template v-if="data.isCustom">
                            <div class="form-group">
                                <label class="col-lg-3 control-label" for="customName">产品名称<span class="text-danger">*</span>：</label>
                                <div class="col-lg-4">
                                    <input class="form-control input-sm" id="customName" type="text" :disabled="!data.isAllEditable" v-model="data.custom.name">
                                </div>
                                <span class="col-lg-2 text-danger help-block" v-show="!data.isAllEditable">无法修改</span>
                            </div>
                            <div class="form-group">
                                <label class="col-lg-3 control-label" for="customQuantity">数量<span class="text-danger">*</span>：</label>
                                <div class="col-lg-4">
                                    <input class="form-control input-sm" id="customQuantity" placeholder="100本" type="text" :disabled="!data.isAllEditable" v-model="data.custom.quantity">
                                </div>
                                <span class="col-lg-2 text-danger help-block" v-show="!data.isAllEditable">无法修改</span>
                            </div>
                            <div class="form-group">
                                <label class="col-lg-3 control-label" for="customSize">产品尺寸：</label>
                                <div class="col-lg-6">
                                    <input class="form-control input-sm" id="customSize" placeholder="长100*宽80，单位：毫米(mm)" type="text" :disabled="!data.isAllEditable" v-model="data.custom.size">
                                </div>
                                <span class="col-lg-2 text-danger help-block" v-show="!data.isAllEditable">无法修改</span>
                            </div>
                            <div class="form-group">
                                <label class="col-lg-3 control-label" for="customCaizhi">材质：</label>
                                <div class="col-lg-6">
                                    <input class="form-control input-sm" id="customCaizhi" placeholder="150g铜版纸" type="text" :disabled="!data.isAllEditable" v-model="data.custom.caizhi">
                                </div>
                                <span class="col-lg-2 text-danger help-block" v-show="!data.isAllEditable">无法修改</span>
                            </div>
                            <div class="form-group">
                                <label class="col-lg-3 control-label" for="customOthers">其他要求：</label>
                                <div class="col-lg-7">
                                    <textarea class="form-control input-sm" id="customOthers" placeholder="需要烫金等" type="text" :disabled="!data.isAllEditable" v-model="data.custom.others"></textarea>
                                </div>
                                <span class="col-lg-2 text-danger help-block" v-show="!data.isAllEditable">无法修改</span>
                            </div>
                        </template>
                        <template v-else>
                            <div class="form-group">
                                <label class="col-lg-3 control-label" for="productQuantity">数量<span class="text-danger">*</span>：</label>
                                <div class="col-lg-4">
                                    <input class="form-control input-sm" id="productQuantity" type="number" min="1" :disabled="!data.isAllEditable" v-model="data.standard.quantity" number>
                                </div>
                                <span class="col-lg-2 text-danger help-block" v-show="!data.isAllEditable">无法修改</span>
                            </div>
                        </template>
                        <div class="form-group">
                            <label class="col-lg-3 control-label" for="productPrice">价格<span class="text-danger">*</span>：</label>
                            <div class="col-lg-4">
                                <input class="form-control input-sm" id="productPrice" placeholder="单位：元" type="text" :disabled="!data.isAllEditable" v-model="data.price | priceFilter">
                            </div>
                            <span class="col-lg-2 text-danger help-block" v-show="!data.isAllEditable">无法修改</span>
                        </div>
                        <div class="form-group">
                            <label class="col-lg-3 control-label" for="productArrivalTime">到货时间要求：</label>
                            <div class="col-lg-6">
                                <input class="form-control input-sm" id="productArrivalTime" type="text" v-model="data.arrival_time">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" :disabled="!buttonEnabled" @click="confirmSubmit">确定</button>
                </div>
            </div>
        </div>
        <popup-tips :show.sync="dataForPopupTips.show" :tips-type="dataForPopupTips.type" :tips-title="dataForPopupTips.title" :tips-content="dataForPopupTips.content"></popup-tips>
    </div>
</template>

<script>
import popupTips from '../../../components/popupTips.vue'
import { callback } from '../../../store'
import { orderValidator } from '../../../store/dataValidator.js'

export default {
    name: 'EditOrAddProductDialogView',
    components: {
        popupTips,
    },
    props: ['show', 'data'],
    data() {
        return {
            buttonEnabled: true,
            dataForPopupTips: {
                show: false,
                type: 'danger',
                title: '',
                content: '',
            },
        }
    },
    computed: {
        title() {
            if (this.data.orderProductId) {
                if (this.data.isCustom) {
                    return '编辑非标品';
                } else {
                    return '编辑标准品';
                }
            } else {
                return '新增非标品';
            }
        },
    },
    methods: {
        validateCustomProduct(custom, price) {
            var result = orderValidator.validateProductName(custom.name);
            if (!result.ok) {
                return result.errorMsg;
            }
            result = orderValidator.validateProductQuantity(custom.quantity);
            if (!result.ok) {
                return result.errorMsg;
            }
            result = orderValidator.validateProductPrice(price);
            if (!result.ok) {
                return result.errorMsg;
            }
            return;
        },
        validateProduct(quantity, price) {
            if (!quantity) {
                return '产品数量不能为空或者0';
            }
            var result = orderValidator.validateProductPrice(price);
            if (!result.ok) {
                return result.errorMsg;
            }
            return;
        },
        confirmSubmit() {
            if (this.buttonEnabled) {
                this.buttonEnabled = false;
                if (this.data.orderProductId) {
                    if (this.data.isAllEditable) {
                        if (this.data.isCustom) {
                            this.editCustomProduct();
                        } else {
                            this.editProduct();
                        }
                    } else {
                        this.editArrivalTime();
                    }
                } else {
                    this.addCustomProduct();
                }
            }
        },
        addCustomProduct() {
            var result = this.validateCustomProduct(this.data.custom, this.data.price);
            if(result) {
                this.dataForPopupTips.show = true;
                this.dataForPopupTips.title = '输入有误';
                this.dataForPopupTips.content = result;
                this.buttonEnabled = true;
                return;
            }
            var data = {
                detail: {
                    name: this.data.custom.name,
                    quantity: this.data.custom.quantity,
                    size: this.data.custom.size,
                    caizhi: this.data.custom.caizhi,
                    others: this.data.custom.others,
                },
                price: this.data.price,
                arrival_time: this.data.arrival_time
            };
            var url = '/api/v2/admin/orders/add-custom-item?order_id=' + this.data.orderId;
            this.submitToServer('add-custom-product', url, data, null);
        },
        editCustomProduct() {
            var result = this.validateCustomProduct(this.data.custom, this.data.price);
            if(result) {
                this.dataForPopupTips.show = true;
                this.dataForPopupTips.title = '输入有误';
                this.dataForPopupTips.content = result;
                this.buttonEnabled = true;
                return;
            }
            var data = {
                detail: {
                    name: this.data.custom.name,
                    quantity: this.data.custom.quantity,
                    size: this.data.custom.size,
                    caizhi: this.data.custom.caizhi,
                    others: this.data.custom.others,
                },
                price: this.data.price,
                arrival_time: this.data.arrival_time
            };
            var url = '/api/v2/admin/orders/update-custom-item?id=' + this.data.orderProductId;
            this.submitToServer('edit-custom-product', url, data, this.data.orderProductId);
        },
        editProduct() {
            var result = this.validateProduct(this.data.standard.quantity, this.data.price);
            if(result) {
                this.dataForPopupTips.show = true;
                this.dataForPopupTips.title = '输入有误';
                this.dataForPopupTips.content = result;
                this.buttonEnabled = true;
                return;
            }
            var data = {
                quantity: this.data.standard.quantity,
                price: this.data.price,
                arrival_time: this.data.arrival_time
            };
            var url = '/api/v2/admin/orders/update-item?id='+ this.data.orderProductId;
            this.submitToServer('edit-product', url, data, this.data.orderProductId);
        },
        editArrivalTime() {
            var data = {
                arrival_time: this.data.arrival_time
            };
            var url = '/api/v2/admin/orders/update-item-arrival-time?id='+ this.data.orderProductId;
            this.submitToServer('edit-arrival-time', url, data, this.data.orderProductId);
        },
        submitToServer(type, url, data, id) {
            this.$http.put(url, data)
            .then((response) => {
                if(!response.data.result || response.data.result === 0) {
                    if (!id) {
                        id = response.data.id;
                    }
                    var result = {
                        id: id,
                        data: data,
                    };
                    this.show = false;
                    this.$dispatch(type, result);
                } else {
                    callback.success(response.data);
                }
                this.buttonEnabled = true;
            },(response) => {
                callback.error(response);
                this.buttonEnabled = true;
            });
        },
        closeDialog() {
            this.show = false;
        },
    }
}
</script>

<style scoped>
.modal {
    height: 100%;
}

.modal-dialog {
    top: 20%;
}

</style>