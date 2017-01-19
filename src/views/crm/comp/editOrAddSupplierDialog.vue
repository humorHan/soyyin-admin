<!-- editOrAddSupplierDialog.vue -->
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
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="supplierName">供应商名称<span class="text-danger">*</span>：</label>
                            <div class="col-lg-6">
                                <input class="form-control input-sm" id="supplierName" type="text" v-model="data.name">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="supplyProduct">供应商品：</label>
                            <div class="col-lg-6">
                                <input class="form-control input-sm" id="supplyProduct" type="text" v-model="data.product">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="supplyArea">覆盖范围：</label>
                            <div class="col-lg-6">
                                <input class="form-control input-sm" id="supplyArea" type="text" v-model="data.region">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="supplierAddress">所在地址：</label>
                            <div class="col-lg-6">
                                <input class="form-control input-sm" id="supplierAddress" type="text" v-model="data.address">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="supplierContact">联系人：</label>
                            <div class="col-lg-6">
                                <input class="form-control input-sm" id="supplierContact" type="text" v-model="data.contact">
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
import { crmValidator } from '../../../store/dataValidator.js'

export default {
    name: 'EditOrAddSupplierDialogView',
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
            if (this.data.supplierId) {
                return '编辑供应商';
            } else {
                return '新增供应商';
            }
        },
    },
    methods: {
    	validateSuppliers() {
            var result = crmValidator.validateSupplierName(this.data.name);
            if (!result.ok) {
                return result.errorMsg;
            }
            return;
        },
        confirmSubmit() {
            if (this.buttonEnabled) {
                this.buttonEnabled = false;
                if (this.data.supplierId) {
                    this.editSuppliers();
                } else {
                    this.addSuppliers();
                }
            }
        },
        addSuppliers() {
        	var result = this.validateSuppliers();
            if(result) {
                this.dataForPopupTips.show = true;
                this.dataForPopupTips.title = '输入有误';
                this.dataForPopupTips.content = result;
                this.buttonEnabled = true;
                return;
            }
            var url = '/api/v2/admin/suppliers/add';
            var data = {
                name: this.data.name,
                product: this.data.product,
                region: this.data.region,
                address: this.data.address,
                contact: this.data.contact,
            };
            this.$http.post(url, data)
            .then((response) => {
                if(!response.data.result || response.data.result === 0) {
                    this.show = false;
                    this.$dispatch('add-supplier');
                } else {
                    callback.success(response.data);
                }
                this.buttonEnabled = true;
            },(response) => {
                callback.error(response);
                this.buttonEnabled = true;
            });
        },
    	editSuppliers() {
            var result = this.validateSuppliers();
            if(result) {
                this.dataForPopupTips.show = true;
                this.dataForPopupTips.title = '输入有误';
                this.dataForPopupTips.content = result;
                this.buttonEnabled = true;
                return;
            }
            var url = '/api/v2/admin/suppliers/edit?id=' + this.data.supplierId;
            var data = {
                name: this.data.name,
                product: this.data.product,
                region: this.data.region,
                address: this.data.address,
                contact: this.data.contact,
            };
            this.$http.put(url, data)
            .then((response) => {
                if(!response.data.result || response.data.result === 0) {
                    this.show = false;
                    this.$dispatch('edit-supplier');
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