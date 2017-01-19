<!-- recordReceivablesDialog.vue -->
<template>
    <div class="modal" v-show="show">
    	<div class="modal-dialog">
            <div class="modal-content">
            	<div class="modal-header">
                    <button type="button" class="close" @click="closeDialog">&times;</button>
                    <h4 class="modal-title">收款信息录入</h4>
                </div>
                <div class="modal-body">
                    <form class="form-horizontal">
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="paymentMethod">付款方式<span class="text-danger">*</span>：</label>
                            <div class="col-lg-6">
                                <select class="form-control input-sm" id="paymentMethod" v-model="data.paymentMethod">
                                    <option value="BANK_TRANSFER">银行转账</option>
                                    <option value="ALIPAY_TRANSFER">支付宝转账</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="paymentAmount">付款金额<span class="text-danger">*</span>：</label>
                            <div class="col-lg-6">
                                <input class="form-control input-sm" id="paymentAmount" type="text" v-model="data.paymentAmount | priceFilter">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="paymentOrderId">支付单号：</label>
                            <div class="col-lg-6">
                                <input class="form-control input-sm" id="paymentOrderId" type="text" v-model="data.paymentOrderId">
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
import { financeValidator } from '../../../store/dataValidator.js'

export default {
    name: 'RecordReceivablesDialogView',
    components: {
        popupTips,
    },
    props: ['show', 'data', 'passingData'],
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
    methods: {
    	validatePaymentInfo() {
            var result;
            if (!this.data.paymentMethod) {
                return '请选择付款方式';
            }
            result = financeValidator.validatePaymentAmount(this.data.paymentAmount, this.data.maxPaymentAmount);
            if (!result.ok) {
                return result.errorMsg;
            }
            return;
        },
        confirmSubmit() {
            if (this.buttonEnabled) {
                this.buttonEnabled = false;
                this.addReceivables();
            }
        },
        addReceivables() {
        	var result = this.validatePaymentInfo();
            if(result) {
                this.dataForPopupTips.show = true;
                this.dataForPopupTips.title = '输入有误';
                this.dataForPopupTips.content = result;
                this.buttonEnabled = true;
                return;
            }
            var url = '/api/v2/admin/payment/add-record?order_id=' + this.data.orderId;
            var data = {
                method: this.data.paymentMethod,
                amount: this.data.paymentAmount,
                order_id: this.data.paymentOrderId,
            };
            this.$http.post(url, data)
            .then((response) => {
                if(!response.data.result || response.data.result === 0) {
                    this.show = false;
                    this.$dispatch('add-receivables', data, this.data.passingData);
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