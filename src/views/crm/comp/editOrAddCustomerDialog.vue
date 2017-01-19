<!-- editOrAddCustomerDialog.vue -->
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
                            <label class="col-lg-4 control-label" for="customerName">客户名称<span class="text-danger">*</span>：</label>
                            <div class="col-lg-6">
                                <input class="form-control input-sm" id="customerName" type="text" v-model="data.name">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="customerCompany">公司<span class="text-danger">*</span>：</label>
                            <div class="col-lg-6">
                                <input class="form-control input-sm" id="customerCompany" type="text" v-model="data.company">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="customerPhone">联系电话：</label>
                            <div class="col-lg-6">
                                <input class="form-control input-sm" id="customerPhone" type="text" v-model="data.phone">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="customerQQ">QQ：</label>
                            <div class="col-lg-6">
                                <input class="form-control input-sm" id="customerQQ" type="text" v-model="data.qq">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="customerAddress">地址：</label>
                            <div class="col-lg-6">
                                <input class="form-control input-sm" id="customerAddress" type="text" v-model="data.address">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="customerRemark">备注：</label>
                            <div class="col-lg-6">
                                <input class="form-control input-sm" id="customerRemark" type="text" v-model="data.remark">
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
    name: 'EditOrAddCustomerDialogView',
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
            if (this.data.customerId) {
                return '编辑客户';
            } else {
                return '新增客户';
            }
        },
    },
    methods: {
        validateCustomers() {
            var result = crmValidator.validateCustomerName(this.data.name);
            if (!result.ok) {
                return result.errorMsg;
            }
            result = crmValidator.validateCustomerCompany(this.data.company);
            if (!result.ok) {
                return result.errorMsg;
            }
            return;
        },
        confirmSubmit() {
            if (this.buttonEnabled) {
                this.buttonEnabled = false;
                if (this.data.customerId) {
                    this.editCustomer();
                } else {
                    this.addCustomer();
                }
            }
        },
        addCustomer() {
            var result = this.validateCustomers();
            if (result) {
                this.dataForPopupTips.show = true;
                this.dataForPopupTips.title = '输入有误';
                this.dataForPopupTips.content = result;
                this.buttonEnabled = true;
                return;
            }
            var url = '/api/v2/admin/customers/add';
            var data = {
                name: this.data.name,
                company: this.data.company,
                phone: this.data.phone,
                qq: this.data.qq,
                address: this.data.address,
                remark: this.data.remark,
            };
            this.$http.post(url, data)
            .then((response) => {
                if(!response.data.result || response.data.result === 0) {
                    this.show = false;
                    this.$dispatch('add-customer');
                } else {
                    callback.success(response.data);
                }
                this.buttonEnabled = true;
            },(response) => {
                callback.error(response);
                this.buttonEnabled = true;
            });
        },
        editCustomer() {
            var result = this.validateCustomers();
            if (result) {
                this.dataForPopupTips.show = true;
                this.dataForPopupTips.title = '输入有误';
                this.dataForPopupTips.content = result;
                this.buttonEnabled = true;
                return;
            }
            var url = '/api/v2/admin/customers/update?id=' + this.data.customerId;
            var data = {
                name: this.data.name,
                company: this.data.company,
                phone: this.data.phone,
                qq: this.data.qq,
                address: this.data.address,
                remark: this.data.remark,
            };
            this.$http.put(url, data)
            .then((response) => {
                if(!response.data.result || response.data.result === 0) {
                    this.show = false;
                    var result = {
                        id: this.data.customerId,
                        data: data,
                    };
                    this.$dispatch('edit-customer', result);
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